import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Gem, Mail, Lock, User, Loader2, Globe } from "lucide-react";
import { z } from "zod";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, lang, setLang } = useLanguage();

  const emailSchema = z.string().email(t("auth.invalidEmail"));
  const passwordSchema = z.string().min(6, t("auth.passwordMin"));

  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({ title: t("auth.loginError"), description: t("auth.invalidCredentials"), variant: "destructive" });
          } else {
            toast({ title: t("auth.error"), description: error.message, variant: "destructive" });
          }
        } else {
          toast({ title: t("auth.loginSuccess"), description: t("auth.welcome") });
        }
      } else {
        const { error } = await signUp(email, password, displayName);
        if (error) {
          if (error.message.includes("already registered")) {
            toast({ title: t("auth.emailRegistered"), description: t("auth.emailRegisteredDesc"), variant: "destructive" });
          } else {
            toast({ title: t("auth.signupError"), description: error.message, variant: "destructive" });
          }
        } else {
          toast({ title: t("auth.signupSuccess"), description: t("auth.signupWelcome") });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const iconSide = lang === "ar" ? "right-3" : "left-3";
  const inputPadding = lang === "ar" ? "pr-10" : "pl-10";

  return (
    <div className="min-h-screen bg-background geometric-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Language toggle */}
        <div className="flex justify-end mb-4">
          <Button variant="ghost" size="sm" onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="text-muted-foreground gap-1">
            <Globe className="h-4 w-4" />
            {t("lang.switch")}
          </Button>
        </div>

        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-gold shadow-gold mb-4">
            <Gem className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-gradient-gold">{t("auth.title")}</h1>
          <p className="text-muted-foreground mt-2">
            {isLogin ? t("auth.loginSubtitle") : t("auth.signupSubtitle")}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 shadow-card animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-foreground">{t("auth.name")}</Label>
                <div className="relative">
                  <User className={`absolute ${iconSide} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
                  <Input id="displayName" type="text" placeholder={t("auth.namePlaceholder")} value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={`${inputPadding} bg-input border-border`} />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">{t("auth.email")}</Label>
              <div className="relative">
                <Mail className={`absolute ${iconSide} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
                <Input id="email" type="email" placeholder="example@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputPadding} bg-input border-border`} dir="ltr" />
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">{t("auth.password")}</Label>
              <div className="relative">
                <Lock className={`absolute ${iconSide} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputPadding} bg-input border-border`} dir="ltr" />
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            <Button type="submit" className="w-full bg-gradient-gold hover:opacity-90 text-primary-foreground font-semibold" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : isLogin ? t("auth.loginBtn") : t("auth.signupBtn")}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button type="button" onClick={() => { setIsLogin(!isLogin); setErrors({}); }} className="text-sm text-primary hover:underline">
              {isLogin ? t("auth.switchToSignup") : t("auth.switchToLogin")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
