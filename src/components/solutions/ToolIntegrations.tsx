"use client";

import React from "react";
import Image from "next/image";
import { 
  ShoppingBag, 
  UtensilsCrossed, 
  Gift, 
  Star, 
  CalendarCheck, 
  CreditCard, 
  Utensils, 
  Megaphone 
} from "lucide-react";

interface IntegrationItem {
  id: string;
  name: string;
  subtext: string;
  icon: React.ReactNode;
}

export default function ToolIntegrations() {
  const leftIntegrations: IntegrationItem[] = [
    {
      id: "swiggy",
      name: "Swiggy",
      subtext: "2-way menu & order sync.",
      icon: <ShoppingBag className="w-4.5 h-4.5 stroke-[2.2]" />,
    },
    {
      id: "reelo",
      name: "Reelo",
      subtext: "Automated customer loyalty.",
      icon: <Gift className="w-4.5 h-4.5 stroke-[2.2]" />,
    },
    {
      id: "reserve-go",
      name: "Reserve Go",
      subtext: "Smart table reservations.",
      icon: <CalendarCheck className="w-4.5 h-4.5 stroke-[2.2]" />,
    },
    {
      id: "eat-app",
      name: "Eat App",
      subtext: "Guest & table management.",
      icon: <Utensils className="w-4.5 h-4.5 stroke-[2.2]" />,
    },
  ];

  const rightIntegrations: IntegrationItem[] = [
    {
      id: "zomato",
      name: "Zomato",
      subtext: "Auto-accept & instant toggles.",
      icon: <UtensilsCrossed className="w-4.5 h-4.5 stroke-[2.2]" />,
    },
    {
      id: "rannkly",
      name: "Rannkly",
      subtext: "Review & reputation sync.",
      icon: <Star className="w-4.5 h-4.5 stroke-[2.2]" />,
    },
    {
      id: "payments",
      name: "Payments",
      subtext: "UPI, Cards & QR reconciliation.",
      icon: <CreditCard className="w-4.5 h-4.5 stroke-[2.2]" />,
    },
    {
      id: "fame-pilot",
      name: "Fame Pilot",
      subtext: "Brand feedback & customer growth.",
      icon: <Megaphone className="w-4.5 h-4.5 stroke-[2.2]" />,
    },
  ];

  const allIntegrations = [...leftIntegrations, ...rightIntegrations];

  return (
    <section className="mx-auto max-w-7xl px-6 md:px-8 py-16 md:py-24 overflow-hidden">
      
      {/* Header Block: Left Heading, Right Subtitle */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start mb-16 md:mb-24">
        <div className="lg:col-span-7">
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-[850] tracking-tight leading-[1.15]">
            Connects with <span className="text-[#FF4F18]">your favorite apps.</span>
          </h2>
        </div>
        <div className="lg:col-span-5 text-zinc-650 dark:text-zinc-400 text-sm md:text-base leading-relaxed lg:pt-2">
          <p>
            1-click setup with Swiggy, Zomato, Reelo, Rannkly, Reserve Go, Payments, Eat App, and Fame Pilot.
          </p>
        </div>
      </div>

      {/* Professional Circuit-Board Architecture */}
      <div className="relative w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-12 md:gap-0">
        
        {/* Mobile View: Simple Grid (Hidden on Desktop) */}
        <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {allIntegrations.map((item) => (
            <div key={item.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center gap-4 shadow-sm w-full">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300">
                {item.icon}
              </div>
              <div className="text-left">
                <h4 className="text-[14px] font-bold text-zinc-900 dark:text-white mb-0.5">{item.name}</h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">{item.subtext}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Network Diagram */}
        <div className="hidden md:flex items-center justify-center w-full">
          
          {/* Left Column (4 items) */}
          <div className="relative flex flex-col gap-6 w-[220px]">
            {/* Vertical Circuit Line */}
            <div className="absolute -right-10 top-[2.2rem] bottom-[2.2rem] w-[2px] bg-gradient-to-b from-zinc-200/20 via-zinc-200 dark:via-zinc-700 to-zinc-200/20" />
            {/* Horizontal Connection to Center Node */}
            <div className="absolute -right-20 top-1/2 w-10 h-[2px] bg-gradient-to-r from-zinc-200 dark:from-zinc-700 to-[#FF4F18]/40" />
            
            {leftIntegrations.map((item) => (
              <div key={item.id} className="relative z-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[16px] p-3 flex items-center gap-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.015)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:border-[#FF4F18]/40 transition-colors duration-300">
                {/* Horizontal line to vertical track */}
                <div className="absolute -right-10 top-1/2 w-10 h-[2px] bg-zinc-200 dark:bg-zinc-700" />
                
                <div className="w-8.5 h-8.5 rounded-lg flex items-center justify-center shrink-0 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-750 dark:text-zinc-350 border border-zinc-200/40 dark:border-zinc-800/40">
                  {item.icon}
                </div>
                <div className="text-left min-w-0">
                  <h4 className="text-[13px] font-extrabold text-zinc-900 dark:text-white mb-0.5 tracking-tight truncate">{item.name}</h4>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium leading-tight truncate">{item.subtext}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Central Digitory Node */}
          <div className="mx-20 relative z-20 flex flex-col items-center justify-center">
            <div className="relative w-32 h-32 bg-white dark:bg-zinc-900 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-zinc-200 dark:border-zinc-800 flex items-center justify-center z-10 overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_12px_40px_rgb(0,0,0,0.3)] cursor-default">
              <div className="relative w-20 h-20 z-10">
                <Image
                  src="/demologo.png"
                  alt="Digitory Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Right Column (4 items) */}
          <div className="relative flex flex-col gap-6 w-[220px]">
            {/* Vertical Circuit Line */}
            <div className="absolute -left-10 top-[2.2rem] bottom-[2.2rem] w-[2px] bg-gradient-to-b from-zinc-200/20 via-zinc-200 dark:via-zinc-700 to-zinc-200/20" />
            {/* Horizontal Connection to Center Node */}
            <div className="absolute -left-20 top-1/2 w-10 h-[2px] bg-gradient-to-l from-zinc-200 dark:from-zinc-700 to-[#FF4F18]/40" />
            
            {rightIntegrations.map((item) => (
              <div key={item.id} className="relative z-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[16px] p-3 flex items-center gap-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.015)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.15)] hover:border-[#FF4F18]/40 transition-colors duration-300">
                {/* Horizontal line to vertical track */}
                <div className="absolute -left-10 top-1/2 w-10 h-[2px] bg-zinc-200 dark:bg-zinc-700" />
                
                <div className="w-8.5 h-8.5 rounded-lg flex items-center justify-center shrink-0 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-750 dark:text-zinc-355 border border-zinc-200/40 dark:border-zinc-800/40">
                  {item.icon}
                </div>
                <div className="text-left min-w-0">
                  <h4 className="text-[13px] font-extrabold text-zinc-900 dark:text-white mb-0.5 tracking-tight truncate">{item.name}</h4>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium leading-tight truncate">{item.subtext}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </section>
  );
}

