import { Link } from "wouter";
import { useTranslations } from "@/lib/i18n";
import { Mail, Phone, MapPin } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

export function Footer() {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Mary Collection</h3>
            <p className="text-body text-sm text-muted-foreground leading-relaxed">
              {t.home.philosophyText.substring(0, 150)}...
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-muted-foreground">
              {t.nav.catalog}
            </h4>
            <nav className="flex flex-col gap-2">
              <Link
                href="/catalog?category=bathrobes"
                className="text-body text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-footer-bathrobes"
              >
                {t.nav.bathrobes}
              </Link>
              <Link
                href="/catalog?category=towels"
                className="text-body text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-footer-towels"
              >
                {t.nav.towels}
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-muted-foreground">
              {t.contact.title}
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:info@marycollection.com"
                className="text-body text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                data-testid="link-footer-email"
              >
                <Mail className="h-4 w-4" />
                info@marycollection.com
              </a>
              <a
                href="tel:+998901234567"
                className="text-body text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                data-testid="link-footer-phone"
              >
                <Phone className="h-4 w-4" />
                +998 90 123 45 67
              </a>
              <a
                href="https://wa.me/998901234567"
                target="_blank"
                rel="noopener noreferrer"
                className="text-body text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                data-testid="link-footer-whatsapp"
              >
                <SiWhatsapp className="h-4 w-4" />
                WhatsApp
              </a>
              <span className="text-body text-sm text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Tashkent, Uzbekistan
              </span>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-body text-xs text-muted-foreground">
            © {currentYear} Mary Collection. {t.footer.rights}.
          </p>
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
          </div>
        </div>
      </div>
    </footer>
  );
}
