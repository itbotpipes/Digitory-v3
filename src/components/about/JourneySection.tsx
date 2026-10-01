'use client';

import React from 'react';
import Image from 'next/image';

export default function JourneySection() {
  return (
    <section className="bg-white dark:bg-[#0d0d0e] py-10 md:py-16 transition-colors duration-300 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Heading and Description */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6 md:space-y-8 text-left">
            <h2 className="text-3xl sm:text-4xl md:text-[44px] font-[850] tracking-tight leading-[1.15] text-[#111111] dark:text-white">
              Our Journey of <br />
              <span className="text-[#FF4F18]">Empathy and Excellence</span>
            </h2>

            <p className="text-[17px] text-zinc-650 dark:text-zinc-400 leading-relaxed">
              We are proud to be recognized as a K-tech Elevate call 2 Award Winning Company. This accolade highlights our commitment to excellence and innovation in the tech industry. Our solutions have made a significant impact, driving success and transformation in our clients’ operations.
            </p>
          </div>

          {/* Right Column: Image */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <div className="relative w-full max-w-[540px] rounded-[24px] md:rounded-[32px] overflow-hidden border border-zinc-200/60 dark:border-[#2a2a2e]/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <div className="relative aspect-[4/3] w-full bg-zinc-100 dark:bg-zinc-900">
                <Image
                  src="/journey.jpg"
                  alt="Our Journey of Empathy and Excellence"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 540px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
