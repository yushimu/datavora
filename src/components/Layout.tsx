import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Rocket, Globe } from "lucide-react";
import { cn } from "../lib/utils";
import { useLanguage } from "../contexts/LanguageContext";
import { en } from "../locales/en";
import { id } from "../locales/id";

export function Layout({ children }: { children: ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const { language, setLanguage } = useLanguage();
  const t = language === 'en' ? en : id;

  const navLinks = [
    { name: t.nav.home, path: "/" },
    { name: t.nav.products, path: "/products" },
    { name: t.nav.services, path: "/services" },
    { name: t.nav.portfolio, path: "/portfolio" },
    { name: t.nav.testimonials, path: "/testimonials" },
    { name: t.nav.contact, path: "/contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-white text-black font-sans">
      {/* Global Background Blurs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gray-100 rounded-full blur-[80px] pointer-events-none"></div>

      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-white/70 backdrop-blur-xl border-b border-gray-100 py-3"
        )}
      >
        <div className="w-full max-w-[1600px] mx-auto px-5 md:px-12 lg:px-20">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <Rocket className="w-8 h-8 text-[#FF6B00] fill-current group-hover:scale-110 transition-transform" />
              <span className="font-black text-2xl tracking-tighter text-black uppercase">
                DATAVORA
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    location.pathname === link.path
                      ? "text-primary border-b-2 border-primary pb-1"
                      : "text-black"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/contact"
                className="px-5 min-h-[44px] inline-flex items-center justify-center bg-black text-white rounded-full text-sm font-semibold hover:bg-zinc-800 transition-all"
              >
                {t.nav.getStarted}
              </Link>
              <button
                onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-bold transition-colors text-black ml-2"
                aria-label="Toggle language"
              >
                <Globe className="w-4 h-4 text-primary" />
                {language === 'en' ? 'EN' : 'ID'}
              </button>
            </nav>

            {/* Mobile Actions (Language & Menu Toggle) */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-bold transition-colors text-black"
                aria-label="Toggle language"
              >
                <Globe className="w-4 h-4 text-primary" />
                {language === 'en' ? 'EN' : 'ID'}
              </button>
              
              <button
                className="min-h-[40px] min-w-[40px] flex items-center justify-center text-zinc-600 hover:text-zinc-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-zinc-200 shadow-lg py-4 px-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "block px-4 py-3 rounded-lg text-base font-medium transition-colors",
                  location.pathname === link.path
                    ? "bg-primary/10 text-primary"
                    : "text-zinc-600 hover:bg-zinc-50"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="flex-grow pt-24 pb-16 relative z-10">
        {children}
      </main>

      <footer className="bg-black text-white/50 py-16 mt-auto relative z-10">
        <div className="w-full max-w-[1600px] mx-auto px-5 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-6 group">
                <Rocket className="w-8 h-8 text-[#FF6B00] fill-current group-hover:scale-110 transition-transform" />
                <span className="font-black text-2xl tracking-tighter text-white uppercase">
                  DATAVORA
                </span>
              </Link>
              <p className="text-zinc-400 max-w-sm mb-8 leading-relaxed">
                {t.footer.desc}
              </p>
              <div className="flex gap-4">
                {/* Social icons placeholders */}
                {[1, 2, 3].map((i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:bg-primary hover:text-white transition-colors"
                  >
                    <div className="w-4 h-4 bg-current rounded-sm" />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-xs tracking-[0.2em] uppercase mb-6 text-white">{t.footer.navTitle}</h4>
              <ul className="space-y-4">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-white/50 hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-xs tracking-[0.2em] uppercase mb-6 text-white">{t.footer.contactTitle}</h4>
              <ul className="space-y-4 text-white/50 text-sm">
                <li>yunusshifa112@gmail.com</li>
                <li>+62 857-2264-1239</li>
                <li>Biru, Kec. Majalaya</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-white/50 text-[10px] uppercase tracking-[0.2em]">
            <p>&copy; {new Date().getFullYear()} {t.footer.rights}</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">{t.footer.privacy}</a>
              <a href="#" className="hover:text-primary transition-colors">{t.footer.terms}</a>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-white font-bold">{t.footer.status}</span>
            </div>
          </div>
        </div>
      </footer>
      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/6285722641239" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 bg-[#25D366] text-white p-3 md:p-4 rounded-full shadow-lg shadow-[#25D366]/30 hover:scale-110 transition-transform flex items-center justify-center group"
        aria-label="Contact on WhatsApp"
      >
        <svg 
          viewBox="0 0 24 24" 
          className="w-6 h-6 md:w-7 md:h-7 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  );
}
