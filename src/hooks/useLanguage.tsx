import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "ar" | "en";

const translations = {
  // Header
  "app.name": { ar: "Rikaz AI", en: "Rikaz AI" },
  "app.tagline": { ar: "محلل المعادن الذكي", en: "Smart Mineral Analyzer" },
  "nav.map": { ar: "الخريطة", en: "Map" },
  "nav.history": { ar: "السجل", en: "History" },
  "nav.signOut": { ar: "تسجيل الخروج", en: "Sign Out" },
  "nav.signIn": { ar: "تسجيل الدخول", en: "Sign In" },

  // Index page
  "hero.title": { ar: "حلل معدنك بالذكاء الاصطناعي", en: "Analyze Your Mineral with AI" },
  "hero.subtitle": { ar: "التقط صورة لأي معدن واحصل على تحليل شامل لنوعه وكتلته وقيمته السوقية", en: "Capture a photo of any mineral and get a comprehensive analysis of its type, mass, and market value" },
  "feature.instantAnalysis": { ar: "تحليل فوري", en: "Instant Analysis" },
  "feature.instantAnalysisDesc": { ar: "نتائج دقيقة خلال ثوانٍ", en: "Accurate results in seconds" },
  "feature.highAccuracy": { ar: "دقة عالية", en: "High Accuracy" },
  "feature.highAccuracyDesc": { ar: "مدعوم بـ Gemini AI", en: "Powered by Gemini AI" },
  "feature.marketValue": { ar: "قيمة سوقية", en: "Market Value" },
  "feature.marketValueDesc": { ar: "تقدير فوري للسعر", en: "Instant price estimation" },
  "footer.pwaHint": { ar: "💡 أضف التطبيق للشاشة الرئيسية للوصول السريع", en: "💡 Add the app to your home screen for quick access" },

  // Toast messages
  "toast.analysisSuccess": { ar: "تم التحليل وحفظه بنجاح", en: "Analysis completed and saved" },
  "toast.analysisSuccessOnly": { ar: "تم التحليل بنجاح", en: "Analysis completed" },
  "toast.identified": { ar: "تم التعرف على", en: "Identified:" },
  "toast.loginToSave": { ar: "سجل دخولك لحفظ التحليلات", en: "Sign in to save analyses" },
  "toast.analysisError": { ar: "خطأ في التحليل", en: "Analysis Error" },
  "toast.analysisErrorDesc": { ar: "حدث خطأ أثناء تحليل الصورة. يرجى المحاولة مرة أخرى.", en: "An error occurred during image analysis. Please try again." },

  // Image Uploader
  "upload.title": { ar: "ارفع صورة المعدن", en: "Upload Mineral Image" },
  "upload.subtitle": { ar: "اسحب وأفلت الصورة هنا أو اختر من الخيارات أدناه", en: "Drag & drop an image here or choose from the options below" },
  "upload.uploadBtn": { ar: "رفع صورة", en: "Upload Image" },
  "upload.captureBtn": { ar: "التقاط صورة", en: "Take Photo" },
  "upload.analyzing": { ar: "جاري تحليل المعدن...", en: "Analyzing mineral..." },
  "upload.analyzeBtn": { ar: "تحليل المعدن", en: "Analyze Mineral" },
  "upload.previewAlt": { ar: "معاينة المعدن", en: "Mineral preview" },

  // Analysis Result
  "analysis.mineralInfo": { ar: "معلومات المعدن", en: "Mineral Information" },
  "analysis.type": { ar: "النوع", en: "Type" },
  "analysis.purity": { ar: "النقاء", en: "Purity" },
  "analysis.estimatedWeight": { ar: "الكتلة التقديرية", en: "Estimated Weight" },
  "analysis.marketValue": { ar: "القيمة السوقية", en: "Market Value" },
  "analysis.score": { ar: "التقييم", en: "Score" },
  "analysis.confidence": { ar: "مستوى الثقة", en: "Confidence Level" },
  "analysis.identification": { ar: "دقة التعرف", en: "Identification Accuracy" },
  "analysis.ocrAccuracy": { ar: "دقة OCR", en: "OCR Accuracy" },
  "analysis.dataSource": { ar: "مصدر البيانات", en: "Data Source" },
  "analysis.positives": { ar: "النقاط الإيجابية", en: "Positive Points" },
  "analysis.negatives": { ar: "النقاط السلبية", en: "Negative Points" },
  "analysis.questionable": { ar: "نقاط تحتاج مراجعة", en: "Needs Review" },
  "analysis.newAnalysis": { ar: "تحليل معدن جديد", en: "Analyze New Mineral" },

  // Auth page
  "auth.title": { ar: "محلل المعادن", en: "Mineral Analyzer" },
  "auth.loginSubtitle": { ar: "سجل دخولك للمتابعة", en: "Sign in to continue" },
  "auth.signupSubtitle": { ar: "أنشئ حساباً جديداً", en: "Create a new account" },
  "auth.name": { ar: "الاسم", en: "Name" },
  "auth.namePlaceholder": { ar: "اسمك", en: "Your name" },
  "auth.email": { ar: "البريد الإلكتروني", en: "Email" },
  "auth.password": { ar: "كلمة المرور", en: "Password" },
  "auth.loginBtn": { ar: "تسجيل الدخول", en: "Sign In" },
  "auth.signupBtn": { ar: "إنشاء حساب", en: "Create Account" },
  "auth.switchToSignup": { ar: "ليس لديك حساب؟ سجل الآن", en: "Don't have an account? Sign up" },
  "auth.switchToLogin": { ar: "لديك حساب بالفعل؟ سجل دخولك", en: "Already have an account? Sign in" },
  "auth.invalidEmail": { ar: "البريد الإلكتروني غير صالح", en: "Invalid email address" },
  "auth.passwordMin": { ar: "كلمة المرور يجب أن تكون 6 أحرف على الأقل", en: "Password must be at least 6 characters" },
  "auth.loginError": { ar: "خطأ في تسجيل الدخول", en: "Login Error" },
  "auth.invalidCredentials": { ar: "البريد الإلكتروني أو كلمة المرور غير صحيحة", en: "Invalid email or password" },
  "auth.error": { ar: "خطأ", en: "Error" },
  "auth.loginSuccess": { ar: "تم تسجيل الدخول بنجاح", en: "Signed in successfully" },
  "auth.welcome": { ar: "مرحباً بك مجدداً!", en: "Welcome back!" },
  "auth.emailRegistered": { ar: "البريد مسجل مسبقاً", en: "Email already registered" },
  "auth.emailRegisteredDesc": { ar: "هذا البريد الإلكتروني مسجل بالفعل. جرب تسجيل الدخول.", en: "This email is already registered. Try signing in." },
  "auth.signupError": { ar: "خطأ في التسجيل", en: "Registration Error" },
  "auth.signupSuccess": { ar: "تم إنشاء الحساب بنجاح", en: "Account created successfully" },
  "auth.signupWelcome": { ar: "مرحباً بك في تطبيق تحليل المعادن!", en: "Welcome to the Mineral Analyzer!" },

  // History page
  "history.title": { ar: "سجل التحليلات", en: "Analysis History" },
  "history.home": { ar: "الرئيسية", en: "Home" },
  "history.empty": { ar: "لا توجد تحليلات بعد", en: "No analyses yet" },
  "history.emptyDesc": { ar: "ابدأ بتحليل معدنك الأول", en: "Start by analyzing your first mineral" },
  "history.newAnalysis": { ar: "تحليل معدن جديد", en: "Analyze New Mineral" },
  "history.deleted": { ar: "تم الحذف", en: "Deleted" },
  "history.deletedDesc": { ar: "تم حذف التحليل بنجاح", en: "Analysis deleted successfully" },
  "history.deleteError": { ar: "فشل في حذف التحليل", en: "Failed to delete analysis" },
  "history.loadError": { ar: "فشل في تحميل السجل", en: "Failed to load history" },

  // Geological Map
  "map.title": { ar: "الخريطة الجيولوجية", en: "Geological Map" },
  "map.subtitle": { ar: "مواقع المعادن المعروفة والتوقعات", en: "Known mineral locations & predictions" },
  "map.predict": { ar: "توقع مواقع جديدة", en: "Predict New Locations" },
  "map.predicting": { ar: "جاري التحليل...", en: "Analyzing..." },
  "map.all": { ar: "الكل", en: "All" },
  "map.legend": { ar: "دليل الخريطة", en: "Map Legend" },
  "map.stats": { ar: "إحصائيات", en: "Statistics" },
  "map.knownLocations": { ar: "مواقع معروفة", en: "Known locations" },
  "map.aiPredictions": { ar: "توقعات AI", en: "AI Predictions" },
  "map.coveredRegions": { ar: "منطقة", en: "regions" },
  "map.mineralTypes": { ar: "أنواع معادن", en: "Mineral types" },
  "map.loginRequired": { ar: "تسجيل الدخول مطلوب", en: "Login required" },
  "map.loginRequiredDesc": { ar: "يجب تسجيل الدخول لاستخدام ميزة التوقع بالذكاء الاصطناعي", en: "You must sign in to use AI prediction" },
  "map.predictSuccess": { ar: "تم التوقع بنجاح", en: "Prediction successful" },
  "map.predictSuccessDesc": { ar: "تم توقع {count} مواقع جديدة للاستكشاف", en: "Predicted {count} new locations to explore" },
  "map.predictError": { ar: "خطأ في التوقع", en: "Prediction Error" },
  "map.predictErrorDesc": { ar: "حدث خطأ أثناء تحليل البيانات الجيولوجية", en: "Error analyzing geological data" },
  "map.mineral": { ar: "المعدن", en: "Mineral" },
  "map.region": { ar: "المنطقة", en: "Region" },
  "map.confidenceLabel": { ar: "الثقة", en: "Confidence" },
  "map.confidenceHigh": { ar: "عالية", en: "High" },
  "map.confidenceMedium": { ar: "متوسطة", en: "Medium" },
  "map.confidenceLow": { ar: "منخفضة", en: "Low" },
  "map.source": { ar: "المصدر", en: "Source" },
  "map.predictedLocation": { ar: "موقع متوقع", en: "Predicted Location" },
  "map.predictedMinerals": { ar: "المعادن المتوقعة", en: "Predicted minerals" },
  "map.probability": { ar: "احتمالية", en: "Probability" },
  "map.searchRadius": { ar: "نطاق البحث", en: "Search radius" },
  "map.km": { ar: "كم", en: "km" },
  "map.gold": { ar: "ذهب", en: "Gold" },
  "map.silver": { ar: "فضة", en: "Silver" },
  "map.copper": { ar: "نحاس", en: "Copper" },
  "map.iron": { ar: "حديد", en: "Iron" },
  "map.cobalt": { ar: "كوبالت", en: "Cobalt" },
  "map.aiPrediction": { ar: "توقع AI", en: "AI Prediction" },

  // MiniMap
  "minimap.title": { ar: "الخريطة الجيولوجية", en: "Geological Map" },
  "minimap.sites": { ar: "موقع معدني", en: "mineral sites" },
  "minimap.viewAll": { ar: "عرض الكل", en: "View All" },

  // Chatbot
  "chat.greeting": { ar: "مرحباً! أنا خبير ركاز الرقمي 🪨\nمساعدك الجيولوجي المتخصص في اكتشاف المعادن والأحجار الكريمة.\nاسألني عن أي معدن أو موقع تعديني!", en: "Hello! I'm Rikaz Digital Expert 🪨\nYour specialized geological assistant for mineral & gemstone discovery.\nAsk me about any mineral or mining location!" },
  "chat.title": { ar: "المساعد الجيولوجي", en: "Geological Assistant" },
  "chat.subtitle": { ar: "مدعوم بالذكاء الاصطناعي", en: "Powered by AI" },
  "chat.placeholder": { ar: "اسأل عن معدن أو موقع...", en: "Ask about a mineral or location..." },
  "chat.ariaLabel": { ar: "فتح المساعد الجيولوجي", en: "Open geological assistant" },
  "chat.rateLimited": { ar: "تم تجاوز الحد المسموح، يرجى المحاولة بعد قليل ⏳", en: "Rate limit exceeded, please try again shortly ⏳" },
  "chat.needsCredit": { ar: "يتطلب إضافة رصيد لاستخدام المساعد 💳", en: "Credit required to use the assistant 💳" },
  "chat.connectionError": { ar: "فشل الاتصال", en: "Connection failed" },
  "chat.error": { ar: "حدث خطأ", en: "An error occurred" },

  // NotFound
  "notFound.title": { ar: "الصفحة غير موجودة", en: "Page not found" },
  "notFound.back": { ar: "العودة للرئيسية", en: "Return to Home" },

  // Language
  "lang.switch": { ar: "EN", en: "عربي" },
} as const;

type TranslationKey = keyof typeof translations;

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey, replacements?: Record<string, string>) => string;
  dir: "rtl" | "ltr";
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem("rikaz-lang") as Lang) || "ar";
  });

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem("rikaz-lang", newLang);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const t = (key: TranslationKey, replacements?: Record<string, string>): string => {
    let text: string = translations[key]?.[lang] || key;
    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v);
      });
    }
    return text;
  };

  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
