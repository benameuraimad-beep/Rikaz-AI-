import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `أنت خبير في تحليل المعادن. حلل الصورة وأرجع JSON فقط:

1. التعرف على نوع المعدن أو الحجر الكريم
2. تقدير نقائه ودرجة جودته
3. تقدير كتلته التقريبية بناءً على الحجم الظاهر
4. تقدير قيمته السوقية التقريبية

يجب أن ترد بتنسيق JSON التالي فقط، بدون أي نص إضافي:

{
  "productName": "اسم المعدن أو الحجر",
  "analysisConfidence": {
    "productIdentification": "نسبة الثقة في التعرف (مثال: 85%)",
    "ocrAccuracy": "غير مطبق أو نسبة إذا كان هناك نص",
    "dataSource": "التحليل البصري للصورة"
  },
  "overallScore": 75,
  "verdict": "تقييم عام موجز",
  "summary": "ملخص التحليل في جملة أو جملتين",
  "mineralInfo": {
    "type": "نوع المعدن (ذهب، فضة، نحاس، كوارتز، الخ)",
    "purity": "درجة النقاء أو الجودة",
    "estimatedWeight": "الكتلة التقديرية (مثال: 50-100 جرام)",
    "marketValue": "القيمة السوقية التقريبية بالدولار الأمريكي (مثال: $50-100 USD)"
  },
  "positives": [
    {
      "component": "اسم الجانب الإيجابي",
      "value": "القيمة",
      "bonus": 10,
      "description": "وصف مختصر"
    }
  ],
  "negatives": [
    {
      "component": "اسم الجانب السلبي",
      "value": "القيمة",
      "severity": "mild/moderate/severe",
      "penalty": 10,
      "description": "وصف مختصر"
    }
  ],
  "questionable": [
    {
      "component": "جانب يحتاج مراجعة",
      "value": "القيمة",
      "description": "وصف"
    }
  ]
}

إذا لم تتمكن من التعرف على المعدن أو كانت الصورة غير واضحة، أرجع:
{
  "productName": "تحليل عينة معدنية غير محددة",
  "analysisConfidence": {
    "productIdentification": "0%",
    "ocrAccuracy": "غير مطبق",
    "dataSource": "لا توجد بيانات كافية للتحليل"
  },
  "overallScore": 0,
  "verdict": "غير قابل للتقييم - بيانات غير كافية",
  "summary": "الصورة غير واضحة أو لا تحتوي على معدن يمكن التعرف عليه",
  "negatives": [
    {
      "component": "جودة الصورة",
      "value": "غير كافية",
      "severity": "severe",
      "penalty": 100,
      "description": "يرجى تقديم صورة أوضح للمعدن"
    }
  ],
  "positives": [],
  "questionable": []
}`;

// Maximum image size: 5MB (base64 is ~1.33x larger than binary)
const MAX_BASE64_SIZE = 7 * 1024 * 1024; // ~5MB binary = ~7MB base64
const MIN_BASE64_SIZE = 100;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check for authorization header (JWT validation)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("Missing authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized - authentication required" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { imageBase64 } = await req.json();
    
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      console.error("Invalid request: missing or invalid imageBase64");
      return new Response(
        JSON.stringify({ error: "Image data is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Remove data URL prefix if present
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    // Validate size limits (prevent resource exhaustion)
    if (cleanBase64.length > MAX_BASE64_SIZE) {
      console.error("Image too large:", cleanBase64.length);
      return new Response(
        JSON.stringify({ error: "Image too large (max 5MB)" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (cleanBase64.length < MIN_BASE64_SIZE) {
      console.error("Image too small:", cleanBase64.length);
      return new Response(
        JSON.stringify({ error: "Invalid image - too small" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate base64 format
    const base64Pattern = /^[A-Za-z0-9+/=]+$/;
    if (!base64Pattern.test(cleanBase64)) {
      console.error("Invalid base64 image data");
      return new Response(
        JSON.stringify({ error: "Invalid image format" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Sending request to Lovable AI gateway...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: SYSTEM_PROMPT 
          },
          { 
            role: "user", 
            content: [
              { type: "text", text: "حلل هذا المعدن:" },
              { 
                type: "image_url", 
                image_url: { 
                  url: `data:image/jpeg;base64,${cleanBase64}` 
                } 
              }
            ]
          }
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(
          JSON.stringify({ error: "AI service quota exceeded." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log("Received response from AI gateway");

    const textContent = data.choices?.[0]?.message?.content;
    
    if (!textContent) {
      console.error("No response content from AI");
      return new Response(
        JSON.stringify({ error: "No response from AI service" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract JSON from the response
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in AI response");
      return new Response(
        JSON.stringify({ error: "Invalid AI response format" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let analysisResult;
    try {
      analysisResult = JSON.parse(jsonMatch[0]);
    } catch {
      console.error("Failed to parse JSON from AI response");
      return new Response(
        JSON.stringify({ error: "Failed to parse AI response" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Successfully analyzed mineral image");
    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("analyze-mineral error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
