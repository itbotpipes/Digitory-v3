'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function MissionCta() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const line1 = ["We", "envision.", "We", "deliver."];
  const line2 = ["We", "execute.", "We", "evolve."];
  const totalWords = line1.length + line2.length;

  useEffect(() => {
    const handleScroll = () => {
      const track = sectionRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // The scroll range is when the top of the track hits the top of the viewport
      // until the bottom of the track hits the bottom of the viewport
      const totalDist = rect.height - viewportHeight;
      const scrolledDist = -rect.top;

      const progress = scrolledDist / totalDist;
      const clamped = Math.max(0, Math.min(1, progress));
      setScrollProgress(clamped);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <section className="bg-white dark:bg-[#0d0d0e] transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 md:px-8 space-y-16 py-8 md:py-12">



        {/* Scroll-locked Word Reveal — 130vh native sticky track */}
        <div
          ref={sectionRef}
          className="h-[130vh] relative"
        >
          {/* Sticky container pins text in viewport during track scroll */}
          <div className="sticky top-[25vh] h-[50vh] flex flex-col justify-center gap-2 select-none text-center overflow-hidden">
          {/* Line 1 */}
          <h3 className="text-[48px] sm:text-[62px] md:text-[82px] font-[900] tracking-tight leading-[1.05]">
            {line1.map((word, idx) => {
              const wordStart = idx / totalWords;
              const wordEnd = (idx + 0.9) / totalWords;
              let clamped = (scrollProgress - wordStart) / (wordEnd - wordStart);
              clamped = Math.max(0, Math.min(1, clamped));
              const isOrange = idx % 2 === 1;
              return (
                <span
                  key={idx}
                  className="relative inline-block mr-[0.25em] text-[#E5E7EB] dark:text-[#2a2a2e]"
                >
                  {word}
                  <span
                    className={`absolute inset-0 ${isOrange ? 'text-[#FF4F18]' : 'text-[#111111] dark:text-white'}`}
                    style={{ opacity: clamped }}
                  >
                    {word}
                  </span>
                </span>
              );
            })}
          </h3>

          {/* Line 2 */}
          <h3 className="text-[48px] sm:text-[62px] md:text-[82px] font-[900] tracking-tight leading-[1.05]">
            {line2.map((word, idx) => {
              const globalIdx = line1.length + idx;
              const wordStart = globalIdx / totalWords;
              const wordEnd = (globalIdx + 0.9) / totalWords;
              let clamped = (scrollProgress - wordStart) / (wordEnd - wordStart);
              clamped = Math.max(0, Math.min(1, clamped));
              const isOrange = idx % 2 === 1;
              return (
                <span
                  key={idx}
                  className="relative inline-block mr-[0.25em] text-[#E5E7EB] dark:text-[#2a2a2e]"
                >
                  {word}
                  <span
                    className={`absolute inset-0 ${isOrange ? 'text-[#FF4F18]' : 'text-[#111111] dark:text-white'}`}
                    style={{ opacity: clamped }}
                  >
                    {word}
                  </span>
                </span>
              );
            })}
          </h3>
        </div>
      </div>

      </div>
    </section>
  );
}
