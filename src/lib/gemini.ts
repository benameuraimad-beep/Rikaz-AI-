import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

// Zod schema for validating AI response
const AnalysisConfidenceSchema = z.object({
  productIdentification: z.string().default("0%"),
  ocrAccuracy: z.string().default("غير مطبق"),
  dataSource: z.string().default("غير متوفر")
});

const ComponentSchema = z.object({
  component: z.string(),
  value: z.string(),
  description: z.string().optional()
});

const PositiveSchema = ComponentSchema.extend({
  bonus: z.number().optional()
});

const NegativeSchema = ComponentSchema.extend({
  severity: z.enum(["mild", "moderate", "severe"]).optional(),
  penalty: z.number().optional()
});

const MineralInfoSchema = z.object({
  type: z.string().optional(),
  purity: z.string().optional(),
  estimatedWeight: z.string().optional(),
  marketValue: z.string().optional()
}).optional();

const MineralAnalysisSchema = z.object({
  productName: z.string().default("معدن غير محدد"),
  analysisConfidence: AnalysisConfidenceSchema.optional(),
  overallScore: z.number().min(0).max(100).default(0),
  verdict: z.string().default("غير متوفر"),
  summary: z.string().default("لا يوجد ملخص"),
  mineralInfo: MineralInfoSchema,
  positives: z.array(PositiveSchema).default([]),
  negatives: z.array(NegativeSchema).default([]),
  questionable: z.array(ComponentSchema).default([])
});

// Logger that only logs in development
const logger = {
  error: (msg: string, data?: unknown) => {
    if (import.meta.env.DEV) {
      console.error(msg, data);
    }
  }
};

// Compress image for faster API requests
function compressImage(base64: string, maxWidth: number = 512): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height, 1);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.5));
    };
    img.src = base64;
  });
}

export async function analyzeMineralImage(imageBase64: string): Promise<any> {
  // Compress image first for speed
  const compressedImage = await compressImage(imageBase64);
  const base64Data = compressedImage.replace(/^data:image\/\w+;base64,/, "");

  try {
    const { data, error } = await supabase.functions.invoke('analyze-mineral', {
      body: { imageBase64: base64Data }
    });

    if (error) {
      logger.error("Edge function error", error);
      throw new Error(error.message || "Analysis failed");
    }

    if (data?.error) {
      logger.error("API error", data.error);
      throw new Error(data.error);
    }

    // Validate with zod schema
    const validationResult = MineralAnalysisSchema.safeParse(data);
    if (!validationResult.success) {
      logger.error("Schema validation failed", validationResult.error);
      // Return parsed data with defaults applied
      return MineralAnalysisSchema.parse({
        productName: data?.productName || "معدن غير محدد",
        overallScore: 0,
        verdict: "بيانات غير مكتملة",
        summary: "تم استلام بيانات غير مكتملة من التحليل"
      });
    }

    return validationResult.data;
  } catch (error) {
    logger.error("Analysis error", error);
    
    // Return default error response
    return {
      productName: "خطأ في التحليل",
      analysisConfidence: {
        productIdentification: "0%",
        ocrAccuracy: "غير مطبق",
        dataSource: "فشل الاتصال بخدمة التحليل"
      },
      overallScore: 0,
      verdict: "فشل التحليل",
      summary: "حدث خطأ أثناء تحليل الصورة. يرجى المحاولة مرة أخرى.",
      negatives: [
        {
          component: "اتصال الخدمة",
          value: "فشل",
          severity: "severe" as const,
          penalty: 100,
          description: "تعذر الاتصال بخدمة تحليل الذكاء الاصطناعي"
        }
      ],
      positives: [],
      questionable: []
    };
  }
}
