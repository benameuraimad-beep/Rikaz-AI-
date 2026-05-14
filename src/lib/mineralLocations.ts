// Embedded geological mineral location data
export interface MineralLocation {
  id: string;
  name: string;
  nameAr: string;
  lat: number;
  lng: number;
  mineralType: string;
  mineralTypeAr: string;
  description: string;
  confidence: "high" | "medium" | "low";
  source: string;
  region: string;
}

export interface PredictedLocation {
  id: string;
  lat: number;
  lng: number;
  radius: number; // km
  minerals: string[];
  probability: string;
  reasoning: string;
}

export const knownMineralLocations: MineralLocation[] = [
  // Saudi Arabia
  {
    id: "sa-1",
    name: "Mahd adh Dhahab",
    nameAr: "مهد الذهب",
    lat: 23.493,
    lng: 40.853,
    mineralType: "Gold",
    mineralTypeAr: "ذهب",
    description: "أقدم وأشهر مناجم الذهب في شبه الجزيرة العربية",
    confidence: "high",
    source: "هيئة المساحة الجيولوجية السعودية",
    region: "المدينة المنورة"
  },
  {
    id: "sa-2",
    name: "Bulghah",
    nameAr: "بلغة",
    lat: 25.35,
    lng: 42.02,
    mineralType: "Gold",
    mineralTypeAr: "ذهب",
    description: "منجم ذهب رئيسي في منطقة القصيم",
    confidence: "high",
    source: "شركة معادن",
    region: "القصيم"
  },
  {
    id: "sa-3",
    name: "Al Amar",
    nameAr: "العمار",
    lat: 22.29,
    lng: 44.83,
    mineralType: "Gold, Copper",
    mineralTypeAr: "ذهب، نحاس",
    description: "منجم متعدد المعادن في منطقة الرياض",
    confidence: "high",
    source: "شركة معادن",
    region: "الرياض"
  },
  {
    id: "sa-4",
    name: "Jabal Sayid",
    nameAr: "جبل صايد",
    lat: 23.06,
    lng: 40.87,
    mineralType: "Copper, Zinc",
    mineralTypeAr: "نحاس، زنك",
    description: "أكبر رواسب النحاس والزنك في المملكة",
    confidence: "high",
    source: "شركة معادن",
    region: "المدينة المنورة"
  },
  {
    id: "sa-5",
    name: "Al Masane",
    nameAr: "المسعنة",
    lat: 19.21,
    lng: 43.12,
    mineralType: "Copper, Zinc, Gold",
    mineralTypeAr: "نحاس، زنك، ذهب",
    description: "منجم متعدد المعادن في منطقة عسير",
    confidence: "high",
    source: "شركة المسعنة للتعدين",
    region: "عسير"
  },
  // Egypt
  {
    id: "eg-1",
    name: "Sukari Gold Mine",
    nameAr: "منجم السكري",
    lat: 24.95,
    lng: 33.78,
    mineralType: "Gold",
    mineralTypeAr: "ذهب",
    description: "أكبر منجم ذهب في مصر والشرق الأوسط",
    confidence: "high",
    source: "هيئة الثروة المعدنية المصرية",
    region: "الصحراء الشرقية"
  },
  {
    id: "eg-2",
    name: "Hamash",
    nameAr: "حمش",
    lat: 24.22,
    lng: 34.22,
    mineralType: "Gold",
    mineralTypeAr: "ذهب",
    description: "موقع تعدين ذهب تاريخي في الصحراء الشرقية",
    confidence: "medium",
    source: "هيئة الثروة المعدنية المصرية",
    region: "الصحراء الشرقية"
  },
  // Morocco
  {
    id: "ma-1",
    name: "Imiter",
    nameAr: "إميضر",
    lat: 31.37,
    lng: -5.86,
    mineralType: "Silver",
    mineralTypeAr: "فضة",
    description: "أكبر منجم فضة في أفريقيا",
    confidence: "high",
    source: "مجموعة مناجم المغرب",
    region: "تينغير"
  },
  {
    id: "ma-2",
    name: "Bou Azzer",
    nameAr: "بوازار",
    lat: 30.48,
    lng: -6.69,
    mineralType: "Cobalt",
    mineralTypeAr: "كوبالت",
    description: "منجم كوبالت رئيسي في المغرب",
    confidence: "high",
    source: "مجموعة مناجم المغرب",
    region: "ورزازات"
  },
  // Jordan
  {
    id: "jo-1",
    name: "Dana",
    nameAr: "ضانا",
    lat: 30.63,
    lng: 35.62,
    mineralType: "Copper",
    mineralTypeAr: "نحاس",
    description: "موقع نحاس تاريخي في وادي عربة",
    confidence: "medium",
    source: "سلطة المصادر الطبيعية الأردنية",
    region: "الطفيلة"
  },
  // Oman
  {
    id: "om-1",
    name: "Sohar Copper",
    nameAr: "نحاس صحار",
    lat: 24.34,
    lng: 56.74,
    mineralType: "Copper, Chromite",
    mineralTypeAr: "نحاس، كروميت",
    description: "منطقة تعدين غنية بالنحاس والكروميت",
    confidence: "high",
    source: "هيئة التعدين العمانية",
    region: "شمال الباطنة"
  },
  // Algeria
  {
    id: "dz-1",
    name: "Ouenza",
    nameAr: "الونزة",
    lat: 35.95,
    lng: 8.15,
    mineralType: "Iron",
    mineralTypeAr: "حديد",
    description: "أكبر منجم حديد في الجزائر",
    confidence: "high",
    source: "وزارة الطاقة والمناجم الجزائرية",
    region: "تبسة"
  },
  {
    id: "dz-2",
    name: "Gara Djebilet",
    nameAr: "غار جبيلات",
    lat: 26.7,
    lng: -1.45,
    mineralType: "Iron",
    mineralTypeAr: "حديد",
    description: "أحد أكبر احتياطيات الحديد في العالم",
    confidence: "high",
    source: "سوناطراك",
    region: "تيندوف"
  },
  // Sudan
  {
    id: "sd-1",
    name: "Hassai",
    nameAr: "حساي",
    lat: 17.67,
    lng: 33.85,
    mineralType: "Gold",
    mineralTypeAr: "ذهب",
    description: "منجم ذهب رئيسي في شمال شرق السودان",
    confidence: "high",
    source: "شركة أريب للتعدين",
    region: "ولاية نهر النيل"
  },
];

export const mineralTypeColors: Record<string, string> = {
  "Gold": "#FFD700",
  "Silver": "#C0C0C0",
  "Copper": "#B87333",
  "Iron": "#A0522D",
  "Zinc": "#7F8C8D",
  "Cobalt": "#0047AB",
  "Chromite": "#2E8B57",
  "default": "#D4A029",
};

export function getMineralColor(mineralType: string): string {
  for (const [key, color] of Object.entries(mineralTypeColors)) {
    if (mineralType.includes(key)) return color;
  }
  return mineralTypeColors.default;
}
