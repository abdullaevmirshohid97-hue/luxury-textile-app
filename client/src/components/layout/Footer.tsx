import { Link } from "wouter";
import { useTranslations, useLanguageStore } from "@/lib/i18n";
import { Mail, Phone, MapPin } from "lucide-react";
import { SiWhatsapp, SiTelegram } from "react-icons/si";
import { GLOBAL_CONTACT, BRAND } from "@shared/globalConfig";

export function Footer() {
  const t = useTranslations();
  const { language } = useLanguageStore();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">Mary Collection</h3>
            <p className="text-body text-xs text-muted-foreground/70 mb-3">
              {BRAND.tagline[language]}
            </p>
            <p className="text-body text-sm text-muted-foreground leading-relaxed">
              {BRAND.description[language]}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-muted-foreground">
              {t.nav.catalog}
            </h4>
            <nav className="flex flex-col gap-2">
              <Link href="/catalog" className="text-body text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-catalog">
                {t.nav.catalog}
              </Link>
              <Link href="/spa" className="text-body text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-spa">
                {t.nav.spa}
              </Link>
              <Link href="/pastel" className="text-body text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-pastel">
                {t.nav.pastel}
              </Link>
              <Link href="/accessories" className="text-body text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-accessories">
                {t.nav.accessories}
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-muted-foreground">
              B2B
            </h4>
            <nav className="flex flex-col gap-2">
              <Link href="/spa-hotel" className="text-body text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-spa-hotel">
                {t.nav.spaHotel}
              </Link>
              <Link href="/barber" className="text-body text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-barber">
                {t.nav.barber}
              </Link>
              <Link href="/bulk-order" className="text-body text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-bulk-order">
                {t.nav.bulkOrder}
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-muted-foreground">
              {t.contact.title}
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${GLOBAL_CONTACT.email}`}
                className="text-body text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                data-testid="link-footer-email"
              >
                <Mail className="h-4 w-4" />
                {GLOBAL_CONTACT.email}
              </a>
              <a
                href={`tel:${GLOBAL_CONTACT.phone.replace(/\s/g, "")}`}
                className="text-body text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                data-testid="link-footer-phone"
              >
                <Phone className="h-4 w-4" />
                {GLOBAL_CONTACT.phone}
              </a>
              <a
                href={GLOBAL_CONTACT.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-body text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                data-testid="link-footer-whatsapp"
              >
                <SiWhatsapp className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href={GLOBAL_CONTACT.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-body text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                data-testid="link-footer-telegram"
              >
                <SiTelegram className="h-4 w-4" />
                Telegram
              </a>
              <span className="text-body text-sm text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                {GLOBAL_CONTACT.address[language]}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <p className="text-body text-xs text-muted-foreground">
              © {currentYear} {BRAND.legalName}. {t.footer.rights}.
            </p>
            <p className="text-body text-[10px] text-muted-foreground/70 mt-1">
              {language === 'uz' ? "Namangan, O'zbekiston • B2B Tekstil Ishlab Chiqarish" : 
               language === 'ru' ? 'Наманган, Узбекистан • B2B Текстильное Производство' : 
               'Namangan, Uzbekistan • B2B Textile Manufacturing'}
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="text-body text-xs text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-footer-privacy"
            >
              {t.footer.privacy}
            </Link>
            <Link
              href="/terms"
              className="text-body text-xs text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-footer-terms"
            >
              {t.footer.terms}
            </Link>
            <Link
              href="/contact"
              className="text-body text-xs text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-footer-contact"
            >
              {t.nav.contact}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
