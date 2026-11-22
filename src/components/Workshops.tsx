import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import type { InquiryTopic, Language, WorkshopsACF } from '../types/cms';
import { pickText } from '../utils/portfolio';
import { ResilientImage } from './ResilientImage';
import { RevealSection } from './RevealSection';

interface WorkshopsProps {
  workshops: WorkshopsACF;
  lang: Language;
  onBookFormat: (topic: InquiryTopic) => void;
}

export function Workshops({ workshops, lang, onBookFormat }: WorkshopsProps) {
  return (
    <RevealSection
      id="workshops"
      ariaLabelledBy="workshops-heading"
      className="py-20 sm:py-28 lg:py-32 bg-milk border-b border-clay-line/80"
    >
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 space-y-14 lg:space-y-20">
        {/* Top Spread: Workshop Heading + Tactile Studio Photo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-5 space-y-5">
            <h2
              id="workshops-heading"
              className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-espresso"
            >
              {pickText(workshops.sectionTitle, lang)}
            </h2>
            <p className="text-[15px] sm:text-base leading-[1.75] text-umber max-w-[56ch]">
              {pickText(workshops.intro, lang)}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <ResilientImage
              src={workshops.processImage.src}
              alt={pickText(workshops.processImage.alt, lang)}
              fallbackTitle="KETMADE Clay Workshops"
              wrapperClassName="aspect-[16/10] w-full bg-cream"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Workshop Formats: Adult (Dark Espresso Contrast) & Dedicated Kids Clay Studio */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {workshops.formats.map((format, idx) => {
            const isKids = format.id === 'kids';
            return (
              <motion.article
                key={format.id}
                data-testid={`workshop-card-${format.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.6,
                  delay: idx * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -3 }}
                className={`p-8 sm:p-10 lg:p-12 flex flex-col justify-between gap-8 border transition-shadow duration-300 ${
                  isKids
                    ? 'bg-sand/65 border-terracotta/35 text-espresso'
                    : 'bg-espresso border-espresso text-milk'
                }`}
              >
                <div className="space-y-6">
                  <div className="space-y-3">
                    <p
                      className={`text-xs tracking-[0.14em] uppercase font-medium ${
                        isKids ? 'text-terracotta' : 'text-terracotta'
                      }`}
                    >
                      {pickText(format.kicker, lang)}
                    </p>
                    <h3
                      className={`font-serif text-3xl sm:text-[34px] leading-tight font-normal ${
                        isKids ? 'text-espresso' : 'text-milk'
                      }`}
                    >
                      {pickText(format.title, lang)}
                    </h3>
                  </div>

                  <p
                    className={`text-[15px] leading-[1.75] ${
                      isKids ? 'text-umber' : 'text-sand/85'
                    }`}
                  >
                    {pickText(format.summary, lang)}
                  </p>

                  <ul
                    className={`space-y-3 pt-4 border-t ${
                      isKids ? 'border-clay-line' : 'border-sand/15'
                    }`}
                  >
                    {format.highlights.map((item, hIdx) => (
                      <li
                        key={hIdx}
                        className={`flex items-start gap-3 text-sm leading-relaxed ${
                          isKids ? 'text-espresso' : 'text-sand/95'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className="text-terracotta font-serif text-base leading-none mt-1"
                        >
                          —
                        </span>
                        <span>{pickText(item, lang)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className={`pt-6 border-t space-y-6 ${
                    isKids ? 'border-clay-line' : 'border-sand/15'
                  }`}
                >
                  <div
                    className={`space-y-1 text-xs tabular-nums ${
                      isKids ? 'text-umber' : 'text-sand/70'
                    }`}
                  >
                    <p
                      className={`font-medium ${
                        isKids ? 'text-espresso' : 'text-milk'
                      }`}
                    >
                      {pickText(format.groupSize, lang)}
                    </p>
                    <p>{pickText(format.scheduleNote, lang)}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onBookFormat(format.inquiryTopic)}
                    className={`inline-flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 ${
                      isKids
                        ? 'bg-espresso text-milk hover:bg-terracotta focus-visible:outline-espresso'
                        : 'bg-terracotta text-milk hover:bg-terracotta-dark focus-visible:outline-sand'
                    }`}
                  >
                    <span>{pickText(format.ctaLabel, lang)}</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </RevealSection>
  );
}
