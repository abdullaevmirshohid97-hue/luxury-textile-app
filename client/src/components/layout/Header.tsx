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
  DropdownMenuSeparator,
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
              href="/catalog"
              className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary rounded-md ${
                isActive("/catalog") ? "text-primary" : "text-muted-foreground"
              }`}
              data-testid="link-nav-catalog"
            >
              {t.nav.catalog}
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary gap-1" data-testid="button-collections-menu">
                  {language === "ru" ? "Коллекции" : language === "uz" ? "Kolleksiyalar" : "Collections"}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary gap-1" data-testid="button-b2b-menu">
                  B2B
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link href="/spa-hotel" className="w-full cursor-pointer" data-testid="link-nav-spa-hotel">
                    {t.nav.spaHotel}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/barber" className="w-full cursor-pointer" data-testid="link-nav-barber">
                    {t.nav.barber}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/bulk-order" className="w-full cursor-pointer font-medium" data-testid="link-nav-bulk-order">
                    {t.nav.bulkOrder}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary gap-1" data-testid="button-export-menu">
                  {t.nav.export}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link href="/export/middle-east" className="w-full cursor-pointer" data-testid="link-nav-export-me">
                    {t.export.middleEast}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/export/europe" className="w-full cursor-pointer" data-testid="link-nav-export-eu">
                    {t.export.europe}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/export/barber-global" className="w-full cursor-pointer" data-testid="link-nav-export-barber">
                    {t.export.global}
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
              {t.nav.contact}
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
                href="/catalog"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  isActive("/catalog") ? "text-primary bg-accent" : "text-muted-foreground"
                }`}
                data-testid="link-mobile-nav-catalog"
              >
                {t.nav.catalog}
              </Link>
              
              <div className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2">
                {language === "ru" ? "Коллекции" : language === "uz" ? "Kolleksiyalar" : "Collections"}
              </div>
              <Link href="/pastel" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm text-muted-foreground hover:text-primary" data-testid="link-mobile-nav-pastel">
                {t.nav.pastel}
              </Link>
              <Link href="/spa" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm text-muted-foreground hover:text-primary" data-testid="link-mobile-nav-spa">
                {t.nav.spa}
              </Link>
              <Link href="/accessories" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm text-muted-foreground hover:text-primary" data-testid="link-mobile-nav-accessories">
                {t.nav.accessories}
              </Link>

              <div className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2">
                B2B
              </div>
              <Link href="/spa-hotel" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm text-muted-foreground hover:text-primary" data-testid="link-mobile-nav-spa-hotel">
                {t.nav.spaHotel}
              </Link>
              <Link href="/barber" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm text-muted-foreground hover:text-primary" data-testid="link-mobile-nav-barber">
                {t.nav.barber}
              </Link>
              <Link href="/bulk-order" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm font-medium text-primary" data-testid="link-mobile-nav-bulk-order">
                {t.nav.bulkOrder}
              </Link>

              <div className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2">
                {t.nav.export}
              </div>
              <Link href="/export/middle-east" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm text-muted-foreground hover:text-primary" data-testid="link-mobile-nav-export-me">
                {t.export.middleEast}
              </Link>
              <Link href="/export/europe" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm text-muted-foreground hover:text-primary" data-testid="link-mobile-nav-export-eu">
                {t.export.europe}
              </Link>
              <Link href="/export/barber-global" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm text-muted-foreground hover:text-primary" data-testid="link-mobile-nav-export-barber">
                {t.export.global}
              </Link>

              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 text-sm font-medium rounded-md mt-2 ${
                  isActive("/contact") ? "text-primary bg-accent" : "text-muted-foreground"
                }`}
                data-testid="link-mobile-nav-contact"
              >
                {t.nav.contact}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
