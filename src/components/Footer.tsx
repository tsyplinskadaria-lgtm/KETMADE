import type { ContactACF, Language, UIStrings } from '../types/cms';
import { pickText, SUPPORTED_LANGUAGES } from '../utils/portfolio';

interface FooterProps {
  lang: Language;
  onChangeLang: (lang: Language) => void;
  navStrings: UIStrings['nav'];
  footerStrings: UIStrings['footer'];
  contact: ContactACF;
}

export function Footer({
  lang,
  onChangeLang,
  navStrings,
  footerStrings,
  contact,
}: FooterProps) {
  const navLinks = [
    { href: '#about', label: pickText(navStrings.about, lang) },
    { href: '#gallery', label: pickText(navStrings.gallery, lang) },
    { href: '#workshops', label: pickText(navStrings.workshops, lang) },
    { href: '#contact', label: pickText(navStrings.contact, lang) },
  ];

  return (
    <footer className="bg-espresso text-sand border-t border-espresso">
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-sand/15">
          {/* Brand & Studio Summary */}
          <div className="lg:col-span-5 space-y-4">
            <a
              href="#top"
              className="inline-block font-serif text-3xl tracking-[0.08em] text-milk"
            >
              KETMADE
            </a>
            <p className="text-sm leading-relaxed text-sand/80 max-w-sm">
              {pickText(footerStrings.tagline, lang)}
            </p>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-xs uppercase tracking-[0.14em] text-sand/60">
              {pickText(footerStrings.navigationHeading, lang)}
            </p>
            <ul className="space-y-2.5 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sand hover:text-milk transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Socials */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-xs uppercase tracking-[0.14em] text-sand/60">
              {pickText(footerStrings.studioHeading, lang)}
            </p>
            <div className="space-y-2 text-sm text-sand/90">
              <p>{contact.studioAddress}</p>
              <p>
                <a
                  href={`mailto:${contact.email}`}
                  className="hover:text-milk underline decoration-sand/30 underline-offset-4 transition-colors"
                >
                  {contact.email}
                </a>
              </p>
              <div className="flex items-center gap-4 pt-1">
                {contact.socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs uppercase tracking-wider text-sand/80 hover:text-milk transition-colors"
                  >
                    {s.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Language Switcher */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-xs uppercase tracking-[0.14em] text-sand/60">
              {pickText(footerStrings.languageHeading, lang)}
            </p>
            <div className="flex items-center gap-2">
              {SUPPORTED_LANGUAGES.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => onChangeLang(code)}
                  aria-pressed={lang === code}
                  className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                    lang === code
                      ? 'bg-terracotta text-milk font-semibold'
                      : 'border border-sand/25 text-sand hover:border-milk hover:text-milk'
                  }`}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-sand/65">
          <p>{pickText(footerStrings.copyright, lang)}</p>
          <p>ketmade.com</p>
        </div>
      </div>
    </footer>
  );
}
