"use client";

import React, { useState } from "react";
import {
  CreditCard, QrCode, ClipboardList, Tv,
  Boxes, Archive, ChefHat, Sparkles,
  BarChart3, Users, ShoppingCart, TrendingUp,
  ChevronDown, ChevronUp,
  type LucideIcon
} from "lucide-react";

interface OrderItem {
  name: string;
  qty: number | string;
}

interface NodeDetails {
  table: string;
  time: string;
  items: OrderItem[];
  price: string;
  status: string;
  statusColor: string;
}

interface Node {
  id: number;
  num: string;
  title: string;
  sub: string;
  slug: string;
  Icon: LucideIcon;
}

const NODES: Node[] = [
  { id: 1,  num: "01", title: "POS & Billing",        sub: "Fast • Accurate • Reliable", slug: "pos",                 Icon: CreditCard },
  { id: 2,  num: "02", title: "QR Ordering",          sub: "Contactless • Quick",       slug: "qr-ordering",        Icon: QrCode },
  { id: 3,  num: "03", title: "Order Management",     sub: "Track • Manage",            slug: "pos",                 Icon: ClipboardList },
  { id: 4,  num: "04", title: "Kitchen Display",      sub: "Real-time • Clear",         slug: "kds",                 Icon: Tv },
  { id: 5,  num: "05", title: "Smart Stock Counting", sub: "Live • Automated",          slug: "inventory",           Icon: Boxes },
  { id: 6,  num: "06", title: "Inventory Management", sub: "GRN • PO • Vendors",        slug: "inventory",           Icon: Archive },
  { id: 7,  num: "07", title: "Recipe Management",    sub: "Casted • Consistent",       slug: "recipe-management",   Icon: ChefHat },
  { id: 8,  num: "08", title: "Clubs & Events",       sub: "Cashless • Engaging",       slug: "event-management",    Icon: Sparkles },
  { id: 9,  num: "09", title: "Business Analytics",   sub: "Cost • Revenue • Profit",   slug: "reports",             Icon: BarChart3 },
  { id: 10, num: "10", title: "Customer Loyalty",     sub: "CRM • Rewards",             slug: "loyalty",             Icon: Users },
  { id: 11, num: "11", title: "Procurement",          sub: "Purchase • Control",        slug: "production-planning", Icon: ShoppingCart },
  { id: 12, num: "12", title: "Menu Engineering",     sub: "Profit • Optimised",        slug: "menu-engineering",    Icon: TrendingUp },
];

export default function DigitoryLiveRecord() {
  return (
    <div className="w-full max-w-[620px] mx-auto flex flex-col gap-2.5" style={{ userSelect: "none" }}>

      {/* Upper header block - Left Aligned with card start (pl-[12%]) */}
      <div className="flex flex-col items-start text-left mb-1 w-full pl-[12%]">
        <h2 className="text-[21px] font-extrabold tracking-tight leading-tight text-zinc-900 dark:text-white">
          12 solutions. <span className="text-[#FF5A0A]">One operating system.</span>
        </h2>
      </div>

      {/* 12 stacked cards container - Right Aligned with container right edge */}
      <div className="flex flex-col items-end gap-1 w-full relative">
        {NODES.map((n) => {
          const isFirst = n.id === 1;
          const cardWidthPct = 88;

          return (
            <a
              key={n.id}
              href={`/solutions/${n.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col border border-zinc-200/50 dark:border-zinc-800/50 rounded-lg overflow-hidden bg-white dark:bg-zinc-900 transition-all duration-200 hover:border-orange-500/40 hover:shadow-md hover:-translate-y-[1px]"
              style={{
                width: `${cardWidthPct}%`,
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.01)",
              }}
            >
              {/* Card clickable row */}
              <div
                className="flex items-center justify-between px-3 py-1 hover:bg-zinc-50/80 dark:hover:bg-zinc-850/80 transition-colors duration-200 cursor-pointer"
                style={{
                  borderLeft: isFirst
                    ? "3.5px solid #FF5A0A"
                    : "3.5px solid transparent",
                  paddingLeft: isFirst ? "10px" : "13px"
                }}
              >
                {/* Left Group */}
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 w-4 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                    {n.num}
                  </span>

                  <div className="flex items-center justify-center w-6 h-6 text-zinc-500 dark:text-zinc-400 group-hover:text-[#FF5A0A] transition-colors">
                    <n.Icon size={13} strokeWidth={2.2} />
                  </div>

                  <span className="text-[11.5px] font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-[#FF5A0A] transition-colors">
                    {n.title}
                  </span>

                  {isFirst && (
                    <span className="px-1.5 py-0.5 text-[7px] font-black tracking-wider text-orange-600 bg-orange-50 dark:bg-orange-950/40 border border-orange-200/50 dark:border-orange-900/50 rounded-full scale-90 origin-left">
                      LIVE
                    </span>
                  )}
                </div>

                {/* Right Group */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium hidden sm:inline">
                    {n.sub}
                  </span>

                  {/* Styled Arrow Link */}
                  <div className="flex items-center justify-center pl-1 text-zinc-400 dark:text-zinc-500 group-hover:text-[#FF5A0A] group-hover:translate-x-0.5 transition-all">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* DIGITORY AI LAYER Pill - strict single row on desktop/tablet - matches cards style/width */}
      <div
        className="flex flex-row items-center bg-zinc-950 text-white rounded-xl px-4 py-2.5 gap-2.5 justify-between w-[88%] self-end overflow-hidden"
        style={{
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)"
        }}
      >
        <div className="flex items-center gap-1.5 text-[#FF5A0A] font-black tracking-widest text-[8.5px] shrink-0">
          <span className="w-1.5 h-1.5 bg-[#FF5A0A] rounded-xs rotate-45" />
          DIGITORY AI LAYER
        </div>

        <div className="flex items-center text-zinc-800 self-stretch shrink-0 text-[10px] select-none">|</div>

        <div className="flex flex-row items-center justify-between gap-4 flex-1 text-[8.5px] text-zinc-400 font-semibold overflow-hidden">
          <div className="flex flex-col whitespace-nowrap">
            <span className="text-white font-bold text-[9px]">Predict Demand</span>
            <span className="text-zinc-500 text-[8px]">Know what's coming</span>
          </div>
          <div className="flex flex-col whitespace-nowrap">
            <span className="text-white font-bold text-[9px]">Optimise Operations</span>
            <span className="text-zinc-500 text-[8px]">Reduce waste</span>
          </div>
          <div className="flex flex-col whitespace-nowrap">
            <span className="text-white font-bold text-[9px]">Act in Real Time</span>
            <span className="text-zinc-500 text-[8px]">Intelligent • Automated</span>
          </div>
        </div>
      </div>
    </div>
  );
}
