import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

interface AnalysisData {
  productName: string;
  mineralInfo?: {
    type?: string;
    purity?: string;
    estimatedWeight?: string;
    marketValue?: string;
  };
  overallScore: number;
  verdict?: string;
  summary?: string;
}

export async function saveAnalysisToHistory(analysis: AnalysisData): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log("User not authenticated, skipping save to history");
      return false;
    }

    const { error } = await supabase
      .from("analysis_history")
      .insert([{
        user_id: user.id,
        product_name: analysis.productName,
        mineral_type: analysis.mineralInfo?.type || null,
        purity: analysis.mineralInfo?.purity || null,
        estimated_weight: analysis.mineralInfo?.estimatedWeight || null,
        market_value: analysis.mineralInfo?.marketValue || null,
        overall_score: analysis.overallScore,
        verdict: analysis.verdict || null,
        summary: analysis.summary || null,
        full_analysis: JSON.parse(JSON.stringify(analysis)) as Json
      }]);

    if (error) {
      console.error("Error saving analysis to history:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error saving analysis:", error);
    return false;
  }
}
