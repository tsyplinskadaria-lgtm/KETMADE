/**
 * WordPress / ACF Pro + Multilingual (Polylang / WPML) compatible schema.
 */

export type Language = 'ua' | 'nl' | 'en';

export type GalleryCategory = 'all' | 'sculptural' | 'tableware' | 'organic';

export type GalleryViewMode = 'grid' | 'index';

export type InquiryTopic = 'general' | 'workshop-adult' | 'workshop-kids' | 'commission';

export interface LocalizedText {
  ua: string;
  nl: string;
  en: string;
}

export interface HeroACF {
  eyebrow: LocalizedText;
  brandTitle: string; // Single H1 brand wordmark: KETMADE
  slogan: LocalizedText;
  subcaption: LocalizedText;
  ctaLabel: LocalizedText;
  marqueeItems: LocalizedText[];
  primaryImage: {
    src: string;
    alt: LocalizedText;
  };
  secondaryImage: {
    src: string;
    alt: LocalizedText;
  };
  studioLocation: LocalizedText;
  disciplineNote: LocalizedText;
}

export interface CraftStageACF {
  stepNumber: string;
  label: LocalizedText;
  title: LocalizedText;
  value: LocalizedText;
}

export interface AboutACF {
  sectionTitle: LocalizedText;
  leadStatement: LocalizedText;
  biography: LocalizedText[];
  philosophyTitle: LocalizedText;
  philosophyText: LocalizedText;
  portrait: {
    src: string;
    alt: LocalizedText;
  };
  craftDetails: CraftStageACF[];
}

export interface GalleryPieceACF {
  id: string;
  slug: string;
  category: Exclude<GalleryCategory, 'all'>;
  title: LocalizedText;
  description: LocalizedText;
  clayAndGlaze: LocalizedText;
  dimensionsCm: string;
  year: string;
  imageSrc: string;
  imageAlt: LocalizedText;
  gridVariant: 'wide' | 'tall' | 'square';
  woocommerceMeta?: {
    sku: string;
    priceEur: number;
    availability: 'unique' | 'edition' | 'sold';
  };
}

export interface WorkshopFormatACF {
  id: 'adult' | 'kids';
  kicker: LocalizedText;
  title: LocalizedText;
  summary: LocalizedText;
  highlights: LocalizedText[];
  scheduleNote: LocalizedText;
  groupSize: LocalizedText;
  inquiryTopic: InquiryTopic;
  ctaLabel: LocalizedText;
}

export interface WorkshopsACF {
  sectionTitle: LocalizedText;
  intro: LocalizedText;
  processImage: {
    src: string;
    alt: LocalizedText;
  };
  formats: WorkshopFormatACF[];
}

export interface ContactACF {
  sectionTitle: LocalizedText;
  intro: LocalizedText;
  studioCity: LocalizedText;
  studioAddress: string;
  studioHours: LocalizedText;
  email: string;
  socials: Array<{
    name: string;
    handle: string;
    href: string;
  }>;
}

export interface UIStrings {
  nav: {
    about: LocalizedText;
    gallery: LocalizedText;
    workshops: LocalizedText;
    contact: LocalizedText;
    bookWorkshop: LocalizedText;
    openMenu: LocalizedText;
    closeMenu: LocalizedText;
  };
  gallery: {
    sectionTitle: LocalizedText;
    intro: LocalizedText;
    filters: Record<GalleryCategory, LocalizedText>;
    viewGrid: LocalizedText;
    viewIndex: LocalizedText;
    showingLabel: LocalizedText;
    showMore: LocalizedText;
    showLess: LocalizedText;
    emptyMessage: LocalizedText;
    viewPiece: LocalizedText;
    inquirePiece: LocalizedText;
    previousPiece: LocalizedText;
    nextPiece: LocalizedText;
    closeLightbox: LocalizedText;
    materialLabel: LocalizedText;
    dimensionsLabel: LocalizedText;
    yearLabel: LocalizedText;
    indexColumns: {
      work: LocalizedText;
      category: LocalizedText;
      material: LocalizedText;
      dimensions: LocalizedText;
      year: LocalizedText;
    };
  };
  contactForm: {
    nameLabel: LocalizedText;
    namePlaceholder: LocalizedText;
    emailLabel: LocalizedText;
    emailPlaceholder: LocalizedText;
    topicLabel: LocalizedText;
    topics: Record<InquiryTopic, LocalizedText>;
    messageLabel: LocalizedText;
    messagePlaceholder: LocalizedText;
    submitButton: LocalizedText;
    sendingButton: LocalizedText;
    successTitle: LocalizedText;
    successBody: LocalizedText;
    sendAnother: LocalizedText;
    errors: {
      nameRequired: LocalizedText;
      emailRequired: LocalizedText;
      emailInvalid: LocalizedText;
      messageRequired: LocalizedText;
      messageTooShort: LocalizedText;
    };
  };
  footer: {
    tagline: LocalizedText;
    navigationHeading: LocalizedText;
    studioHeading: LocalizedText;
    languageHeading: LocalizedText;
    copyright: LocalizedText;
  };
}

export interface SiteCMSPayload {
  hero: HeroACF;
  about: AboutACF;
  galleryItems: GalleryPieceACF[];
  workshops: WorkshopsACF;
  contact: ContactACF;
  ui: UIStrings;
}
