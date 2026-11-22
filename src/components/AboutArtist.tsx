import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { AboutACF, Language } from '../types/cms';
import { pickText } from '../utils/portfolio';
import { ResilientImage } from './ResilientImage';
import { RevealSection } from './RevealSection';

interface AboutArtistProps {
  about: AboutACF;
  lang: Language;
}

export function AboutArtist({ about, lang }: AboutArtistProps) {
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const activeStage = about.craftDetails[activeStageIdx] ?? about.craftDetails[0];

  return (
    <RevealSection
      id="about"
      ariaLabelledBy="about-heading"
      className="py-20 sm:py-28 lg:py-32 bg-milk border-b border-clay-line/80"
    >
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Portrait Column with Subtle Motion Frame */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <ResilientImage
              src={about.portrait.src}
              alt={pickText(about.portrait.alt, lang)}
              fallbackTitle="Katrin — Ceramic Artist"
              wrapperClassName="aspect-[3/4] w-full bg-cream"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Editorial Bio + Interactive 3-Stage Studio Process */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-10 lg:pt-2">
            <div className="space-y-6">
              <p className="text-[13px] tracking-[0.14em] uppercase text-terracotta font-medium">
                {pickText(about.sectionTitle, lang)}
              </p>

              <h2
                id="about-heading"
                className="font-serif text-3xl sm:text-4xl lg:text-[44px] leading-[1.15] font-normal text-espresso"
              >
                {pickText(about.leadStatement, lang)}
              </h2>

              <div className="space-y-5 pt-2 text-[15px] sm:text-base leading-[1.75] text-umber max-w-[65ch]">
                {about.biography.map((paragraph, idx) => (
                  <p key={idx}>{pickText(paragraph, lang)}</p>
                ))}
              </div>
            </div>

            {/* Philosophy Quote */}
            <div className="pt-8 border-t border-clay-line space-y-3 max-w-[65ch]">
              <h3 className="font-serif text-2xl font-normal text-espresso">
                {pickText(about.philosophyTitle, lang)}
              </h3>
              <p className="text-[15px] leading-[1.7] text-umber">
                {pickText(about.philosophyText, lang)}
              </p>
            </div>

            {/* Interactive Craft Stages Explorer */}
            <div className="pt-8 border-t border-clay-line space-y-6">
              <div
                role="tablist"
                aria-label={pickText(about.philosophyTitle, lang)}
                className="grid grid-cols-3 gap-2 sm:gap-4"
              >
                {about.craftDetails.map((stage, idx) => {
                  const isActive = idx === activeStageIdx;
                  return (
                    <button
                      key={stage.stepNumber}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveStageIdx(idx)}
                      className={`relative text-left pb-3 pt-1 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-terracotta ${
                        isActive ? 'text-espresso' : 'text-umber hover:text-espresso'
                      }`}
                    >
                      <span className="block text-[11px] uppercase tracking-[0.14em] text-terracotta tabular-nums mb-1">
                        {stage.stepNumber}
                      </span>
                      <span className="block font-serif text-lg sm:text-xl leading-tight">
                        {pickText(stage.label, lang)}
                      </span>
                      {isActive && (
                        <motion.span
                          layoutId="craft-stage-underline"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-terracotta"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                {activeStage && (
                  <motion.div
                    key={`${activeStage.stepNumber}-${lang}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-cream/80 border border-clay-line p-6 sm:p-7 space-y-2"
                  >
                    <h4 className="font-serif text-2xl text-espresso">
                      {pickText(activeStage.title, lang)}
                    </h4>
                    <p className="text-sm sm:text-[15px] leading-relaxed text-umber max-w-[60ch]">
                      {pickText(activeStage.value, lang)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </RevealSection>
  );
}
