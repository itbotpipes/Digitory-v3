'use client';

import React from 'react';

export default function VisionMissionSection() {
  const cards = [
    {
      title: 'Our Vision',
      description:
        'To become the operating system for hospitality worldwide — the single platform every restaurant runs on, from a single outlet to a global chain.',
      icon: (
        <svg className="w-5 h-5 text-[#FF4F18]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: 'Our Mission',
      description:
        'Digitory unifies orders, kitchen, inventory, and insights on one intelligent platform — giving restaurants the clarity and control to run with ease and grow with confidence.',
      icon: (
        <svg className="w-5 h-5 text-[#FF4F18]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m0 0l4.98-4.98m-4.98 4.98a14.99 14.99 0 01-.06.312m7.428-2.699a14.99 14.99 0 01.312-.06 15.09 15.09 0 012.448 2.448c.02.104.039.208.06.312m0 0l-4.98 4.98" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-white dark:bg-[#0d0d0e] py-10 md:py-16 transition-colors duration-300 relative">
      <div className="mx-auto max-w-7xl px-6 md:px-8 space-y-12">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          <div className="lg:col-span-7">
            <h2 className="text-3xl sm:text-4xl md:text-[44px] font-[850] tracking-tight leading-[1.15] text-[#111111] dark:text-white">
              Vision & <span className="text-[#FF4F18]">Mission.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 text-zinc-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed lg:pt-2">
            <p>
              Powering the future of food service with a single unified operating system designed for clarity, scale, and effortless control.
            </p>
          </div>
        </div>

        {/* 2-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-start rounded-[32px] p-6 sm:p-8 md:p-9 border border-zinc-200/70 dark:border-[#2a2a2e]/70 bg-white dark:bg-zinc-950/40 shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all duration-300 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10"
            >
              <div className="space-y-4">
                {/* Icon Container */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 text-[#FF4F18] shrink-0">
                  {card.icon}
                </div>

                {/* Card Title */}
                <h3 className="text-[18px] sm:text-[20px] font-bold text-zinc-900 dark:text-white leading-snug">
                  {card.title}
                </h3>

                {/* Body Text */}
                <p className="text-[14px] sm:text-[15px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
