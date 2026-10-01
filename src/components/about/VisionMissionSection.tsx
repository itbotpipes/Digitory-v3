'use client';

import React from 'react';
import { Globe, Layers } from 'lucide-react';

export default function VisionMissionSection() {
  const cards = [
    {
      title: 'Our Vision',
      description:
        'To become the operating system for hospitality worldwide — the single platform every restaurant runs on, from a single outlet to a global chain.',
      icon: <Globe className="w-6 h-6 stroke-[2]" />,
    },
    {
      title: 'Our Mission',
      description:
        'Digitory unifies orders, kitchen, inventory, and insights on one intelligent platform — giving restaurants the clarity and control to run with ease and grow with confidence.',
      icon: <Layers className="w-6 h-6 stroke-[2]" />,
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
          <div className="lg:col-span-5 text-zinc-650 dark:text-zinc-400 text-[17px] leading-relaxed lg:pt-2">
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
                <div className="flex h-13 w-13 items-center justify-center rounded-2xl  dark:bg-[#FF4F18]/10 border border-orange-200/60 dark:border-[#FF4F18]/20 text-[#FF4F18] shrink-0 shadow-xs">
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
