'use client';

import React from 'react';
import Image from 'next/image';

const CLIENT_LOGOS = [
  { name: 'Partner 1', src: '/comp1.png' },
  { name: 'Partner 2', src: '/comp2.png' },
  { name: 'Partner 3', src: '/comp3.png' },
  { name: 'Partner 4', src: '/comp4.png' },
  { name: 'Partner 5', src: '/comp5.png' },
  { name: 'Partner 6', src: '/comp6.png' },
  { name: 'Partner 7', src: '/comp7.png' },
  { name: 'Partner 8', src: '/comp8.png' },
  { name: 'Partner 9', src: '/comp9.png' },
  { name: 'Partner 10', src: '/comp10.png' },
];

export default function ClientsSection() {
  // 3-set duplicate for ultra-smooth non-jerky looping marquee across wide displays
  const duplicatedLogos = [...CLIENT_LOGOS, ...CLIENT_LOGOS, ...CLIENT_LOGOS];

  return (
    <section className="bg-white dark:bg-[#0d0d0e] py-10 md:py-16 transition-colors duration-300 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-8">

        {/* Header Block: Left Heading, Right Paragraph */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 mb-10 md:mb-14 items-center">
          <div className="lg:col-span-6">
            <h2 className="text-3xl sm:text-4xl md:text-[44px] font-[850] tracking-tight leading-[1.15] text-[#111111] dark:text-white">
              Our <span className="text-[#FF4F18]">Clients</span>
            </h2>
          </div>
          <div className="lg:col-span-6 lg:text-right text-zinc-650 dark:text-zinc-400 text-[17px] leading-relaxed">
            <p>
              Trusted by Premium Bars, Breweries & Clubs
            </p>
          </div>
        </div>

        {/* Logo Scroller Container with Edge Gradient Mask */}
        <div className="relative w-full overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-logo-marquee gap-6 sm:gap-8 items-center py-2 hover:[animation-play-state:paused]">
            {duplicatedLogos.map((logo, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full p-2.5 sm:p-3.5 bg-zinc-50/90 dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] shrink-0 transition-all duration-300 hover:scale-105 hover:bg-white dark:hover:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md"
              >
                <div className="relative w-full h-full flex items-center justify-center select-none rounded-full overflow-hidden">
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    width={110}
                    height={110}
                    className="w-full h-full object-contain rounded-full opacity-90 hover:opacity-100 transition-all duration-300 dark:brightness-105"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes logoMarquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .animate-logo-marquee {
          animation: logoMarquee 32s linear infinite;
        }
      `}</style>
    </section>
  );
}
