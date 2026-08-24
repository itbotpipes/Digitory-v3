"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import FooterPage from "../../components/Footer";
import { industriesDb, IndustryData } from "../data/industriesDb";
import { api } from "@/lib/api";

export default function IndustriesPage() {
  const router = useRouter();
  const [industries, setIndustries] = useState<IndustryData[]>(Object.values(industriesDb));

  // POS Simulator State
  const [businessType, setBusinessType] = useState<"restaurant" | "cloud-kitchen" | "cafes" | "cafe-chains">("restaurant");
  const [calcOrders, setCalcOrders] = useState<number>(3500);
  const [calcOutlets, setCalcOutlets] = useState<number>(2);
  const [activeTableIdx, setActiveTableIdx] = useState(1);
  const [cart, setCart] = useState<{ name: string; price: number; quantity: number }[]>([
    { name: "Paneer Butter Masala", price: 280, quantity: 1 },
    { name: "Butter Naan", price: 70, quantity: 2 }
  ]);
  const [successMsg, setSuccessMsg] = useState(false);

  // Define data presets for each business type
  const posData = {
    restaurant: {
      terminalName: "POS TERMINAL #01 • MAIN FLOOR",
      tablesLabel: "SELECT ACTIVE TABLE:",
      tables: [
        { label: "Table 01", sub: "Ready" },
        { label: "Table 04", sub: "Busy (3 items)" },
        { label: "Table 09", sub: "Billing" }
      ],
      shortcuts: [
        { name: "Paneer Masala", price: 280 },
        { name: "Butter Naan", price: 70 },
        { name: "Chicken Biryani", price: 320 },
        { name: "Mango Lassi", price: 110 }
      ],
      kdsStation: "KDS Station #2 (Tandoor)"
    },
    "cloud-kitchen": {
      terminalName: "DELIVERY DECK #03 • KITCHEN AREA",
      tablesLabel: "SELECT ACTIVE CHANNEL:",
      tables: [
        { label: "Swiggy #882", sub: "Preparing" },
        { label: "Zomato #451", sub: "Dispatch" },
        { label: "Web Direct", sub: "New Order" }
      ],
      shortcuts: [
        { name: "Hakka Noodles", price: 240 },
        { name: "Chilli Chicken", price: 290 },
        { name: "Veg Spring Roll", price: 180 },
        { name: "Diet Coke", price: 60 }
      ],
      kdsStation: "KDS Station #4 (Wok & Fryer)"
    },
    cafes: {
      terminalName: "BARISTA STATION #01 • COUNTER",
      tablesLabel: "SELECT ACTIVE ORDER:",
      tables: [
        { label: "Takeaway 01", sub: "Ready" },
        { label: "Dine-in T3", sub: "Brewing" },
        { label: "Takeaway 05", sub: "Billing" }
      ],
      shortcuts: [
        { name: "Cappuccino", price: 190 },
        { name: "Cold Brew", price: 220 },
        { name: "Butter Croissant", price: 150 },
        { name: "Blueberry Muffin", price: 170 }
      ],
      kdsStation: "Espresso Bar #1"
    },
    "cafe-chains": {
      terminalName: "CENTRAL ROASTERY #02 • BULK DECK",
      tablesLabel: "SELECT OUTLET TRANSFER:",
      tables: [
        { label: "Indiranagar", sub: "Processing" },
        { label: "Koramangala", sub: "Dispensing" },
        { label: "Jayanagar", sub: "Ready" }
      ],
      shortcuts: [
        { name: "Espresso Beans 1kg", price: 1200 },
        { name: "Oat Milk Carton", price: 350 },
        { name: "Paper Cups x100", price: 450 },
        { name: "Roastery Blend", price: 950 }
      ],
      kdsStation: "Dispatch Bay #3 (Cargo)"
    }
  };

  // Sync default cart when businessType changes
  useEffect(() => {
    setSuccessMsg(false);
    if (businessType === "restaurant") {
      setCart([
        { name: "Paneer Butter Masala", price: 280, quantity: 1 },
        { name: "Butter Naan", price: 70, quantity: 2 }
      ]);
    } else if (businessType === "cloud-kitchen") {
      setCart([
        { name: "Chilli Chicken", price: 290, quantity: 1 },
        { name: "Hakka Noodles", price: 240, quantity: 1 }
      ]);
    } else if (businessType === "cafes") {
      setCart([
        { name: "Cappuccino", price: 190, quantity: 2 },
        { name: "Butter Croissant", price: 150, quantity: 1 }
      ]);
    } else if (businessType === "cafe-chains") {
      setCart([
        { name: "Espresso Beans 1kg", price: 1200, quantity: 5 },
        { name: "Oat Milk Carton", price: 350, quantity: 2 }
      ]);
    }
  }, [businessType]);

  const handleAddShortcut = (item: { name: string; price: number }) => {
    setSuccessMsg(false);
    setCart((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) {
        return prev.map((i) => (i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (name: string, amt: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.name === name ? { ...i, quantity: i.quantity + amt } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const totalCartValue = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    async function loadIndustries() {
      try {
        const res = await api.get('/industries?limit=20');
        const loaded: any[] = res.data?.docs || res.data?.results || res.data || [];
        if (loaded && loaded.length > 0) {
          const normalized: IndustryData[] = loaded.map((s: any) => ({
            id: s.slug || s._id,
            slug: s.slug || '',
            shortLabel: s.shortLabel || s.title || '',
            icon: null,
            title: s.title || '',
            subtitle: s.subtitle || '',
            description: s.description || '',
            trustText: s.trustText || 'Trusted by restaurants across India.',
            featuresTitle: s.featuresTitle || 'Key capabilities',
            features: s.features || [],
            whyChooseTitle: s.whyChooseTitle || 'Why choose Digitory?',
            whyChoose: s.whyChoose || [],
            ctaBlock: s.ctaBlock || { title: 'Ready to grow?', desc: 'Talk to us today.' },
          }));

          const merged = normalized.map(item => {
            const staticEntry = industriesDb[item.id];
            return staticEntry ? { ...item, icon: staticEntry.icon } : item;
          });

          setIndustries(merged);
        }
      } catch (err) {
        console.warn('Failed to load industries from backend:', err);
      }
    }
    loadIndustries();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0d0e] transition-colors duration-300 flex flex-col font-sans">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-6 md:px-8 pt-4 pb-10 md:pt-8 md:pb-16 lg:pt-10 lg:pb-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-center">
            
            {/* Left Copy Column */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6 md:space-y-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
                Built for <span className="text-[#FF4F18]">every food & beverage business.</span>
              </h1>
              
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-xl leading-relaxed">
                From busy bars and craft breweries to fast QSR chains and mobile food trucks, Digitory provides the tools you need to streamline operations and grow with confidence.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 items-center">
                <Link
                  href="/request-demo"
                  className="inline-flex justify-center items-center text-center rounded-full bg-[#FF4F18] px-6 py-3 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-[#E03F0D] shadow-[0_8px_20px_rgba(255,79,24,0.35)] hover:shadow-[0_10px_24px_rgba(255,79,24,0.45)] active:scale-[0.98] cursor-pointer"
                >
                  Book a demo
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex -space-x-3">
                  {[
                    { text: 'R', bg: 'bg-[#ECECEC]', textCol: 'text-zinc-600' },
                    { text: 'C', bg: 'bg-[#D2E9E9]', textCol: 'text-teal-600' },
                    { text: 'B', bg: 'bg-[#FFE5D9]', textCol: 'text-orange-600' },
                    { text: 'K', bg: 'bg-[#E8EAFF]', textCol: 'text-indigo-600' },
                  ].map((circle, idx) => (
                    <div
                      key={idx}
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${circle.bg} ${circle.textCol} font-extrabold text-xs border-2 border-white dark:border-zinc-950`}
                    >
                      {circle.text}
                    </div>
                  ))}
                </div>
                <p className="text-xs md:text-sm text-zinc-500 max-w-xs leading-normal">
                  Trusted by restaurants, cafés, bars, breweries and cloud kitchens across India.
                </p>
              </div>
            </div>

            {/* Right Column - Hero Image (Commented Out) */}
            {/* 
            <div className="lg:col-span-6 flex justify-center lg:justify-end w-full relative perspective-[1000px]">
              <div className="relative w-full max-w-[400px] aspect-[4/5] rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(255,79,24,0.15)] z-10 transition-transform duration-500 hover:-translate-y-1">
                <img
                  src="/home-hero.png"
                  alt="Digitory Restaurant OS"
                  className="w-full h-full object-cover transition-transform duration-500"
                />
                <div className="absolute inset-0 border border-black/5 dark:border-white/10 rounded-[24px] pointer-events-none" />
              </div>
            </div>
                    {/* Right Column - Interactive ROI Savings Calculator Card */}
            <div className="lg:col-span-6 flex flex-col justify-center w-full max-w-[500px] mx-auto lg:ml-auto lg:mr-0 select-none">
              <div className="bg-white dark:bg-[#121319] border border-zinc-200 dark:border-zinc-800/80 rounded-[28px] p-6 space-y-6 relative text-left">
                {/* Dropdown Business Type Selector */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-150 dark:border-zinc-800/80">
                  <div className="text-[11px] font-extrabold text-[#FF4F18] uppercase tracking-wider">
                    Select POS Mode:
                  </div>
                  <select 
                    value={businessType} 
                    onChange={(e) => setBusinessType(e.target.value as any)} 
                    className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/85 rounded-xl px-3 py-1.5 text-xs font-extrabold text-zinc-800 dark:text-zinc-150 focus:outline-none focus:border-[#FF4F18] transition-all cursor-pointer shadow-sm"
                  >
                    <option value="restaurant">🍴 Restaurant POS</option>
                    <option value="cloud-kitchen">🍳 Cloud Kitchen POS</option>
                    <option value="cafes">☕ Cafe POS</option>
                    <option value="cafe-chains">🏢 Cafe Chain POS</option>
                  </select>
                </div>

                {/* Sliders Container */}
                <div className="space-y-6 pt-2">
                  {/* Slider 1: Monthly Orders */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Monthly Orders:
                      </span>
                      <span className="font-black text-[#FF4F18] text-sm">
                        {calcOrders.toLocaleString()} / mo
                      </span>
                    </div>
                    <input
                      type="range"
                      min={500}
                      max={15000}
                      step={100}
                      value={calcOrders}
                      onChange={(e) => setCalcOrders(Number(e.target.value))}
                      className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FF4F18]"
                    />
                  </div>

                  {/* Slider 2: Number of Outlets */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Number of Outlets:
                      </span>
                      <span className="font-black text-[#FF4F18] text-sm">
                        {calcOutlets} {calcOutlets === 1 ? "Outlet" : "Outlets"}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={15}
                      step={1}
                      value={calcOutlets}
                      onChange={(e) => setCalcOutlets(Number(e.target.value))}
                      className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FF4F18]"
                    />
                  </div>
                </div>

                {/* Results Display */}
                {(() => {
                  let monthlySavings = 0;
                  let hoursSaved = 0;

                  if (businessType === "restaurant") {
                    monthlySavings = (calcOrders * 15.5) + (calcOutlets * 12550);
                    hoursSaved = Math.round((calcOrders * 0.008) + (calcOutlets * 4));
                  } else if (businessType === "cloud-kitchen") {
                    monthlySavings = (calcOrders * 11.2) + (calcOutlets * 9500);
                    hoursSaved = Math.round((calcOrders * 0.006) + (calcOutlets * 3.5));
                  } else if (businessType === "cafes") {
                    monthlySavings = (calcOrders * 8.5) + (calcOutlets * 7500);
                    hoursSaved = Math.round((calcOrders * 0.005) + (calcOutlets * 3));
                  } else if (businessType === "cafe-chains") {
                    monthlySavings = (calcOrders * 18.2) + (calcOutlets * 14500);
                    hoursSaved = Math.round((calcOrders * 0.01) + (calcOutlets * 5));
                  }

                  let savedMessage = "";
                  if (businessType === "restaurant") {
                    savedMessage = `Congratulations! You saved ₹${Math.round(monthlySavings).toLocaleString()} / month on billing, labor, and table operations using Digitory.`;
                  } else if (businessType === "cloud-kitchen") {
                    savedMessage = `Congratulations! You saved ₹${Math.round(monthlySavings).toLocaleString()} / month by streamlining aggregators and automated inventory using Digitory.`;
                  } else if (businessType === "cafes") {
                    savedMessage = `Congratulations! You saved ₹${Math.round(monthlySavings).toLocaleString()} / month on recipe costing and brew bar wastage using Digitory.`;
                  } else if (businessType === "cafe-chains") {
                    savedMessage = `Congratulations! You saved ₹${Math.round(monthlySavings).toLocaleString()} / month on supply-chain forecasting and central kitchen distribution using Digitory.`;
                  }

                  return (
                    <>
                      <div className="bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl p-5 border border-zinc-150 dark:border-zinc-800/60 flex flex-col items-center justify-center text-center select-none min-h-[160px] animate-[fadeIn_0.3s_ease]">
                        {successMsg ? (
                          <div className="space-y-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 mx-auto">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <p className="text-sm font-extrabold text-emerald-800 dark:text-emerald-400">Calculation Successful!</p>
                            <p className="text-xs text-zinc-650 dark:text-zinc-350 leading-relaxed font-bold">
                              {savedMessage}
                            </p>
                          </div>
                        ) : (
                          <>
                            <span className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2 block">
                              Estimated Monthly Savings
                            </span>
                            <span className="text-2xl md:text-3xl font-black text-[#FF4F18] leading-none mb-2">
                              ₹ {Math.round(monthlySavings).toLocaleString()} / month
                            </span>
                            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                              {hoursSaved} Hours / month saved
                            </span>
                          </>
                        )}
                      </div>

                      {successMsg ? (
                        <button
                          onClick={() => router.push("/request-demo")}
                          className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-xs font-extrabold text-white transition-all hover:bg-emerald-750 shadow-[0_4px_12px_rgba(16,185,129,0.2)] active:scale-[0.98] cursor-pointer"
                        >
                          Book a Live Demo
                        </button>
                      ) : (
                        <button
                          onClick={() => setSuccessMsg(true)}
                          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FF4F18] py-3.5 text-xs font-extrabold text-white transition-all hover:bg-[#E03F0D] shadow-[0_4px_12px_rgba(255,79,24,0.25)] active:scale-[0.98] cursor-pointer"
                        >
                          Click here to save
                        </button>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>

          </div>
        </section>

        {/* Industries Grid */}
        <section className="mx-auto max-w-7xl px-6 md:px-8 pt-12 md:pt-16 lg:pt-20 pb-24">
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-[28px] overflow-hidden bg-white dark:bg-zinc-950/20 grid grid-cols-1 md:grid-cols-3 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
            {industries.map((item, idx) => {
              const isLastInRow = (idx % 3) === 2;
              const isLastRow = idx >= 6;
              const isVeryLast = idx === 8;

              return (
                <Link
                  key={item.id}
                  href={`/industries/details?module=${item.id}`}
                  className={`p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 cursor-pointer text-left group
                    border-zinc-200 dark:border-zinc-800
                    ${!isVeryLast ? "border-b" : ""}
                    ${isLastRow ? "md:border-b-0" : ""}
                    ${!isLastInRow ? "md:border-r" : ""}
                  `}
                >
                  <div className="space-y-6">
                    {/* Header: Number and raw Icon */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-zinc-400 dark:text-zinc-600">0{idx + 1}</span>
                      <div className="text-[#FF4F18] shrink-0">
                        {item.icon}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-xl font-bold text-zinc-950 dark:text-white mb-2 transition-colors duration-250">
                        {item.title}
                      </h3>
                      <p className="text-zinc-550 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed line-clamp-3">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Read More Link */}
                  <div className="pt-6 flex items-center text-xs font-bold text-[#FF4F18]">
                    <span>View Details</span>
                    <svg className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      <FooterPage />
    </div>
  );
}
