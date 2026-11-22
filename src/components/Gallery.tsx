import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, LayoutGrid, List, Plus, Minus } from 'lucide-react';
import type {
  GalleryCategory,
  GalleryPieceACF,
  GalleryViewMode,
  Language,
  UIStrings,
} from '../types/cms';
import {
  filterGalleryItems,
  GALLERY_PAGE_SIZE,
  getGalleryGridSpanClass,
  getRemainingWorksCount,
  paginateGalleryItems,
  pickText,
} from '../utils/portfolio';
import { ResilientImage } from './ResilientImage';
import { RevealSection } from './RevealSection';

interface GalleryProps {
  items: GalleryPieceACF[];
  activeCategory: GalleryCategory;
  onSelectCategory: (category: GalleryCategory) => void;
  viewMode: GalleryViewMode;
  onChangeViewMode: (mode: GalleryViewMode) => void;
  visibleLimit: number;
  onShowMore: () => void;
  onShowLess: () => void;
  onOpenLightbox: (pieceId: string) => void;
  strings: UIStrings['gallery'];
  lang: Language;
}

const CATEGORIES: readonly GalleryCategory[] = [
  'all',
  'sculptural',
  'tableware',
  'organic',
] as const;

export function Gallery({
  items,
  activeCategory,
  onSelectCategory,
  viewMode,
  onChangeViewMode,
  visibleLimit,
  onShowMore,
  onShowLess,
  onOpenLightbox,
  strings,
  lang,
}: GalleryProps) {
  const [hoveredPieceId, setHoveredPieceId] = useState<string | null>(null);

  const filtered = filterGalleryItems(items, activeCategory);
  const displayedGridItems = paginateGalleryItems(filtered, visibleLimit);
  const remainingCount = getRemainingWorksCount(
    filtered.length,
    displayedGridItems.length
  );

  const previewPiece =
    filtered.find((p) => p.id === hoveredPieceId) ?? filtered[0] ?? null;

  return (
    <RevealSection
      id="gallery"
      ariaLabelledBy="gallery-heading"
      className="py-20 sm:py-28 lg:py-32 bg-cream/75 border-b border-clay-line/80"
    >
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Masthead */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-clay-line">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3 text-xs tracking-[0.14em] uppercase text-terracotta font-medium tabular-nums">
              <span>{pickText(strings.showingLabel, lang)}</span>
              <span aria-hidden="true">·</span>
              <span>
                {String(
                  viewMode === 'index' ? filtered.length : displayedGridItems.length
                ).padStart(2, '0')}{' '}
                / {String(filtered.length).padStart(2, '0')}
              </span>
            </div>
            <h2
              id="gallery-heading"
              className="font-serif text-4xl sm:text-5xl lg:text-[54px] font-normal tracking-tight text-espresso leading-none"
            >
              {pickText(strings.sectionTitle, lang)}
            </h2>
            <p className="text-[15px] sm:text-base leading-relaxed text-umber max-w-xl">
              {pickText(strings.intro, lang)}
            </p>
          </div>

          {/* View Mode Switcher: Exhibition Grid vs Scalable Catalogue Index */}
          <div
            role="group"
            aria-label="Gallery view mode"
            className="inline-flex items-center self-start lg:self-end border border-clay-line bg-milk p-1 shrink-0"
          >
            <button
              type="button"
              onClick={() => onChangeViewMode('grid')}
              aria-pressed={viewMode === 'grid'}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-medium tracking-wide transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                viewMode === 'grid'
                  ? 'bg-espresso text-milk'
                  : 'text-umber hover:text-espresso'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{pickText(strings.viewGrid, lang)}</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeViewMode('index')}
              aria-pressed={viewMode === 'index'}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-medium tracking-wide transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                viewMode === 'index'
                  ? 'bg-espresso text-milk'
                  : 'text-umber hover:text-espresso'
              }`}
            >
              <List className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{pickText(strings.viewIndex, lang)}</span>
            </button>
          </div>
        </div>

        {/* Category Filter Tabs with Animated Underline Indicator */}
        <div
          role="tablist"
          aria-label={pickText(strings.sectionTitle, lang)}
          className="flex flex-wrap items-center gap-6 sm:gap-8 py-5 border-b border-clay-line/70"
        >
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            const categoryCount = filterGalleryItems(items, category).length;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectCategory(category)}
                className={`relative py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta ${
                  isActive ? 'text-espresso' : 'text-umber hover:text-espresso'
                }`}
              >
                <span>{pickText(strings.filters[category], lang)}</span>
                <span className="ml-1.5 text-[11px] text-terracotta tabular-nums">
                  {categoryCount}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="gallery-category-indicator"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    className="absolute left-0 right-0 -bottom-[1px] h-0.5 bg-terracotta"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Empty State */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-serif text-2xl text-umber">
              {pickText(strings.emptyMessage, lang)}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          /* EXHIBITION GRID VIEW (Scalable 3-column staggered gallery + Load More) */
          <>
            <motion.div
              layout
              data-testid="gallery-grid"
              className="pt-12 lg:pt-14 grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-8 lg:gap-x-9 lg:gap-y-16 items-start"
            >
              <AnimatePresence mode="popLayout">
                {displayedGridItems.map((piece, index) => {
                  const spanClass = getGalleryGridSpanClass(
                    index,
                    displayedGridItems.length
                  );
                  const aspectClass =
                    piece.gridVariant === 'tall'
                      ? 'aspect-[4/5]'
                      : piece.gridVariant === 'square'
                      ? 'aspect-square'
                      : 'aspect-[4/3]';

                  return (
                    <motion.article
                      layout
                      key={piece.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{
                        duration: 0.45,
                        delay: Math.min(index * 0.05, 0.25),
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={`${spanClass} group`}
                    >
                      <button
                        type="button"
                        onClick={() => onOpenLightbox(piece.id)}
                        aria-label={`${pickText(piece.title, lang)} — ${pickText(
                          strings.viewPiece,
                          lang
                        )}`}
                        className="w-full text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta"
                      >
                        <div className="relative overflow-hidden bg-sand/60">
                          <ResilientImage
                            src={piece.imageSrc}
                            alt={pickText(piece.imageAlt, lang)}
                            fallbackTitle={pickText(piece.title, lang)}
                            wrapperClassName={`${aspectClass} w-full`}
                            className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                          />
                          <span
                            aria-hidden="true"
                            className="absolute top-3 left-3 px-2.5 py-1 bg-espresso/85 text-milk text-[11px] tracking-[0.14em] tabular-nums opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>

                        <div className="pt-4 flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2 text-xs text-umber">
                              <span className="uppercase tracking-[0.1em] text-terracotta font-medium">
                                {pickText(strings.filters[piece.category], lang)}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums">{piece.year}</span>
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums">{piece.dimensionsCm}</span>
                            </div>

                            <h3 className="font-serif text-2xl sm:text-[26px] leading-snug font-normal text-espresso group-hover:text-terracotta transition-colors duration-200">
                              {pickText(piece.title, lang)}
                            </h3>
                          </div>

                          <span
                            aria-hidden="true"
                            className="mt-1 inline-flex items-center justify-center w-9 h-9 border border-clay-line bg-milk text-espresso group-hover:border-terracotta group-hover:bg-terracotta group-hover:text-milk transition-colors duration-200 shrink-0"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </span>
                        </div>
                      </button>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Scalable Pagination Controls */}
            {filtered.length > GALLERY_PAGE_SIZE && (
              <div className="pt-14 lg:pt-16 flex items-center justify-center">
                {remainingCount > 0 ? (
                  <button
                    type="button"
                    onClick={onShowMore}
                    className="inline-flex items-center gap-3 px-7 py-3.5 border border-espresso bg-milk text-espresso text-sm font-medium hover:bg-espresso hover:text-milk transition-colors duration-200 cursor-pointer tabular-nums"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    <span>
                      {pickText(strings.showMore, lang)} ({remainingCount})
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onShowLess}
                    className="inline-flex items-center gap-3 px-7 py-3.5 border border-clay-line bg-milk text-umber text-sm font-medium hover:border-espresso hover:text-espresso transition-colors duration-200 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" aria-hidden="true" />
                    <span>{pickText(strings.showLess, lang)}</span>
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          /* ARCHIVE INDEX VIEW (High-capacity scannable catalogue + floating artwork preview) */
          <div
            data-testid="gallery-index"
            className="pt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
          >
            <div className="lg:col-span-8 overflow-x-auto">
              <div className="hidden sm:grid grid-cols-12 gap-4 pb-3 border-b border-clay-line text-[11px] uppercase tracking-[0.14em] text-umber font-medium">
                <div className="col-span-5">{pickText(strings.indexColumns.work, lang)}</div>
                <div className="col-span-2">{pickText(strings.indexColumns.category, lang)}</div>
                <div className="col-span-3">{pickText(strings.indexColumns.dimensions, lang)}</div>
                <div className="col-span-2 text-right">{pickText(strings.indexColumns.year, lang)}</div>
              </div>

              <div className="divide-y divide-clay-line/80">
                {filtered.map((piece, idx) => (
                  <button
                    key={piece.id}
                    type="button"
                    onMouseEnter={() => setHoveredPieceId(piece.id)}
                    onFocus={() => setHoveredPieceId(piece.id)}
                    onClick={() => onOpenLightbox(piece.id)}
                    className="w-full text-left py-4 sm:py-5 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center group hover:bg-milk/70 px-2 -mx-2 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-terracotta"
                  >
                    <div className="sm:col-span-5 flex items-baseline gap-3">
                      <span className="text-xs text-terracotta tabular-nums font-medium">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="font-serif text-xl sm:text-2xl text-espresso group-hover:text-terracotta transition-colors">
                        {pickText(piece.title, lang)}
                      </span>
                    </div>

                    <div className="sm:col-span-2 text-xs uppercase tracking-[0.1em] text-umber">
                      {pickText(strings.filters[piece.category], lang)}
                    </div>

                    <div className="sm:col-span-3 text-xs text-umber tabular-nums">
                      {piece.dimensionsCm}
                    </div>

                    <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-3 text-xs text-espresso tabular-nums">
                      <span>{piece.year}</span>
                      <ArrowUpRight
                        className="w-4 h-4 text-umber group-hover:text-terracotta transition-colors"
                        aria-hidden="true"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sticky Live Preview Plate for Index Browsing */}
            <div className="hidden lg:block lg:col-span-4 lg:sticky lg:top-24">
              <AnimatePresence mode="wait">
                {previewPiece && (
                  <motion.div
                    key={previewPiece.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-milk p-5 border border-clay-line space-y-4"
                  >
                    <ResilientImage
                      src={previewPiece.imageSrc}
                      alt={pickText(previewPiece.imageAlt, lang)}
                      wrapperClassName="aspect-[4/5] w-full bg-cream"
                      className="w-full h-full object-cover"
                    />
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.12em] text-terracotta font-medium">
                        {pickText(strings.filters[previewPiece.category], lang)}
                      </p>
                      <p className="font-serif text-2xl text-espresso">
                        {pickText(previewPiece.title, lang)}
                      </p>
                      <p className="text-xs text-umber">
                        {pickText(previewPiece.clayAndGlaze, lang)}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </RevealSection>
  );
}
