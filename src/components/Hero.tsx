import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDownRight } from 'lucide-react';
import type { HeroACF, Language } from '../types/cms';
import { pickText } from '../utils/portfolio';
import { ResilientImage } from './ResilientImage';

interface HeroProps {
  hero: HeroACF;
  lang: Language;
}

export function Hero({ hero, lang }: HeroProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const primaryY = useTransform(scrollYProgress, [0, 1], [0, 36]);
  const secondaryY = useTransform(scrollYProgress, [0, 1], [0, -48]);
  const sealRotate = useTransform(scrollYProgress, [0, 1], [0, 90]);

  const scrollToGallery = () => {
    const galleryEl = document.getElementById('gallery');
    if (galleryEl) {
      galleryEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const marqueeWords = hero.marqueeItems.map((item) => pickText(item, lang));

  return (
    <section
      ref={containerRef}
      id="top"
      aria-labelledby="hero-brand-heading"
      className="bg-espresso text-milk pt-8 sm:pt-12 lg:pt-14 overflow-hidden"
    >
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 pb-14 sm:pb-20 lg:pb-24">
        {/* Top Architectural Masthead */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end pb-8 lg:pb-12"
        >
          <div className="lg:col-span-8">
            <p className="text-[13px] tracking-[0.16em] uppercase text-terracotta font-medium mb-3">
              {pickText(hero.eyebrow, lang)}
            </p>
            <h1
              id="hero-brand-heading"
              className="font-serif font-normal text-[clamp(3.6rem,9.5vw,7.75rem)] leading-[0.86] tracking-[-0.025em] text-milk"
            >
              {hero.brandTitle}
            </h1>
          </div>

          <div className="lg:col-span-4 lg:pb-2 border-t border-sand/15 lg:border-t-0 pt-4 lg:pt-0 lg:text-right flex flex-col justify-end gap-1.5">
            <p className="text-sm text-sand font-medium">
              {pickText(hero.studioLocation, lang)}
            </p>
            <p className="text-[13px] text-sand/65">
              {pickText(hero.disciplineNote, lang)}
            </p>
          </div>
        </motion.div>

        {/* Kinetic Asymmetric Ceramic Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Primary Wide Sculpture Frame with Scroll Parallax */}
          <motion.div
            style={{ y: primaryY }}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-8"
          >
            <ResilientImage
              src={hero.primaryImage.src}
              alt={pickText(hero.primaryImage.alt, lang)}
              priority
              fallbackTitle={hero.brandTitle}
              wrapperClassName="aspect-[16/10] w-full bg-[#241C18]"
              className="w-full h-full object-cover object-center"
            />
            <div className="mt-3.5 flex items-center justify-between text-xs text-sand/65">
              <span>{pickText(hero.subcaption, lang)}</span>
              <span className="tabular-nums tracking-wider">ketmade.com</span>
            </div>
          </motion.div>

          {/* Offset Floating Terracotta Vessel + Rotating Studio Seal + Slogan & CTA */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-8 lg:-mt-12">
            <motion.div
              style={{ y: secondaryY }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="hidden sm:block relative max-w-[300px] lg:max-w-none lg:w-[84%] lg:ml-auto"
            >
              <ResilientImage
                src={hero.secondaryImage.src}
                alt={pickText(hero.secondaryImage.alt, lang)}
                priority
                fallbackTitle="Terracotta Study"
                wrapperClassName="aspect-[4/5] w-full bg-[#241C18] shadow-2xl"
                className="w-full h-full object-cover"
              />

              {/* Subtle Rotating Kiln Seal Accent */}
              <motion.div
                style={{ rotate: sealRotate }}
                aria-hidden="true"
                className="hidden lg:flex absolute -left-8 -bottom-8 w-16 h-16 items-center justify-center bg-terracotta text-milk shadow-lg"
              >
                <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <circle cx="20" cy="20" r="14" strokeDasharray="3 3" />
                  <path d="M15 13h10l-1.5 5c3 3 4.5 6.5 4.5 10.5 0 3.5-3.2 5.5-8 5.5s-8-2-8-5.5c0-4 1.5-7.5 4.5-10.5L15 13z" />
                </svg>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 lg:pl-4 pt-2"
            >
              <p className="font-serif italic text-2xl sm:text-[27px] leading-[1.35] text-sand">
                {pickText(hero.slogan, lang)}
              </p>

              <motion.button
                type="button"
                onClick={scrollToGallery}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 px-7 py-3.5 bg-terracotta text-milk text-sm font-medium tracking-wide hover:bg-terracotta-dark transition-colors duration-200 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand"
              >
                <span>{pickText(hero.ctaLabel, lang)}</span>
                <ArrowDownRight className="w-4 h-4" aria-hidden="true" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Kinetic Studio Marquee Ribbon */}
      <div
        aria-hidden="true"
        className="border-t border-b border-sand/15 bg-[#231B17] py-4 overflow-hidden select-none"
      >
        <div className="animate-ketmade-marquee">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center gap-8 pr-8">
              {marqueeWords.map((word, idx) => (
                <span key={`${dup}-${idx}`} className="inline-flex items-center gap-8">
                  <span className="font-serif italic text-xl sm:text-2xl text-sand/85 whitespace-nowrap">
                    {word}
                  </span>
                  <span className="text-terracotta text-xs">◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
