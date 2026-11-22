import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterGalleryItems,
  getGalleryGridSpanClass,
  getHtmlLangAttribute,
  getNextLightboxIndex,
  getPrevLightboxIndex,
  getRemainingWorksCount,
  paginateGalleryItems,
  pickText,
  resolveLanguage,
  validateContactForm,
} from './portfolio';
import type { GalleryPieceACF } from '../types/cms';

const SAMPLE_PIECES: GalleryPieceACF[] = Array.from({ length: 9 }, (_, idx) => ({
  id: `piece-${idx + 1}`,
  slug: `piece-${idx + 1}`,
  category: idx % 3 === 0 ? 'sculptural' : idx % 3 === 1 ? 'tableware' : 'organic',
  title: { ua: `Твір ${idx + 1}`, nl: `Werk ${idx + 1}`, en: `Work ${idx + 1}` },
  description: { ua: 'Опис', nl: 'Beschrijving', en: 'Description' },
  clayAndGlaze: { ua: 'Шамот', nl: 'Steengoed', en: 'Stoneware' },
  dimensionsCm: '30 × 20 × 20 cm',
  year: '2026',
  imageSrc: `/sample-${idx + 1}.jpg`,
  imageAlt: { ua: 'Кераміка', nl: 'Keramiek', en: 'Ceramic' },
  gridVariant: idx % 2 === 0 ? 'tall' : 'square',
}));

test('resolveLanguage handles UA/UK, NL, EN and invalid values safely', () => {
  assert.equal(resolveLanguage('ua'), 'ua');
  assert.equal(resolveLanguage('UK'), 'ua');
  assert.equal(resolveLanguage('nl'), 'nl');
  assert.equal(resolveLanguage('en'), 'en');
  assert.equal(resolveLanguage('fr', 'en'), 'en');
  assert.equal(resolveLanguage(undefined, 'nl'), 'nl');
});

test('getHtmlLangAttribute maps ua to standard BCP-47 uk code', () => {
  assert.equal(getHtmlLangAttribute('ua'), 'uk');
  assert.equal(getHtmlLangAttribute('nl'), 'nl');
  assert.equal(getHtmlLangAttribute('en'), 'en');
});

test('pickText returns exact language string', () => {
  const sample = { ua: 'Кераміка', nl: 'Keramiek', en: 'Ceramics' };
  assert.equal(pickText(sample, 'ua'), 'Кераміка');
  assert.equal(pickText(sample, 'nl'), 'Keramiek');
  assert.equal(pickText(sample, 'en'), 'Ceramics');
});

test('filterGalleryItems returns all items for "all" and narrows by category', () => {
  assert.equal(filterGalleryItems(SAMPLE_PIECES, 'all').length, 9);
  const tableware = filterGalleryItems(SAMPLE_PIECES, 'tableware');
  assert.equal(tableware.length, 3);
  assert.equal(tableware[0].category, 'tableware');
});

test('paginateGalleryItems slices cleanly and computes remaining count', () => {
  const page1 = paginateGalleryItems(SAMPLE_PIECES, 6);
  assert.equal(page1.length, 6);
  assert.equal(getRemainingWorksCount(SAMPLE_PIECES.length, page1.length), 3);

  const expanded = paginateGalleryItems(SAMPLE_PIECES, 12);
  assert.equal(expanded.length, 9);
  assert.equal(getRemainingWorksCount(SAMPLE_PIECES.length, expanded.length), 0);
});

test('lightbox index navigation wraps cleanly in both directions', () => {
  assert.equal(getNextLightboxIndex(0, 9), 1);
  assert.equal(getNextLightboxIndex(8, 9), 0);
  assert.equal(getPrevLightboxIndex(0, 9), 8);
  assert.equal(getPrevLightboxIndex(5, 9), 4);
  assert.equal(getNextLightboxIndex(0, 0), -1);
});

test('validateContactForm rejects empty or malformed input and accepts valid input', () => {
  const emptyResult = validateContactForm({
    name: '   ',
    email: '',
    topic: 'general',
    message: '',
  });
  assert.equal(emptyResult.valid, false);
  assert.equal(emptyResult.errors.name, 'nameRequired');
  assert.equal(emptyResult.errors.email, 'emailRequired');
  assert.equal(emptyResult.errors.message, 'messageRequired');

  const validResult = validateContactForm({
    name: 'Sanne de Vries',
    email: 'sanne@example.nl',
    topic: 'workshop-adult',
    message: 'I would like to book two spots for the Saturday clay workshop.',
  });
  assert.equal(validResult.valid, true);
});

test('getGalleryGridSpanClass handles 1, 2, and multi-column staggered layouts', () => {
  assert.equal(
    getGalleryGridSpanClass(0, 1),
    'md:col-span-6 md:col-start-4 lg:col-span-6 lg:col-start-4'
  );
  assert.equal(getGalleryGridSpanClass(0, 2), 'md:col-span-6 lg:col-span-6');
  assert.equal(getGalleryGridSpanClass(0, 9), 'md:col-span-6 lg:col-span-4');
  assert.equal(getGalleryGridSpanClass(1, 9), 'md:col-span-6 lg:col-span-4 lg:mt-10');
});
