"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RoiCalculator() {
  const router = useRouter();
  const [orders, setOrders] = useState<number>(3500);
  const [outlets, setOutlets] = useState<number>(2);

  // Bottom stats state (animated or calculated)
  const [turnover, setTurnover] = useState<number>(0);
  const [wastage, setWastage] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [savedHrs, setSavedHrs] = useState<number>(0);

  // Exact math from reference design:
  // (3500 * 15.5) + (2 * 12500) = 79,250
  const monthlySavings = (orders * 15.5) + (outlets * 12550);
  // (3500 * 0.008) + (2 * 4) = 36
  const hoursSaved = Math.round((orders * 0.008) + (outlets * 4));

  // Animate outcomes once on page load
  useEffect(() => {
    // Standard static target values
    const targetTurnover = 22;
    const targetWastage = 32;
    const targetAccuracy = 98;
    const targetSavedHrs = 15;

    // Simple smooth stepping simulation for counter animation
    let currentTurnover = 0;
    let currentWastage = 0;
    let currentAccuracy = 0;
    let currentSavedHrs = 0;

    const timer = setInterval(() => {
      let updated = false;
      if (currentTurnover < targetTurnover) {
        currentTurnover += 1;
        setTurnover(currentTurnover);
        updated = true;
      }
      if (currentWastage < targetWastage) {
        currentWastage += 1;
        setWastage(currentWastage);
        updated = true;
      }
      if (currentAccuracy < targetAccuracy) {
        currentAccuracy += 2;
        setAccuracy(Math.min(currentAccuracy, targetAccuracy));
        updated = true;
      }
      if (currentSavedHrs < targetSavedHrs) {
        currentSavedHrs += 1;
        setSavedHrs(currentSavedHrs);
        updated = true;
      }

      if (!updated) {
        clearInterval(timer);
      }
    }, 20);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-6 md:px-8 py-6 md:py-10">

      {/* Header Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 mb-12 md:mb-16 items-start">
        <div className="lg:col-span-7">
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-[850] tracking-tight text-[#111111] dark:text-white leading-[1.15]">
            See how much  <span className="text-[#FF4F18]">you can save</span>
          </h2>
        </div>
        <div className="lg:col-span-5 text-sm md:text-base text-zinc-650 dark:text-zinc-400 leading-relaxed lg:pt-2">
          <p>
            Use our interactive calculator to see exactly how much Digitory can help you save by reducing food waste, optimizing staff hours, and increasing your daily margins.
          </p>
        </div>
      </div>

      {/* Main Calculator Panel */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900/50 rounded-[32px] p-6 md:p-10 border border-zinc-200 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-left">

        {/* Left Side: Sliders (7 Cols) */}
        <div className="md:col-span-7 space-y-8 pr-0 md:pr-4">
          {/* Slider 1: Monthly Orders */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-extrabold text-zinc-850 dark:text-zinc-200">
                Monthly Orders:
              </span>
              <span className="text-sm font-black text-[#FF4F18]">
                {orders.toLocaleString()} / mo
              </span>
            </div>
            <input
              type="range"
              min={500}
              max={15000}
              step={100}
              value={orders}
              onChange={(e) => setOrders(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-[#FF4F18]"
            />
          </div>

          {/* Slider 2: Number of Outlets */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-extrabold text-zinc-850 dark:text-zinc-200">
                Number of Outlets:
              </span>
              <span className="text-sm font-black text-[#FF4F18]">
                {outlets} {outlets === 1 ? "Outlet" : "Outlets"}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={15}
              step={1}
              value={outlets}
              onChange={(e) => setOutlets(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-[#FF4F18]"
            />
          </div>
        </div>

        {/* Right Side: Results Display Card (5 Cols) */}
        <div className="md:col-span-5">
          <div className="bg-white dark:bg-zinc-900/50 rounded-2xl p-6 border border-zinc-200/50 dark:border-zinc-800/60 flex flex-col items-center justify-center text-center select-none min-h-[160px]">
            <span className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3 block">
              Estimated Monthly Savings
            </span>
            <span className="text-3xl md:text-4xl font-black text-[#10B981] leading-none mb-3">
              ₹ {Math.round(monthlySavings).toLocaleString()} / month
            </span>
            <span className="text-sm font-bold text-zinc-700 dark:text-zinc-350">
              {hoursSaved} Hours / month saved
            </span>
          </div>
        </div>

      </div>

      {/* Booking CTA Button Centered Below Card */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => router.push("/request-demo")}
          className="inline-flex justify-center items-center text-center rounded-full bg-[#FF4F18] px-8 py-3.5 text-[15px] font-bold text-white transition-all duration-200 hover:bg-[#E03F0D] active:scale-[0.98] cursor-pointer"
        >
          Click here to save
        </button>
      </div>

    </section>
  );
}
