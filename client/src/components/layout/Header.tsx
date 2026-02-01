import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations, useLanguageStore, type Language } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languageNames: Record<Language, string> = {
  uz: "O'zbekcha",
  ru: "Русский",
  en: "English",
};

export function Header() {
  const t = useTranslations();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguageStore();

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-wide text-foreground" data-testid="link-logo">
              Mary Collection
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary rounded-md ${
                isActive("/") && location === "/" ? "text-primary" : "text-muted-foreground"
              }`}
              data-testid="link-nav-home"
            >
              {t.nav.home}
            </Link>

            <Link
              href="/business"
              className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary rounded-md ${
                isActive("/business") ? "text-primary" : "text-muted-foreground"
              }`}
              data-testid="link-nav-business"
            >
              {t.nav.forBusiness}
            </Link>

            <Link
              href="/process"
              className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary rounded-md ${
                isActive("/process") ? "text-primary" : "text-muted-foreground"
              }`}
              data-testid="link-nav-process"
            >
              {t.nav.process}
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary gap-1" data-testid="button-collections-menu">
                  {t.nav.collections}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link href="/catalog" className="w-full cursor-pointer" data-testid="link-nav-catalog">
                    {t.nav.catalog}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/pastel" className="w-full cursor-pointer" data-testid="link-nav-pastel">
                    {t.nav.pastel}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/spa" className="w-full cursor-pointer" data-testid="link-nav-spa">
                    {t.nav.spa}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/accessories" className="w-full cursor-pointer" data-testid="link-nav-accessories">
                    {t.nav.accessories}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/contact"
              className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary rounded-md ${
                isActive("/contact") ? "text-primary" : "text-muted-foreground"
              }`}
              data-testid="link-nav-contact"
            >
              {t.nav.inquiry}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-body" data-testid="button-language-switcher">
                  {language.toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {(Object.keys(languageNames) as Language[]).map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={language === lang ? "bg-accent" : ""}
                    data-testid={`menu-item-lang-${lang}`}
                  >
                    {languageNames[lang]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t">
            <div className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  location === "/" ? "text-primary bg-accent" : "text-muted-foreground"
                }`}
                data-testid="link-mobile-nav-home"
              >
                {t.nav.home}
              </Link>

              <Link
                href="/business"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  isActive("/business") ? "text-primary bg-accent" : "text-muted-foreground"
                }`}
                data-testid="link-mobile-nav-business"
              >
                {t.nav.forBusiness}
              </Link>

              <Link
                href="/process"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  isActive("/process") ? "text-primary bg-accent" : "text-muted-foreground"
                }`}
                data-testid="link-mobile-nav-process"
              >
                {t.nav.process}
              </Link>

              <div className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2">
                {t.nav.collections}
              </div>
              <Link href="/catalog" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm text-muted-foreground hover:text-primary" data-testid="link-mobile-nav-catalog">
                {t.nav.catalog}
              </Link>
              <Link href="/pastel" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm text-muted-foreground hover:text-primary" data-testid="link-mobile-nav-pastel">
                {t.nav.pastel}
              </Link>
              <Link href="/spa" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm text-muted-foreground hover:text-primary" data-testid="link-mobile-nav-spa">
                {t.nav.spa}
              </Link>
              <Link href="/accessories" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm text-muted-foreground hover:text-primary" data-testid="link-mobile-nav-accessories">
                {t.nav.accessories}
              </Link>

              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 text-sm font-medium rounded-md mt-2 ${
                  isActive("/contact") ? "text-primary bg-accent" : "text-muted-foreground"
                }`}
                data-testid="link-mobile-nav-contact"
              >
                {t.nav.inquiry}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
