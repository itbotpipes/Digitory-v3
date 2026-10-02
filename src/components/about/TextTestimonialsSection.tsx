'use client';

import React, { useState } from 'react';

interface TextTestimonial {
  quote: string;
  stat: string;
  initials: string;
  author: string;
  role: string;
}

export default function TextTestimonialsSection() {
  const testimonials: TextTestimonial[] = [
    {
      quote:
        "Before Digitory, our busiest hours were stressful. Now every team gets live updates, and everything runs much more smoothly.",
      stat: "↑ 22% faster service",
      initials: "RK",
      author: "Rajesh Kumar",
      role: "Owner, BygBrewski Bangalore",
    },
    {
      quote:
        "We spend less time managing operations and more time serving customers. Digitory helps us run every outlet with confidence.",
      stat: "3 Hours Saved Every Day",
      initials: "PM",
      author: "Priya Mehta",
      role: "Ops Head, Toit Brewpub",
    },
    {
      quote:
        "We reduced food waste and improved inventory tracking. Within the first three months, we recovered nearly ₹2 lakh every month.",
      stat: "₹2 Lakh Saved Every Month",
      initials: "AS",
      author: "Amit Shah",
      role: "F&B Director, Bier Library",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    } else if (isRightSwipe) {
      setActiveIndex(
        (prev) => (prev - 1 + testimonials.length) % testimonials.length
      );
    }
  };

  const renderCard = (item: TextTestimonial) => (
    <div className="flex flex-col h-full rounded-[28px] sm:rounded-[32px] p-7 sm:p-8 md:p-9 justify-between gap-6 transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-[#121319] border border-zinc-200/70 dark:border-zinc-800/80 shadow-[0_4px_20px_rgb(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.2)] hover:border-[#FF4F18]/40 hover:shadow-lg group">
      <div className="space-y-4 flex-grow">
        {/* Slanted Quotes */}
        <div className="flex gap-1.5">
          <span className="w-1.5 h-4.5 bg-[#FF4F18] rounded-full" />
          <span className="w-1.5 h-4.5 bg-[#FF4F18] rounded-full" />
        </div>

        <p className="text-[15px] sm:text-[16px] leading-relaxed font-medium text-zinc-700 dark:text-zinc-300">
          "{item.quote}"
        </p>
      </div>

      <div className="space-y-4 pt-2">
        {/* Stat Pill */}
        <div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#10B981]/10 dark:bg-[#10B981]/15 border border-[#10B981]/20 text-[#10B981] text-xs sm:text-[13px] font-extrabold">
            {item.stat}
          </span>
        </div>

        {/* Author Bio */}
        <div className="flex items-center pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="w-10 h-10 rounded-full bg-[#FF4F18] flex items-center justify-center text-white text-xs sm:text-sm font-bold shrink-0 shadow-md">
            {item.initials}
          </div>
          <div className="ml-3 min-w-0">
            <h4 className="font-extrabold text-[14px] sm:text-[15px] text-zinc-900 dark:text-white truncate">
              {item.author}
            </h4>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-[13px] font-medium truncate">
              {item.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="bg-white dark:bg-[#0d0d0e] py-10 md:py-16 transition-colors duration-300 font-sans antialiased">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Header Section */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-[850] tracking-tight leading-[1.15] text-[#111111] dark:text-white">
            What our <span className="text-[#FF4F18]">customers say</span>
          </h2>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {testimonials.map((item, idx) => (
            <div key={idx} className="h-full">
              {renderCard(item)}
            </div>
          ))}
        </div>

        {/* Mobile Slider Layout */}
        <div className="block md:hidden">
          <div
            className="relative w-full overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((item, idx) => (
                <div key={idx} className="w-full shrink-0 px-1">
                  {renderCard(item)}
                </div>
              ))}
            </div>
          </div>

          {/* Slider Controls: Prev, Dots, Next */}
          <div className="flex justify-center items-center gap-4 mt-8 select-none">
            <button
              onClick={() =>
                setActiveIndex(
                  (prev) => (prev - 1 + testimonials.length) % testimonials.length
                )
              }
              className="flex items-center justify-center w-9 h-9 rounded-full border border-zinc-200 dark:border-zinc-800 text-[#111111] dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer"
              aria-label="Previous testimonial"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIndex === idx ? "w-6 bg-[#FF4F18]" : "w-2 bg-zinc-300 dark:bg-zinc-700"
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() =>
                setActiveIndex((prev) => (prev + 1) % testimonials.length)
              }
              className="flex items-center justify-center w-9 h-9 rounded-full border border-zinc-200 dark:border-zinc-800 text-[#111111] dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer"
              aria-label="Next testimonial"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
