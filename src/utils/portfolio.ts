import type {
  GalleryCategory,
  GalleryPieceACF,
  InquiryTopic,
  Language,
  LocalizedText,
} from '../types/cms';

export const SUPPORTED_LANGUAGES: readonly Language[] = ['ua', 'nl', 'en'] as const;
export const GALLERY_PAGE_SIZE = 6;

export function resolveLanguage(
  candidate: string | null | undefined,
  fallback: Language = 'en'
): Language {
  if (!candidate) return fallback;
  const normalized = candidate.trim().toLowerCase();
  if (normalized === 'ua' || normalized === 'uk') return 'ua';
  if (normalized === 'nl') return 'nl';
  if (normalized === 'en') return 'en';
  return fallback;
}

export function pickText(localized: LocalizedText, lang: Language): string {
  return localized[lang] ?? localized.en;
}

export function filterGalleryItems(
  items: readonly GalleryPieceACF[],
  category: GalleryCategory
): GalleryPieceACF[] {
  if (category === 'all') {
    return [...items];
  }
  return items.filter((item) => item.category === category);
}

export function paginateGalleryItems(
  items: readonly GalleryPieceACF[],
  visibleLimit: number
): GalleryPieceACF[] {
  if (visibleLimit <= 0) return [];
  return items.slice(0, visibleLimit);
}

export function getRemainingWorksCount(totalItems: number, visibleCount: number): number {
  return Math.max(0, totalItems - visibleCount);
}

export function getNextLightboxIndex(currentIndex: number, total: number): number {
  if (total <= 0) return -1;
  return (currentIndex + 1) % total;
}

export function getPrevLightboxIndex(currentIndex: number, total: number): number {
  if (total <= 0) return -1;
  return (currentIndex - 1 + total) % total;
}

export interface ContactFormInput {
  name: string;
  email: string;
  topic: InquiryTopic;
  message: string;
}

export type ContactValidationField = 'name' | 'email' | 'message';
export type ContactValidationCode =
  | 'nameRequired'
  | 'emailRequired'
  | 'emailInvalid'
  | 'messageRequired'
  | 'messageTooShort';

export type ContactValidationErrors = Partial<
  Record<ContactValidationField, ContactValidationCode>
>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(input: ContactFormInput): {
  valid: boolean;
  errors: ContactValidationErrors;
} {
  const errors: ContactValidationErrors = {};
  const trimmedName = input.name.trim();
  const trimmedEmail = input.email.trim();
  const trimmedMessage = input.message.trim();

  if (!trimmedName) {
    errors.name = 'nameRequired';
  }

  if (!trimmedEmail) {
    errors.email = 'emailRequired';
  } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
    errors.email = 'emailInvalid';
  }

  if (!trimmedMessage) {
    errors.message = 'messageRequired';
  } else if (trimmedMessage.length < 10) {
    errors.message = 'messageTooShort';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Generates a balanced 3-column museum cadence that scales gracefully from
 * 1 to 100+ works without creating oversized gaps or monotonous grids.
 */
export function getGalleryGridSpanClass(index: number, totalItems: number): string {
  if (totalItems === 1) {
    return 'md:col-span-6 md:col-start-4 lg:col-span-6 lg:col-start-4';
  }
  if (totalItems === 2) {
    return 'md:col-span-6 lg:col-span-6';
  }
  // Subtle staggered vertical rhythm across a 3-column (12-track) gallery
  const mod = index % 3;
  if (mod === 1) {
    return 'md:col-span-6 lg:col-span-4 lg:mt-10';
  }
  return 'md:col-span-6 lg:col-span-4';
}

export function getHtmlLangAttribute(lang: Language): string {
  return lang === 'ua' ? 'uk' : lang;
}
