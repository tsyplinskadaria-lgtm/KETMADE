import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import type { Language, UIStrings } from '../types/cms';
import { pickText, SUPPORTED_LANGUAGES } from '../utils/portfolio';

interface HeaderProps {
  lang: Language;
  onChangeLang: (lang: Language) => void;
  navStrings: UIStrings['nav'];
  onBookWorkshop: () => void;
}

export function Header({
  lang,
  onChangeLang,
  navStrings,
  onBookWorkshop,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [mobileOpen]);

  const navLinks = [
    { href: '#about', label: pickText(navStrings.about, lang) },
    { href: '#gallery', label: pickText(navStrings.gallery, lang) },
    { href: '#workshops', label: pickText(navStrings.workshops, lang) },
    { href: '#contact', label: pickText(navStrings.contact, lang) },
  ];

  const handleMobileNavClick = (href: string) => {
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-espresso/95 backdrop-blur-md text-milk border-b border-sand/15">
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 h-16 md:h-[72px] flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <a
          href="#top"
          className="font-serif text-2xl md:text-[26px] font-medium tracking-[0.08em] text-milk whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta"
        >
          KETMADE
        </a>

        {/* Zone 2: Single-line text navigation */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 lg:gap-9 text-[14px] font-medium text-sand/80"
        >
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative py-1 whitespace-nowrap shrink-0 hover:text-milk transition-colors duration-150 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-terracotta after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Language Switcher + Primary Action / Mobile Trigger */}
        <div className="flex items-center gap-4 lg:gap-6 shrink-0">
          <div
            role="group"
            aria-label="Language switcher"
            className="hidden sm:flex items-center gap-1 text-xs tracking-wider"
          >
            {SUPPORTED_LANGUAGES.map((code, idx) => (
              <span key={code} className="inline-flex items-center">
                {idx > 0 && (
                  <span aria-hidden="true" className="text-sand/30 mx-1">
                    /
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onChangeLang(code)}
                  aria-pressed={lang === code}
                  className={`px-1.5 py-1 uppercase transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta ${
                    lang === code
                      ? 'text-milk font-semibold underline decoration-terracotta underline-offset-4'
                      : 'text-sand/65 hover:text-milk'
                  }`}
                >
                  {code.toUpperCase()}
                </button>
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={onBookWorkshop}
            className="hidden md:inline-flex items-center justify-center px-5 py-2.5 text-[13px] font-medium tracking-wide bg-terracotta text-milk hover:bg-terracotta-dark transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand"
          >
            {pickText(navStrings.bookWorkshop, lang)}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={
              mobileOpen
                ? pickText(navStrings.closeMenu, lang)
                : pickText(navStrings.openMenu, lang)
            }
            className="md:hidden inline-flex items-center justify-center w-11 h-11 text-milk hover:text-sand transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-terracotta"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Animated Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation-drawer"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-t border-sand/15 bg-espresso text-milk px-6 py-8 space-y-8 shadow-xl"
          >
            <nav aria-label="Mobile Navigation" className="flex flex-col gap-5">
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleMobileNavClick(item.href);
                  }}
                  className="font-serif text-3xl text-milk hover:text-terracotta transition-colors py-1"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="pt-6 border-t border-sand/15 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-sand/70">
                  UA / NL / EN
                </span>
                <div className="flex items-center gap-2">
                  {SUPPORTED_LANGUAGES.map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => onChangeLang(code)}
                      aria-pressed={lang === code}
                      className={`min-w-[44px] min-h-[44px] text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                        lang === code
                          ? 'bg-terracotta text-milk font-semibold'
                          : 'bg-sand/10 text-sand hover:bg-sand/20'
                      }`}
                    >
                      {code.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onBookWorkshop();
                }}
                className="w-full py-3.5 px-5 bg-terracotta text-milk text-sm font-medium tracking-wide hover:bg-terracotta-dark transition-colors cursor-pointer"
              >
                {pickText(navStrings.bookWorkshop, lang)}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
