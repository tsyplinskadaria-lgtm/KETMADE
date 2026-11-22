import { useEffect, useMemo, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { AboutArtist } from './components/AboutArtist';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Gallery } from './components/Gallery';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Lightbox } from './components/Lightbox';
import { Workshops } from './components/Workshops';
import { CMS_CONTENT } from './data/cmsContent';
import type {
  GalleryCategory,
  GalleryViewMode,
  InquiryTopic,
  Language,
} from './types/cms';
import {
  filterGalleryItems,
  GALLERY_PAGE_SIZE,
  getHtmlLangAttribute,
  getNextLightboxIndex,
  getPrevLightboxIndex,
  resolveLanguage,
} from './utils/portfolio';

const STORAGE_KEY = 'ketmade_lang';

function readInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  const params = new URLSearchParams(window.location.search);
  const queryLang = params.get('lang');
  if (queryLang) return resolveLanguage(queryLang, 'en');
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) return resolveLanguage(saved, 'en');
  } catch {
    // Ignore storage access errors in restricted environments
  }
  return 'en';
}

export default function App() {
  const [lang, setLang] = useState<Language>(readInitialLanguage);
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('all');
  const [viewMode, setViewMode] = useState<GalleryViewMode>('grid');
  const [visibleLimit, setVisibleLimit] = useState<number>(GALLERY_PAGE_SIZE);
  const [lightboxPieceId, setLightboxPieceId] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<InquiryTopic>('workshop-adult');
  const [prefilledMessage, setPrefilledMessage] = useState('');

  useEffect(() => {
    document.documentElement.lang = getHtmlLangAttribute(lang);
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore storage access errors
    }
  }, [lang]);

  const filteredGallery = useMemo(
    () => filterGalleryItems(CMS_CONTENT.galleryItems, activeCategory),
    [activeCategory]
  );

  const lightboxIndex = useMemo(() => {
    if (!lightboxPieceId) return -1;
    return filteredGallery.findIndex((item) => item.id === lightboxPieceId);
  }, [filteredGallery, lightboxPieceId]);

  const activeLightboxPiece =
    lightboxIndex >= 0 ? filteredGallery[lightboxIndex] : null;

  const handleSelectCategory = (category: GalleryCategory) => {
    setActiveCategory(category);
    setVisibleLimit(GALLERY_PAGE_SIZE);
    setLightboxPieceId(null);
  };

  const handlePrevLightbox = () => {
    if (lightboxIndex < 0) return;
    const prevIdx = getPrevLightboxIndex(lightboxIndex, filteredGallery.length);
    if (prevIdx >= 0) setLightboxPieceId(filteredGallery[prevIdx].id);
  };

  const handleNextLightbox = () => {
    if (lightboxIndex < 0) return;
    const nextIdx = getNextLightboxIndex(lightboxIndex, filteredGallery.length);
    if (nextIdx >= 0) setLightboxPieceId(filteredGallery[nextIdx].id);
  };

  const scrollToContactWithTopic = (topic: InquiryTopic, note = '') => {
    setSelectedTopic(topic);
    if (note) {
      setPrefilledMessage(note);
    }
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInquirePiece = (pieceTitle: string) => {
    setLightboxPieceId(null);
    const introPrefix =
      lang === 'ua'
        ? `Вітаю! Цікавить робота «${pieceTitle}». Підкажіть, будь ласка, щодо наявності та деталей.`
        : lang === 'nl'
        ? `Hallo Katrin, ik ben geïnteresseerd in het werk "${pieceTitle}". Is dit stuk nog beschikbaar?`
        : `Hello Katrin, I would love to inquire about availability and details for "${pieceTitle}".`;
    scrollToContactWithTopic('general', introPrefix);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-milk text-espresso">
        <Header
          lang={lang}
          onChangeLang={setLang}
          navStrings={CMS_CONTENT.ui.nav}
          onBookWorkshop={() => scrollToContactWithTopic('workshop-adult')}
        />

        <main className="flex-1">
          <Hero hero={CMS_CONTENT.hero} lang={lang} />

          <AboutArtist about={CMS_CONTENT.about} lang={lang} />

          <Gallery
            items={CMS_CONTENT.galleryItems}
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
            visibleLimit={visibleLimit}
            onShowMore={() => setVisibleLimit((prev) => prev + GALLERY_PAGE_SIZE)}
            onShowLess={() => setVisibleLimit(GALLERY_PAGE_SIZE)}
            onOpenLightbox={(id) => setLightboxPieceId(id)}
            strings={CMS_CONTENT.ui.gallery}
            lang={lang}
          />

          <Workshops
            workshops={CMS_CONTENT.workshops}
            lang={lang}
            onBookFormat={(topic) => scrollToContactWithTopic(topic)}
          />

          <Contact
            contact={CMS_CONTENT.contact}
            formStrings={CMS_CONTENT.ui.contactForm}
            lang={lang}
            selectedTopic={selectedTopic}
            onChangeTopic={setSelectedTopic}
            prefilledMessage={prefilledMessage}
          />
        </main>

        <Footer
          lang={lang}
          onChangeLang={setLang}
          navStrings={CMS_CONTENT.ui.nav}
          footerStrings={CMS_CONTENT.ui.footer}
          contact={CMS_CONTENT.contact}
        />

        <Lightbox
          piece={activeLightboxPiece}
          currentIndex={lightboxIndex}
          totalCount={filteredGallery.length}
          onClose={() => setLightboxPieceId(null)}
          onPrev={handlePrevLightbox}
          onNext={handleNextLightbox}
          onInquire={handleInquirePiece}
          strings={CMS_CONTENT.ui.gallery}
          lang={lang}
        />
      </div>
    </MotionConfig>
  );
}
