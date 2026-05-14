import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Gem, ArrowRight, ArrowLeft, Trash2, Calendar, TrendingUp, Loader2, History as HistoryIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalysisRecord {
  id: string;
  product_name: string;
  mineral_type: string | null;
  purity: string | null;
  market_value: string | null;
  overall_score: number;
  created_at: string;
}

const History = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, lang } = useLanguage();
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchAnalyses();
  }, [user]);

  const fetchAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from("analysis_history")
        .select("id, product_name, mineral_type, purity, market_value, overall_score, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setAnalyses(data || []);
    } catch (error) {
      console.error("Error fetching analyses:", error);
      toast({ title: t("auth.error"), description: t("history.loadError"), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const deleteAnalysis = async (id: string) => {
    try {
      const { error } = await supabase.from("analysis_history").delete().eq("id", id);
      if (error) throw error;
      setAnalyses(analyses.filter(a => a.id !== id));
      toast({ title: t("history.deleted"), description: t("history.deletedDesc") });
    } catch (error) {
      toast({ title: t("auth.error"), description: t("history.deleteError"), variant: "destructive" });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", {
      year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const BackArrow = lang === "ar" ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-background geometric-pattern">
      <header className="glass-card border-b border-border/50 sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-muted-foreground">
              <BackArrow className="h-4 w-4" />
              {t("history.home")}
            </Button>
            <h1 className="text-lg font-bold text-gradient-gold flex items-center gap-2">
              <HistoryIcon className="h-5 w-5" />
              {t("history.title")}
            </h1>
          </div>
        </div>
      </header>

      <main className="container py-6">
        {analyses.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Gem className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">{t("history.empty")}</h2>
            <p className="text-muted-foreground mb-6">{t("history.emptyDesc")}</p>
            <Button onClick={() => navigate("/")} className="bg-gradient-gold text-primary-foreground">{t("history.newAnalysis")}</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {analyses.map((analysis) => (
              <div key={analysis.id} className="glass-card rounded-2xl p-4 shadow-card">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="bg-gradient-gold p-2 rounded-xl">
                      <Gem className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{analysis.product_name}</h3>
                      {analysis.mineral_type && <p className="text-sm text-muted-foreground">{analysis.mineral_type}</p>}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(analysis.created_at)}</span>
                        {analysis.market_value && <span className="flex items-center gap-1 text-primary"><TrendingUp className="h-3 w-3" />{analysis.market_value}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-lg font-bold ${getScoreColor(analysis.overall_score)}`}>{analysis.overall_score}%</span>
                    <Button variant="ghost" size="icon" onClick={() => deleteAnalysis(analysis.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
