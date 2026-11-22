import { useEffect } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import type { GalleryPieceACF, Language, UIStrings } from '../types/cms';
import { pickText } from '../utils/portfolio';
import { ResilientImage } from './ResilientImage';

interface LightboxProps {
  piece: GalleryPieceACF | null;
  currentIndex: number;
  totalCount: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onInquire: (pieceTitle: string) => void;
  strings: UIStrings['gallery'];
  lang: Language;
}

export function Lightbox({
  piece,
  currentIndex,
  totalCount,
  onClose,
  onPrev,
  onNext,
  onInquire,
  strings,
  lang,
}: LightboxProps) {
  useEffect(() => {
    if (!piece) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [piece, onClose, onNext, onPrev]);

  if (!piece) return null;

  const title = pickText(piece.title, lang);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-piece-title"
      className="fixed inset-0 z-50 bg-[#181310] text-milk flex flex-col justify-between p-4 sm:p-8 lg:p-10 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top Bar */}
      <div className="max-w-[1360px] w-full mx-auto flex items-center justify-between gap-4 pb-4">
        <span className="text-xs tracking-[0.14em] uppercase text-sand/80 tabular-nums">
          {String(currentIndex + 1).padStart(2, '0')} /{' '}
          {String(totalCount).padStart(2, '0')}
        </span>

        <button
          type="button"
          onClick={onClose}
          aria-label={pickText(strings.closeLightbox, lang)}
          className="inline-flex items-center justify-center w-11 h-11 border border-sand/25 text-milk hover:border-milk hover:bg-milk/10 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-sand"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Exhibition Content */}
      <div className="max-w-[1360px] w-full mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center py-4">
        <div className="lg:col-span-7 flex items-center justify-center">
          <ResilientImage
            src={piece.imageSrc}
            alt={pickText(piece.imageAlt, lang)}
            priority
            fallbackTitle={title}
            wrapperClassName="bg-transparent flex items-center justify-center"
            className="max-h-[70vh] w-auto max-w-full object-contain"
          />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <p className="text-xs tracking-[0.14em] uppercase text-terracotta font-medium">
              {pickText(strings.filters[piece.category], lang)}
            </p>
            <h3
              id="lightbox-piece-title"
              className="font-serif text-3xl sm:text-4xl font-normal text-milk leading-tight"
            >
              {title}
            </h3>
            <p className="text-[15px] leading-relaxed text-sand/90">
              {pickText(piece.description, lang)}
            </p>
          </div>

          <dl className="pt-6 border-t border-sand/20 space-y-4 text-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
              <dt className="text-sand/65">{pickText(strings.materialLabel, lang)}</dt>
              <dd className="text-milk sm:text-right max-w-xs">
                {pickText(piece.clayAndGlaze, lang)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-sand/65">{pickText(strings.dimensionsLabel, lang)}</dt>
              <dd className="text-milk tabular-nums">{piece.dimensionsCm}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-sand/65">{pickText(strings.yearLabel, lang)}</dt>
              <dd className="text-milk tabular-nums">{piece.year}</dd>
            </div>
          </dl>

          <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => onInquire(title)}
              className="px-6 py-3 bg-terracotta text-milk text-sm font-medium hover:bg-terracotta-dark transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-sand"
            >
              {pickText(strings.inquirePiece, lang)}
            </button>

            {totalCount > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onPrev}
                  aria-label={pickText(strings.previousPiece, lang)}
                  className="inline-flex items-center justify-center w-11 h-11 border border-sand/25 text-milk hover:border-milk hover:bg-milk/10 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-sand"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onNext}
                  aria-label={pickText(strings.nextPiece, lang)}
                  className="inline-flex items-center justify-center w-11 h-11 border border-sand/25 text-milk hover:border-milk hover:bg-milk/10 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-sand"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
