import { useState } from "react";
import Header from "@/components/Header";
import ImageUploader from "@/components/ImageUploader";
import AnalysisResult from "@/components/AnalysisResult";
import { analyzeMineralImage } from "@/lib/gemini";
import { saveAnalysisToHistory } from "@/lib/analysisHistory";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Sparkles, Shield, Zap } from "lucide-react";
import MiniMap from "@/components/MiniMap";

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLanguage();

  const handleImageSelect = async (imageData: string) => {
    setIsAnalyzing(true);
    
    try {
      const result = await analyzeMineralImage(imageData);
      setAnalysisResult(result);
      
      if (user) {
        const saved = await saveAnalysisToHistory(result);
        if (saved) {
          toast({
            title: t("toast.analysisSuccess"),
            description: `${t("toast.identified")} ${result.productName}`,
          });
        } else {
          toast({
            title: t("toast.analysisSuccessOnly"),
            description: `${t("toast.identified")} ${result.productName}`,
          });
        }
      } else {
        toast({
          title: t("toast.analysisSuccessOnly"),
          description: `${t("toast.identified")} ${result.productName} - ${t("toast.loginToSave")}`,
        });
      }
    } catch (error) {
      toast({
        title: t("toast.analysisError"),
        description: t("toast.analysisErrorDesc"),
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-background geometric-pattern">
      <Header />
      
      <main className="container py-6 pb-20">
        {!analysisResult ? (
          <div className="space-y-8">
            <section className="text-center space-y-4 py-8 animate-fade-in">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                <h1 className="relative text-3xl sm:text-4xl font-bold text-gradient-gold">
                  {t("hero.title")}
                </h1>
              </div>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                {t("hero.subtitle")}
              </p>
            </section>

            <section className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <ImageUploader 
                onImageSelect={handleImageSelect} 
                isAnalyzing={isAnalyzing} 
              />
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="glass-card rounded-2xl p-5 text-center hover:shadow-gold transition-all duration-300">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-gold flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{t("feature.instantAnalysis")}</h3>
                <p className="text-sm text-muted-foreground">{t("feature.instantAnalysisDesc")}</p>
              </div>
              
              <div className="glass-card rounded-2xl p-5 text-center hover:shadow-gold transition-all duration-300">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-gold flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{t("feature.highAccuracy")}</h3>
                <p className="text-sm text-muted-foreground">{t("feature.highAccuracyDesc")}</p>
              </div>
              
              <div className="glass-card rounded-2xl p-5 text-center hover:shadow-gold transition-all duration-300">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-gold flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{t("feature.marketValue")}</h3>
                <p className="text-sm text-muted-foreground">{t("feature.marketValueDesc")}</p>
              </div>
            </section>

            <section className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="glass-card rounded-2xl p-5">
                <MiniMap />
              </div>
            </section>
          </div>
        ) : (
          <AnalysisResult data={analysisResult} onReset={handleReset} />
        )}
      </main>

      <footer className="fixed bottom-0 inset-x-0 glass-card border-t border-border/50 py-3 text-center">
        <p className="text-xs text-muted-foreground">
          {t("footer.pwaHint")}
        </p>
      </footer>
    </div>
  );
};

export default Index;
