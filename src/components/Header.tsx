import { Gem, History, LogOut, LogIn, User, MapPin, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { t, lang, setLang } = useLanguage();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const toggleLang = () => setLang(lang === "ar" ? "en" : "ar");

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-border/50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full" />
            <div className="relative bg-gradient-gold p-2.5 rounded-xl shadow-gold">
              <Gem className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient-gold">{t("app.name")}</h1>
            <p className="text-xs text-muted-foreground">{t("app.tagline")}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLang}
            className="text-muted-foreground hover:text-foreground gap-1"
          >
            <Globe className="h-4 w-4" />
            {t("lang.switch")}
          </Button>

          {user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/map")}
                className="text-muted-foreground hover:text-foreground"
              >
                <MapPin className="h-4 w-4" />
                {t("nav.map")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/history")}
                className="text-muted-foreground hover:text-foreground"
              >
                <History className="h-4 w-4" />
                {t("nav.history")}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-muted"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem disabled className="text-muted-foreground text-xs">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="h-4 w-4" />
                    {t("nav.signOut")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/auth")}
              className="text-primary border-primary/50"
            >
              <LogIn className="h-4 w-4" />
              {t("nav.signIn")}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
