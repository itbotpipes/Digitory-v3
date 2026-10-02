'use client';

import React from 'react';
import { Lightbulb, Code2, Trophy, TrendingUp } from 'lucide-react';

export default function StorySection() {
  const milestones = [
    {
      year: '2017',
      title: 'The Beginning',
      description: 'Digitory started with a simple idea: make digital marketing more meaningful, measurable, and memorable.',
      icon: <Lightbulb className="w-5 h-5 stroke-[2.2]" />,
    },
    {
      year: '2019',
      title: 'The Blueprint Goes Live',
      description: 'Our vision took shape. The Digitory blueprint went live, turning our ideas into a growing digital-first reality.',
      icon: <Code2 className="w-5 h-5 stroke-[2.2]" />,
    },
    {
      year: '2020',
      title: 'Recognition Arrives',
      description: 'Hard work met recognition. Digitory received an award, marking an important milestone in our journey.',
      icon: <Trophy className="w-5 h-5 stroke-[2.2]" />,
    },
    {
      year: 'Today',
      title: 'Global Growth',
      description: 'Now power restaurant businesses across the globe. Over 500+ active outlets rely on Digitory to manage orders, inventory, billing, and staff every day.',
      icon: <TrendingUp className="w-5 h-5 stroke-[2.2]" />,
    },
  ];

  return (
    <section className="bg-white dark:bg-[#0d0d0e] py-10 md:py-16 transition-colors duration-300 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10">
        
        {/* Title Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 mb-16 items-start">
          <div className="lg:col-span-7">
            <h2 className="text-3xl sm:text-4xl md:text-[44px] font-[850] tracking-tight leading-[1.15]">
              <span className="text-[#111111] dark:text-white">Built with restaurants,</span>
              <br />
              <span className="text-[#FF4F18]">from day one.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 text-zinc-650 dark:text-zinc-400 space-y-4 text-sm md:text-base leading-relaxed lg:pt-2">
            <p>
              How we went from spent nights in busy restaurant kitchens to simplifying operations across the globe.
            </p>
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-stretch border border-zinc-200/60 dark:border-[#2a2a2e]/60 rounded-[32px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.01)] bg-white dark:bg-zinc-950/20">
          
          {milestones.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col h-full items-start text-left relative p-8 transition-all duration-300 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 border-zinc-200/60 dark:border-[#2a2a2e]/60
                ${idx !== milestones.length - 1 ? "border-b" : ""}
                ${idx >= 2 ? "md:border-b-0" : ""}
                lg:border-b-0
                ${idx % 2 === 0 ? "md:border-r" : "md:border-r-0"}
                ${idx !== 3 ? "lg:border-r" : "lg:border-r-0"}
              `}
            >
              {/* Year & Circle Node */}
              <div className="flex items-center gap-4 mb-6 shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-850 text-[#FF4F18]">
                  {item.icon}
                </div>
                <span className="text-[15px] font-extrabold tracking-widest text-[#FF4F18] uppercase">
                  {item.year}
                </span>
              </div>

              {/* Text Info */}
              <div className="space-y-2 flex-1">
                <h3 className="text-[17px] font-bold text-zinc-900 dark:text-white leading-snug">
                  {item.title}
                </h3>
                <p className="text-[13px] sm:text-[14px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
