'use client';

import React from 'react';
import {
  Sparkles,
  TrendingUp,
  Tag,
  Bell,
  Lightbulb,
  CreditCard,
  QrCode,
  ClipboardList,
  Tv,
  Boxes,
  Archive,
  ChefHat,
  ShoppingCart,
  BarChart3,
  Users,
  ChevronDown
} from 'lucide-react';

export default function DigitoryAiLayerCard() {
  return (
    <div className="w-full max-w-[620px] bg-white dark:bg-[#121319] border border-zinc-200/90 dark:border-zinc-800 rounded-[24px] p-4 sm:p-5 shadow-sm transition-colors text-left font-sans">
      
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
        {/* Title */}
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-500 fill-indigo-500/20" />
          <h3 className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Digitory AI layer
          </h3>
        </div>

        {/* AI Badges */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EBF5FF] dark:bg-blue-950/60 text-[#2B7FFF] dark:text-blue-400 text-[10px] font-bold">
            <TrendingUp className="w-3 h-3" />
            Forecasting
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EBF5FF] dark:bg-blue-950/60 text-[#2B7FFF] dark:text-blue-400 text-[10px] font-bold">
            <Tag className="w-3 h-3" />
            Pricing
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EBF5FF] dark:bg-blue-950/60 text-[#2B7FFF] dark:text-blue-400 text-[10px] font-bold">
            <Bell className="w-3 h-3" />
            Alerts
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EBF5FF] dark:bg-blue-950/60 text-[#2B7FFF] dark:text-blue-400 text-[10px] font-bold">
            <Lightbulb className="w-3 h-3" />
            Recommendations
          </span>
        </div>
      </div>

      {/* Main Content Groups */}
      <div className="space-y-3 pt-3">

        {/* Group 1: Run operations */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FDF0EB] text-[#B84A28] text-[11px] font-bold shrink-0">
              Run operations
            </span>
            <div className="h-[1px] bg-zinc-150 dark:bg-zinc-800 flex-1" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
            {/* POS & Billing */}
            <div className="flex items-center gap-2 p-1.5 sm:p-2 rounded-xl bg-[#F9FAFB] dark:bg-zinc-850 border border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-100/60 dark:hover:bg-zinc-800 transition-all cursor-pointer">
              <div className="w-7 h-7 rounded-lg bg-[#FDF0EB] flex items-center justify-center text-[#B84A28] shrink-0">
                <CreditCard className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                POS and billing
              </span>
            </div>

            {/* QR Ordering */}
            <div className="flex items-center gap-2 p-1.5 sm:p-2 rounded-xl bg-[#F9FAFB] dark:bg-zinc-850 border border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-100/60 dark:hover:bg-zinc-800 transition-all cursor-pointer">
              <div className="w-7 h-7 rounded-lg bg-[#FDF0EB] flex items-center justify-center text-[#B84A28] shrink-0">
                <QrCode className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                QR ordering
              </span>
            </div>

            {/* Order Management */}
            <div className="flex items-center gap-2 p-1.5 sm:p-2 rounded-xl bg-[#F9FAFB] dark:bg-zinc-850 border border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-100/60 dark:hover:bg-zinc-800 transition-all cursor-pointer">
              <div className="w-7 h-7 rounded-lg bg-[#FDF0EB] flex items-center justify-center text-[#B84A28] shrink-0">
                <ClipboardList className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                Order management
              </span>
            </div>

            {/* Kitchen Display */}
            <div className="flex items-center gap-2 p-1.5 sm:p-2 rounded-xl bg-[#F9FAFB] dark:bg-zinc-850 border border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-100/60 dark:hover:bg-zinc-800 transition-all cursor-pointer">
              <div className="w-7 h-7 rounded-lg bg-[#FDF0EB] flex items-center justify-center text-[#B84A28] shrink-0">
                <Tv className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                Kitchen display
              </span>
            </div>
          </div>
        </div>

        {/* Group 2: Manage inventory */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#EAF7EC] text-[#2E7D32] text-[11px] font-bold shrink-0">
              Manage inventory
            </span>
            <div className="h-[1px] bg-zinc-150 dark:bg-zinc-800 flex-1" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
            {/* Stock counting */}
            <div className="flex items-center gap-2 p-1.5 sm:p-2 rounded-xl bg-[#F9FAFB] dark:bg-zinc-850 border border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-100/60 dark:hover:bg-zinc-800 transition-all cursor-pointer">
              <div className="w-7 h-7 rounded-lg bg-[#EAF7EC] flex items-center justify-center text-[#2E7D32] shrink-0">
                <Boxes className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                Stock counting
              </span>
            </div>

            {/* Inventory management */}
            <div className="flex items-center gap-2 p-1.5 sm:p-2 rounded-xl bg-[#F9FAFB] dark:bg-zinc-850 border border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-100/60 dark:hover:bg-zinc-800 transition-all cursor-pointer">
              <div className="w-7 h-7 rounded-lg bg-[#EAF7EC] flex items-center justify-center text-[#2E7D32] shrink-0">
                <Archive className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                Inventory management
              </span>
            </div>

            {/* Recipe management */}
            <div className="flex items-center gap-2 p-1.5 sm:p-2 rounded-xl bg-[#F9FAFB] dark:bg-zinc-850 border border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-100/60 dark:hover:bg-zinc-800 transition-all cursor-pointer">
              <div className="w-7 h-7 rounded-lg bg-[#EAF7EC] flex items-center justify-center text-[#2E7D32] shrink-0">
                <ChefHat className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                Recipe management
              </span>
            </div>

            {/* Procurement portal */}
            <div className="flex items-center gap-2 p-1.5 sm:p-2 rounded-xl bg-[#F9FAFB] dark:bg-zinc-850 border border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-100/60 dark:hover:bg-zinc-800 transition-all cursor-pointer">
              <div className="w-7 h-7 rounded-lg bg-[#EAF7EC] flex items-center justify-center text-[#2E7D32] shrink-0">
                <ShoppingCart className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                Procurement portal
              </span>
            </div>

            {/* Menu engineering */}
            <div className="flex items-center gap-2 p-1.5 sm:p-2 rounded-xl bg-[#F9FAFB] dark:bg-zinc-850 border border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-100/60 dark:hover:bg-zinc-800 transition-all cursor-pointer col-span-1">
              <div className="w-7 h-7 rounded-lg bg-[#EAF7EC] flex items-center justify-center text-[#2E7D32] shrink-0">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                Menu engineering
              </span>
            </div>
          </div>
        </div>

        {/* Group 3: Grow and understand */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#E6F7F5] text-[#00796B] text-[11px] font-bold shrink-0">
              Grow and understand
            </span>
            <div className="h-[1px] bg-zinc-150 dark:bg-zinc-800 flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            {/* Business analytics */}
            <div className="flex items-center gap-2 p-1.5 sm:p-2 rounded-xl bg-[#F9FAFB] dark:bg-zinc-850 border border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-100/60 dark:hover:bg-zinc-800 transition-all cursor-pointer">
              <div className="w-7 h-7 rounded-lg bg-[#E6F7F5] flex items-center justify-center text-[#00796B] shrink-0">
                <BarChart3 className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                Business analytics
              </span>
            </div>

            {/* Loyalty and CRM */}
            <div className="flex items-center gap-2 p-1.5 sm:p-2 rounded-xl bg-[#F9FAFB] dark:bg-zinc-850 border border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-100/60 dark:hover:bg-zinc-800 transition-all cursor-pointer">
              <div className="w-7 h-7 rounded-lg bg-[#E6F7F5] flex items-center justify-center text-[#00796B] shrink-0">
                <Users className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                Loyalty and CRM
              </span>
            </div>
          </div>
        </div>

        {/* Group 4: Scale and specialize */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FBEAEB] text-[#880E4F] text-[11px] font-bold shrink-0">
              Scale and specialize
            </span>
            <div className="h-[1px] bg-zinc-150 dark:bg-zinc-800 flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            {/* Clubs and events */}
            <div className="flex items-center gap-2 p-1.5 sm:p-2 rounded-xl bg-[#F9FAFB] dark:bg-zinc-850 border border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-100/60 dark:hover:bg-zinc-800 transition-all cursor-pointer">
              <div className="w-7 h-7 rounded-lg bg-[#FBEAEB] flex items-center justify-center text-[#880E4F] shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                Clubs and events
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Line */}
      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-center relative">
        <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 tracking-tight">
          12 integrated modules • 1 connected platform
        </span>

        {/* Down Arrow Floating Icon */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-xs flex items-center justify-center text-zinc-500 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
          <ChevronDown className="w-3.5 h-3.5" />
        </div>
      </div>

    </div>
  );
}
