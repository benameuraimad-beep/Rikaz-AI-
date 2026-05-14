import { CheckCircle2, XCircle, AlertTriangle, TrendingUp, Gem, Scale, DollarSign, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

interface AnalysisData {
  productName: string;
  analysisConfidence: {
    productIdentification: string;
    ocrAccuracy: string;
    dataSource: string;
  };
  overallScore: number;
  verdict: string;
  summary: string;
  negatives: Array<{
    component: string;
    value: string;
    severity: string;
    penalty: number;
    description: string;
  }>;
  positives: Array<{
    component: string;
    value: string;
    bonus: number;
    description: string;
  }>;
  questionable: Array<{
    component: string;
    value: string;
    description: string;
  }>;
  mineralInfo?: {
    type: string;
    purity: string;
    estimatedWeight: string;
    marketValue: string;
  };
}

interface AnalysisResultProps {
  data: AnalysisData;
  onReset: () => void;
}

const AnalysisResult = ({ data, onReset }: AnalysisResultProps) => {
  const { t } = useLanguage();

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "sever":
      case "severe":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "moderate":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "mild":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Card */}
      <div className="glass-card rounded-2xl p-6 shadow-card">
        <div className="flex items-start gap-4">
          <div className="bg-gradient-gold p-3 rounded-xl shadow-gold">
            <Gem className="h-8 w-8 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground mb-1">
              {data.productName}
            </h2>
            <p className="text-sm text-muted-foreground">{data.summary}</p>
          </div>
        </div>

        {/* Score Circle */}
        <div className="mt-6 flex items-center justify-center">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(data.overallScore / 100) * 352} 352`}
                className={getScoreColor(data.overallScore)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${getScoreColor(data.overallScore)}`}>
                {data.overallScore}%
              </span>
              <span className="text-xs text-muted-foreground">{t("analysis.score")}</span>
            </div>
          </div>
        </div>

        {/* Verdict */}
        <div className="mt-4 text-center">
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            data.overallScore >= 70 
              ? "bg-green-500/20 text-green-400" 
              : data.overallScore >= 40
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-red-500/20 text-red-400"
          }`}>
            {data.overallScore >= 70 ? <CheckCircle2 className="h-4 w-4" /> : 
             data.overallScore >= 40 ? <AlertTriangle className="h-4 w-4" /> : 
             <XCircle className="h-4 w-4" />}
            {data.verdict}
          </span>
        </div>
      </div>

      {/* Mineral Info */}
      {data.mineralInfo && (
        <div className="glass-card rounded-2xl p-6 shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            {t("analysis.mineralInfo")}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Gem className="h-4 w-4" />
                <span className="text-xs">{t("analysis.type")}</span>
              </div>
              <p className="text-foreground font-semibold">{data.mineralInfo.type}</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs">{t("analysis.purity")}</span>
              </div>
              <p className="text-foreground font-semibold">{data.mineralInfo.purity}</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Scale className="h-4 w-4" />
                <span className="text-xs">{t("analysis.estimatedWeight")}</span>
              </div>
              <p className="text-foreground font-semibold">{data.mineralInfo.estimatedWeight}</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <DollarSign className="h-4 w-4" />
                <span className="text-xs">{t("analysis.marketValue")}</span>
              </div>
              <p className="text-primary font-bold">{data.mineralInfo.marketValue}</p>
            </div>
          </div>
        </div>
      )}

      {/* Confidence */}
      <div className="glass-card rounded-2xl p-6 shadow-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">{t("analysis.confidence")}</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{t("analysis.identification")}</span>
            <span className="text-sm font-medium text-foreground">
              {data.analysisConfidence.productIdentification}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{t("analysis.ocrAccuracy")}</span>
            <span className="text-sm font-medium text-foreground">
              {data.analysisConfidence.ocrAccuracy}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{t("analysis.dataSource")}</span>
            <span className="text-sm font-medium text-foreground text-left" dir="ltr">
              {data.analysisConfidence.dataSource}
            </span>
          </div>
        </div>
      </div>

      {/* Positives */}
      {data.positives.length > 0 && (
        <div className="glass-card rounded-2xl p-6 shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            {t("analysis.positives")}
          </h3>
          <div className="space-y-3">
            {data.positives.map((item, index) => (
              <div key={index} className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-green-400">{item.component}</span>
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                    +{item.bonus}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Negatives */}
      {data.negatives.length > 0 && (
        <div className="glass-card rounded-2xl p-6 shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            {t("analysis.negatives")}
          </h3>
          <div className="space-y-3">
            {data.negatives.map((item, index) => (
              <div key={index} className={`border rounded-xl p-4 ${getSeverityColor(item.severity)}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">{item.component}</span>
                  <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                    -{item.penalty}
                  </span>
                </div>
                <p className="text-sm opacity-80">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Questionable */}
      {data.questionable.length > 0 && (
        <div className="glass-card rounded-2xl p-6 shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            {t("analysis.questionable")}
          </h3>
          <div className="space-y-3">
            {data.questionable.map((item, index) => (
              <div key={index} className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                <span className="font-medium text-yellow-400">{item.component}</span>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset Button */}
      <Button
        variant="outline"
        size="xl"
        className="w-full"
        onClick={onReset}
      >
        {t("analysis.newAnalysis")}
      </Button>
    </div>
  );
};

export default AnalysisResult;
