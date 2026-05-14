import { useState, useRef } from "react";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

interface ImageUploaderProps {
  onImageSelect: (imageData: string) => void;
  isAnalyzing: boolean;
}

const ImageUploader = ({ onImageSelect, isAnalyzing }: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const handleFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const handleAnalyze = () => {
    if (preview) {
      onImageSelect(preview);
    }
  };

  return (
    <div className="w-full space-y-4">
      {!preview ? (
        <div
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
            dragActive
              ? "border-primary bg-primary/10 scale-[1.02]"
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="absolute inset-0 bg-gradient-radial opacity-50 pointer-events-none" />
          
          <div className="relative space-y-4">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-gold animate-float">
              <Upload className="h-10 w-10 text-primary-foreground" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">{t("upload.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("upload.subtitle")}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="gold" size="lg" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-5 w-5" />
                {t("upload.uploadBtn")}
              </Button>
              <Button variant="outline" size="lg" onClick={() => cameraInputRef.current?.click()}>
                <Camera className="h-5 w-5" />
                {t("upload.captureBtn")}
              </Button>
            </div>
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
          <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleChange} className="hidden" />
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden shadow-card animate-scale-in">
          <img src={preview} alt={t("upload.previewAlt")} className="w-full h-64 sm:h-80 object-cover" />
          
          {isAnalyzing && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full animate-pulse" />
                <Loader2 className="h-12 w-12 text-primary animate-spin relative" />
              </div>
              <p className="text-foreground font-medium">{t("upload.analyzing")}</p>
              <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-gold animate-pulse" style={{ width: "60%" }} />
              </div>
            </div>
          )}
          
          {!isAnalyzing && (
            <>
              <button onClick={clearPreview} className="absolute top-3 left-3 p-2 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-destructive hover:text-destructive-foreground transition-all">
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-background/90 to-transparent">
                <Button variant="gold" size="xl" className="w-full" onClick={handleAnalyze}>{t("upload.analyzeBtn")}</Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
