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
    <div className="w-full max-w-[530px] bg-white dark:bg-[#121319] border border-zinc-200/90 dark:border-zinc-800/80 rounded-[20px] p-3.5 sm:p-4 shadow-xs dark:shadow-zinc-950/40 transition-colors text-left font-sans">

      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2.5 border-b border-zinc-100 dark:border-zinc-800/60">
        {/* Title */}
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 fill-indigo-500/20 dark:fill-indigo-400/20" />
          <h3 className="text-xs sm:text-sm font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Digitory AI layer
          </h3>
        </div>

        {/* AI Badges */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#EBF5FF] dark:bg-blue-950/70 text-[#2B7FFF] dark:text-blue-400 border border-transparent dark:border-blue-800/40 text-[9.5px] font-bold">
            <TrendingUp className="w-2.5 h-2.5" />
            Forecasting
          </span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#EBF5FF] dark:bg-blue-950/70 text-[#2B7FFF] dark:text-blue-400 border border-transparent dark:border-blue-800/40 text-[9.5px] font-bold">
            <Tag className="w-2.5 h-2.5" />
            Pricing
          </span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#EBF5FF] dark:bg-blue-950/70 text-[#2B7FFF] dark:text-blue-400 border border-transparent dark:border-blue-800/40 text-[9.5px] font-bold">
            <Bell className="w-2.5 h-2.5" />
            Alerts
          </span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#EBF5FF] dark:bg-blue-950/70 text-[#2B7FFF] dark:text-blue-400 border border-transparent dark:border-blue-800/40 text-[9.5px] font-bold">
            <Lightbulb className="w-2.5 h-2.5" />
            Recommendations
          </span>
        </div>
      </div>

      {/* Main Content Groups */}
      <div className="space-y-2.5 pt-2.5">

        {/* Group 1: Run operations */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#FDF0EB] dark:bg-[#3D1E16]/90 text-[#B84A28] dark:text-[#FF8A65] text-[10px] font-bold shrink-0">
              Run operations
            </span>
            <div className="h-[1px] bg-zinc-150 dark:bg-zinc-800 flex-1" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {/* POS & Billing */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#F9FAFB] dark:bg-[#1A1B23] border border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/90 transition-all cursor-pointer">
              <div className="w-6 h-6 rounded-lg bg-[#FDF0EB] dark:bg-[#3D1E16] flex items-center justify-center text-[#B84A28] dark:text-[#FF8A65] shrink-0">
                <CreditCard className="w-3 h-3" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                POS and billing
              </span>
            </div>

            {/* QR Ordering */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#F9FAFB] dark:bg-[#1A1B23] border border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/90 transition-all cursor-pointer">
              <div className="w-6 h-6 rounded-lg bg-[#FDF0EB] dark:bg-[#3D1E16] flex items-center justify-center text-[#B84A28] dark:text-[#FF8A65] shrink-0">
                <QrCode className="w-3 h-3" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                QR ordering
              </span>
            </div>

            {/* Order Management */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#F9FAFB] dark:bg-[#1A1B23] border border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/90 transition-all cursor-pointer">
              <div className="w-6 h-6 rounded-lg bg-[#FDF0EB] dark:bg-[#3D1E16] flex items-center justify-center text-[#B84A28] dark:text-[#FF8A65] shrink-0">
                <ClipboardList className="w-3 h-3" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                Order management
              </span>
            </div>

            {/* Kitchen Display */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#F9FAFB] dark:bg-[#1A1B23] border border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/90 transition-all cursor-pointer">
              <div className="w-6 h-6 rounded-lg bg-[#FDF0EB] dark:bg-[#3D1E16] flex items-center justify-center text-[#B84A28] dark:text-[#FF8A65] shrink-0">
                <Tv className="w-3 h-3" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                Kitchen display
              </span>
            </div>
          </div>
        </div>

        {/* Group 2: Manage inventory */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#EAF7EC] dark:bg-[#1A3821]/90 text-[#2E7D32] dark:text-[#81C784] text-[10px] font-bold shrink-0">
              Manage inventory
            </span>
            <div className="h-[1px] bg-zinc-150 dark:bg-zinc-800 flex-1" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {/* Stock counting */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#F9FAFB] dark:bg-[#1A1B23] border border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/90 transition-all cursor-pointer">
              <div className="w-6 h-6 rounded-lg bg-[#EAF7EC] dark:bg-[#1A3821] flex items-center justify-center text-[#2E7D32] dark:text-[#81C784] shrink-0">
                <Boxes className="w-3 h-3" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                Stock counting
              </span>
            </div>

            {/* Inventory management */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#F9FAFB] dark:bg-[#1A1B23] border border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/90 transition-all cursor-pointer">
              <div className="w-6 h-6 rounded-lg bg-[#EAF7EC] dark:bg-[#1A3821] flex items-center justify-center text-[#2E7D32] dark:text-[#81C784] shrink-0">
                <Archive className="w-3 h-3" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                Inventory management
              </span>
            </div>

            {/* Recipe management */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#F9FAFB] dark:bg-[#1A1B23] border border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/90 transition-all cursor-pointer">
              <div className="w-6 h-6 rounded-lg bg-[#EAF7EC] dark:bg-[#1A3821] flex items-center justify-center text-[#2E7D32] dark:text-[#81C784] shrink-0">
                <ChefHat className="w-3 h-3" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                Recipe management
              </span>
            </div>

            {/* Procurement portal */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#F9FAFB] dark:bg-[#1A1B23] border border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/90 transition-all cursor-pointer">
              <div className="w-6 h-6 rounded-lg bg-[#EAF7EC] dark:bg-[#1A3821] flex items-center justify-center text-[#2E7D32] dark:text-[#81C784] shrink-0">
                <ShoppingCart className="w-3 h-3" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                Procurement portal
              </span>
            </div>

            {/* Menu engineering */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#F9FAFB] dark:bg-[#1A1B23] border border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/90 transition-all cursor-pointer col-span-1">
              <div className="w-6 h-6 rounded-lg bg-[#EAF7EC] dark:bg-[#1A3821] flex items-center justify-center text-[#2E7D32] dark:text-[#81C784] shrink-0">
                <TrendingUp className="w-3 h-3" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                Menu engineering
              </span>
            </div>
          </div>
        </div>

        {/* Group 3: Grow and understand */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#E6F7F5] dark:bg-[#123835]/90 text-[#00796B] dark:text-[#4DB6AC] text-[10px] font-bold shrink-0">
              Grow and understand
            </span>
            <div className="h-[1px] bg-zinc-150 dark:bg-zinc-800 flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {/* Business analytics */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#F9FAFB] dark:bg-[#1A1B23] border border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/90 transition-all cursor-pointer">
              <div className="w-6 h-6 rounded-lg bg-[#E6F7F5] dark:bg-[#123835] flex items-center justify-center text-[#00796B] dark:text-[#4DB6AC] shrink-0">
                <BarChart3 className="w-3 h-3" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                Business analytics
              </span>
            </div>

            {/* Loyalty and CRM */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#F9FAFB] dark:bg-[#1A1B23] border border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/90 transition-all cursor-pointer">
              <div className="w-6 h-6 rounded-lg bg-[#E6F7F5] dark:bg-[#123835] flex items-center justify-center text-[#00796B] dark:text-[#4DB6AC] shrink-0">
                <Users className="w-3 h-3" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                Loyalty and CRM
              </span>
            </div>
          </div>
        </div>

        {/* Group 4: Scale and specialize */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#FBEAEB] dark:bg-[#3B1423]/90 text-[#880E4F] dark:text-[#F48FB1] text-[10px] font-bold shrink-0">
              Scale and specialize
            </span>
            <div className="h-[1px] bg-zinc-150 dark:bg-zinc-800 flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {/* Clubs and events */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#F9FAFB] dark:bg-[#1A1B23] border border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/90 transition-all cursor-pointer">
              <div className="w-6 h-6 rounded-lg bg-[#FBEAEB] dark:bg-[#3B1423] flex items-center justify-center text-[#880E4F] dark:text-[#F48FB1] shrink-0">
                <Sparkles className="w-3 h-3" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                Clubs and events
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Line */}
      <div className="mt-3.5 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-center relative">
        <span className="text-[10.5px] font-bold text-zinc-400 dark:text-zinc-500 tracking-tight">
          12  Ai integrated modules • 1 connected platform
        </span>

        {/* Down Arrow Floating Icon */}
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-xs flex items-center justify-center text-zinc-500 dark:text-zinc-400 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
          <ChevronDown className="w-3 h-3" />
        </div>
      </div>

    </div>
  );
}
