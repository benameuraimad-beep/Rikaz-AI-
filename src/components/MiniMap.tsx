import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { knownMineralLocations, getMineralColor } from "@/lib/mineralLocations";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MapPin, ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

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
    html: `<div style="width: 24px; height: 24px; border-radius: 50%; background: ${color}; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;"><div style="width: 6px; height: 6px; background: white; border-radius: 50%;"></div></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
}

function FitBounds() {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds(knownMineralLocations.map(l => [l.lat, l.lng]));
    map.fitBounds(bounds, { padding: [30, 30] });
  }, [map]);
  return null;
}

const MiniMap = () => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-gold flex items-center justify-center">
            <MapPin className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-foreground text-sm">{t("minimap.title")}</h2>
            <p className="text-xs text-muted-foreground">{knownMineralLocations.length} {t("minimap.sites")}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate("/map")} className="text-primary text-xs">
          {t("minimap.viewAll")}
          <Arrow className="h-3 w-3" />
        </Button>
      </div>

      <div className="rounded-2xl overflow-hidden border border-border/50 shadow-card" style={{ height: "280px" }}>
        <MapContainer center={[25, 38]} zoom={4} style={{ height: "100%", width: "100%" }} zoomControl={false} attributionControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <FitBounds />
          {knownMineralLocations.map(location => (
            <Marker key={location.id} position={[location.lat, location.lng]} icon={createMineralIcon(getMineralColor(location.mineralType))}>
              <Popup>
                <div className="min-w-[160px]">
                  <h3 className="font-bold text-xs mb-1">{lang === "ar" ? location.nameAr : location.name}</h3>
                  <p className="text-[10px] text-gray-600">{lang === "ar" ? location.mineralTypeAr : location.mineralType} • {location.region}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MiniMap;
