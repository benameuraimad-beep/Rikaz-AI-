import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { knownMineralLocations, getMineralColor, type MineralLocation, type PredictedLocation } from "@/lib/mineralLocations";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, MapPin, Loader2, Brain, Layers, Info } from "lucide-react";

// Fix default Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function createMineralIcon(color: string) {
  return L.divIcon({
    className: "custom-mineral-marker",
    html: `<div style="width: 28px; height: 28px; border-radius: 50%; background: ${color}; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;"><div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

function createPredictionIcon() {
  return L.divIcon({
    className: "custom-prediction-marker",
    html: `<div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(147, 51, 234, 0.8); border: 3px solid rgba(255,255,255,0.8); box-shadow: 0 0 15px rgba(147, 51, 234, 0.5); display: flex; align-items: center; justify-content: center; animation: pulse 2s infinite;"><span style="font-size: 14px;">🔮</span></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

function FitBounds({ locations }: { locations: MineralLocation[] }) {
  const map = useMap();
  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(l => [l.lat, l.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations, map]);
  return null;
}

const GeologicalMap = () => {
  const [predictions, setPredictions] = useState<PredictedLocation[]>([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const [showPredictions, setShowPredictions] = useState(false);
  const [selectedMineral, setSelectedMineral] = useState<MineralLocation | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const { user } = useAuth();
  const { toast } = useToast();
  const { t, lang } = useLanguage();

  const mineralTypes = [...new Set(knownMineralLocations.map(l => lang === "ar" ? l.mineralTypeAr : l.mineralType))];
  
  const filteredLocations = filterType === "all" 
    ? knownMineralLocations 
    : knownMineralLocations.filter(l => (lang === "ar" ? l.mineralTypeAr : l.mineralType) === filterType);

  const getConfidenceLabel = (c: string) => {
    if (c === "high") return t("map.confidenceHigh");
    if (c === "medium") return t("map.confidenceMedium");
    return t("map.confidenceLow");
  };

  const handlePredict = async () => {
    if (!user) {
      toast({ title: t("map.loginRequired"), description: t("map.loginRequiredDesc"), variant: "destructive" });
      return;
    }
    setIsPredicting(true);
    try {
      const { data, error } = await supabase.functions.invoke('predict-minerals', { body: { locations: knownMineralLocations } });
      if (error) throw error;
      if (data?.predictions) {
        setPredictions(data.predictions);
        setShowPredictions(true);
        toast({ title: t("map.predictSuccess"), description: t("map.predictSuccessDesc", { count: String(data.predictions.length) }) });
      }
    } catch (error) {
      console.error("Prediction error:", error);
      toast({ title: t("map.predictError"), description: t("map.predictErrorDesc"), variant: "destructive" });
    } finally {
      setIsPredicting(false);
    }
  };

  const legendItems: Record<string, string> = {
    [t("map.gold")]: "#FFD700",
    [t("map.silver")]: "#C0C0C0",
    [t("map.copper")]: "#B87333",
    [t("map.iron")]: "#A0522D",
    [t("map.cobalt")]: "#0047AB",
  };

  return (
    <div className="min-h-screen bg-background geometric-pattern">
      <Header />
      
      <main className="container py-6 pb-20">
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-gold p-2 rounded-xl shadow-gold"><MapPin className="h-5 w-5 text-primary-foreground" /></div>
              <div>
                <h1 className="text-2xl font-bold text-gradient-gold">{t("map.title")}</h1>
                <p className="text-sm text-muted-foreground">{t("map.subtitle")}</p>
              </div>
            </div>
            <Button onClick={handlePredict} disabled={isPredicting} className="bg-gradient-gold text-primary-foreground hover:opacity-90">
              {isPredicting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
              {isPredicting ? t("map.predicting") : t("map.predict")}
            </Button>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Badge variant={filterType === "all" ? "default" : "outline"} className="cursor-pointer" onClick={() => setFilterType("all")}>
              {t("map.all")} ({knownMineralLocations.length})
            </Badge>
            {mineralTypes.map(type => (
              <Badge key={type} variant={filterType === type ? "default" : "outline"} className="cursor-pointer" onClick={() => setFilterType(type)}>
                {type}
              </Badge>
            ))}
          </div>

          <div className="rounded-2xl overflow-hidden border border-border/50 shadow-card" style={{ height: "60vh" }}>
            <MapContainer center={[25, 38]} zoom={5} style={{ height: "100%", width: "100%" }} zoomControl={true}>
              <TileLayer attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <FitBounds locations={filteredLocations} />

              {filteredLocations.map(location => (
                <Marker key={location.id} position={[location.lat, location.lng]} icon={createMineralIcon(getMineralColor(location.mineralType))} eventHandlers={{ click: () => setSelectedMineral(location) }}>
                  <Popup>
                    <div className="min-w-[200px]">
                      <h3 className="font-bold text-sm mb-1">{lang === "ar" ? location.nameAr : location.name}</h3>
                      <p className="text-xs text-gray-600 mb-2">{lang === "en" ? location.name : location.nameAr}</p>
                      <div className="space-y-1 text-xs">
                        <p><strong>{t("map.mineral")}:</strong> {lang === "ar" ? location.mineralTypeAr : location.mineralType}</p>
                        <p><strong>{t("map.region")}:</strong> {location.region}</p>
                        <p><strong>{t("map.confidenceLabel")}:</strong> {getConfidenceLabel(location.confidence)}</p>
                        <p className="text-gray-500">{location.description}</p>
                        <p className="text-gray-400 text-[10px]">{t("map.source")}: {location.source}</p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {showPredictions && predictions.map((pred, i) => (
                <div key={pred.id || `pred-${i}`}>
                  <Marker position={[pred.lat, pred.lng]} icon={createPredictionIcon()}>
                    <Popup>
                      <div className="min-w-[200px]">
                        <h3 className="font-bold text-sm mb-1 text-purple-700">🔮 {t("map.predictedLocation")}</h3>
                        <div className="space-y-1 text-xs">
                          <p><strong>{t("map.predictedMinerals")}:</strong> {pred.minerals?.join(", ")}</p>
                          <p><strong>{t("map.probability")}:</strong> {pred.probability}</p>
                          <p><strong>{t("map.searchRadius")}:</strong> {pred.radius} {t("map.km")}</p>
                          <p className="text-gray-500">{pred.reasoning}</p>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                  <Circle center={[pred.lat, pred.lng]} radius={pred.radius * 1000} pathOptions={{ color: "rgba(147, 51, 234, 0.6)", fillColor: "rgba(147, 51, 234, 0.1)", fillOpacity: 0.2 }} />
                </div>
              ))}
            </MapContainer>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Layers className="h-4 w-4" />{t("map.legend")}</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(legendItems).map(([name, color]) => (
                  <div key={name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border border-white/50" style={{ background: color }} />
                    <span className="text-muted-foreground">{name}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border border-white/50" style={{ background: "rgba(147, 51, 234, 0.8)" }} />
                  <span className="text-muted-foreground">{t("map.aiPrediction")}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-border/50">
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Info className="h-4 w-4" />{t("map.stats")}</CardTitle></CardHeader>
              <CardContent className="space-y-1 text-xs text-muted-foreground">
                <p>📍 {t("map.knownLocations")}: {knownMineralLocations.length}</p>
                <p>🔮 {t("map.aiPredictions")}: {predictions.length}</p>
                <p>🌍 {new Set(knownMineralLocations.map(l => l.region)).size} {t("map.coveredRegions")}</p>
                <p>⛏️ {t("map.mineralTypes")}: {mineralTypes.length}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GeologicalMap;
