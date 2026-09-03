"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  QrCode,
  ClipboardList,
  Tv,
  Boxes,
  Archive,
  ChefHat,
  Sparkles,
  BarChart3,
  Users,
  ShoppingCart,
  TrendingUp,
  type LucideIcon
} from "lucide-react";

export interface SolutionItem {
  id: number;
  num: string;
  title: string;
  sub: string;
  slug: string;
  category: string;
  desc: string;
  color: string;
  Icon: LucideIcon;
}

export const SOLUTIONS: SolutionItem[] = [
  {
    id: 1,
    num: "01",
    title: "POS & Billing",
    sub: "Fast • Accurate • Reliable",
    slug: "pos",
    category: "Run Operations",
    desc: "Dine-in, online, and direct billing with instant payment reconciliation.",
    color: "#f4883c",
    Icon: CreditCard,
  },
  {
    id: 2,
    num: "02",
    title: "QR Ordering",
    sub: "Contactless • Table Orders",
    slug: "qr-ordering",
    category: "Run Operations",
    desc: "Guests scan, order, and pay directly from their table live with KDS.",
    color: "#f47c3c",
    Icon: QrCode,
  },
  {
    id: 3,
    num: "03",
    title: "Order Management",
    sub: "Track • Manage • Dispatch",
    slug: "pos",
    category: "Run Operations",
    desc: "Centralized KOT tracking and order dispatch for kitchen & service floor.",
    color: "#fc9834",
    Icon: ClipboardList,
  },
  {
    id: 4,
    num: "04",
    title: "Kitchen Display (KDS)",
    sub: "Real-time • Station Sync",
    slug: "kds",
    category: "Run Operations",
    desc: "Real-time kitchen order tickets to eliminate order delays & shouting.",
    color: "#fca42c",
    Icon: Tv,
  },
  {
    id: 5,
    num: "05",
    title: "Smart Stock Counting",
    sub: "Live • Automated Audit",
    slug: "inventory",
    category: "Manage Inventory",
    desc: "Live inventory tracking that deducts ingredients automatically per order.",
    color: "#ffac3c",
    Icon: Boxes,
  },
  {
    id: 6,
    num: "06",
    title: "Inventory Management",
    sub: "GRN • PO • Vendor Control",
    slug: "inventory",
    category: "Manage Inventory",
    desc: "Manage purchase orders, stock levels, and vendors before running out.",
    color: "#f8bb8f",
    Icon: Archive,
  },
  {
    id: 7,
    num: "07",
    title: "Recipe Management",
    sub: "Portion Costing & Margins",
    slug: "recipe-management",
    category: "Manage Inventory",
    desc: "Lock recipe portions and food cost margins so dish profits hold firm.",
    color: "#f6a66e",
    Icon: ChefHat,
  },
  {
    id: 8,
    num: "08",
    title: "Clubs & Events",
    sub: "Cashless Ticketing & VIP",
    slug: "event-management",
    category: "Scale & Specialize",
    desc: "Cashless ticket sales, VIP table bookings, and high-volume event settlement.",
    color: "#f4914c",
    Icon: Sparkles,
  },
  {
    id: 9,
    num: "09",
    title: "Business Analytics",
    sub: "Revenue • Margin Insights",
    slug: "reports",
    category: "Grow & Understand",
    desc: "Live sales dashboards, item revenue analytics, and outlet metrics.",
    color: "#f37d2a",
    Icon: BarChart3,
  },
  {
    id: 10,
    num: "10",
    title: "Customer Loyalty & CRM",
    sub: "Guest Retention & Rewards",
    slug: "loyalty",
    category: "Grow & Understand",
    desc: "Build guest profiles, run targeted loyalty campaigns and repeat orders.",
    color: "#ec690d",
    Icon: Users,
  },
  {
    id: 11,
    num: "11",
    title: "Procurement Portal",
    sub: "PO Automation & Bids",
    slug: "production-planning",
    category: "Manage Inventory",
    desc: "Compare vendor quotes, automate purchase approvals and supply chain.",
    color: "#f67c03",
    Icon: ShoppingCart,
  },
  {
    id: 12,
    num: "12",
    title: "Menu Engineering",
    sub: "Profitability Matrix",
    slug: "menu-engineering",
    category: "Manage Inventory",
    desc: "Analyze dish popularity & margins to design high-yielding menus.",
    color: "#f98f00",
    Icon: TrendingUp,
  },
];

// Helper to convert polar coordinates to Cartesian
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  const rawX = centerX + radius * Math.cos(angleInRadians);
  const rawY = centerY + radius * Math.sin(angleInRadians);
  return {
    x: Number(rawX.toFixed(4)),
    y: Number(rawY.toFixed(4)),
  };
}

// Helper to create an SVG arc path string for a donut slice
function describeDonutSlice(
  x: number,
  y: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number
) {
  const outerStart = polarToCartesian(x, y, outerRadius, endAngle);
  const outerEnd = polarToCartesian(x, y, outerRadius, startAngle);
  const innerStart = polarToCartesian(x, y, innerRadius, endAngle);
  const innerEnd = polarToCartesian(x, y, innerRadius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M", outerStart.x, outerStart.y,
    "A", outerRadius, outerRadius, 0, largeArcFlag, 0, outerEnd.x, outerEnd.y,
    "L", innerEnd.x, innerEnd.y,
    "A", innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
    "Z"
  ].join(" ");
}

export default function SolutionsDonutChart() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const activeSolution = SOLUTIONS.find((s) => s.id === hoveredId);

  const cx = 230;
  const cy = 230;
  const outerRadius = 180;
  const innerRadius = 115;
  const badgeRadius = 205;
  const numSlices = SOLUTIONS.length;
  const sliceAngle = 360 / numSlices;
  const gapAngle = 1.6; // Gap between slices

  return (
    <div className="w-full max-w-[500px] mx-auto flex flex-col items-center select-none">

      {/* Donut Container with central overlay */}
      <div className="relative w-full aspect-square max-w-[460px] flex items-center justify-center">
        
        {/* SVG Donut Chart */}
        <svg viewBox="0 0 460 460" className="w-full h-full overflow-visible drop-shadow-md" suppressHydrationWarning>
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#FF4F18" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Render Donut Slices with distinct colors */}
          {SOLUTIONS.map((item, index) => {
            const startAngle = index * sliceAngle + gapAngle / 2;
            const endAngle = (index + 1) * sliceAngle - gapAngle / 2;
            const isHovered = hoveredId === item.id;
            
            const sliceColor = item.color;
            const sliceOuterR = isHovered ? outerRadius + 8 : outerRadius;
            const sliceInnerR = isHovered ? innerRadius - 3 : innerRadius;

            const pathD = describeDonutSlice(cx, cy, sliceOuterR, sliceInnerR, startAngle, endAngle);

            return (
              <g
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="cursor-pointer transition-all duration-300"
              >
                <path
                  d={pathD}
                  fill={sliceColor}
                  opacity={hoveredId === null ? 0.9 : isHovered ? 1 : 0.4}
                  className="transition-all duration-300 stroke-white dark:stroke-[#0d0d0e]"
                  strokeWidth={2}
                  style={{
                    filter: isHovered ? "drop-shadow(0px 4px 14px rgba(255, 79, 24, 0.65))" : "none",
                  }}
                />
              </g>
            );
          })}

          {/* Render Radial Icon/Number Nodes around the ring */}
          {SOLUTIONS.map((item, index) => {
            const midAngle = index * sliceAngle + sliceAngle / 2;
            const pos = polarToCartesian(cx, cy, badgeRadius, midAngle);
            const isHovered = hoveredId === item.id;
            const Icon = item.Icon;

            return (
              <g
                key={`badge-${item.id}`}
                transform={`translate(${pos.x}, ${pos.y})`}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="cursor-pointer transition-all duration-300"
              >
                <circle
                  r={isHovered ? 16 : 13}
                  fill={isHovered ? "#FF4F18" : "white"}
                  className="dark:fill-zinc-900 transition-all duration-300 stroke-zinc-200 dark:stroke-zinc-700"
                  strokeWidth={1.5}
                  style={{
                    filter: isHovered ? "drop-shadow(0 4px 12px rgba(255, 79, 24, 0.6))" : "none",
                  }}
                />
                <foreignObject
                  x={isHovered ? -16 : -13}
                  y={isHovered ? -16 : -13}
                  width={isHovered ? 32 : 26}
                  height={isHovered ? 32 : 26}
                  className="pointer-events-none"
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon
                      size={isHovered ? 15 : 12}
                      className={isHovered ? "text-white" : "text-zinc-700 dark:text-zinc-300"}
                    />
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>

        {/* Center Info Card overlay */}
        <div
          className={`absolute inset-0 m-auto w-[220px] h-[220px] rounded-full bg-white/95 dark:bg-[#121214]/95 backdrop-blur-md transition-all duration-300 flex flex-col items-center justify-center p-4 text-center ${
            activeSolution
              ? "border-2 border-[#FF4F18] shadow-[0_8px_30px_rgba(255,79,24,0.3)] scale-[1.03]"
              : "border border-zinc-200/80 dark:border-zinc-800/80 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
          }`}
        >
          {activeSolution ? (
            <div className="flex flex-col items-center justify-center h-full w-full animate-fadeIn">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full text-white bg-[#FF4F18]">
                  #{activeSolution.num}
                </span>
                <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 truncate max-w-[120px]">
                  {activeSolution.category}
                </span>
              </div>

              <div className="w-8 h-8 rounded-full flex items-center justify-center my-1 text-white bg-[#FF4F18] shadow-[0_4px_12px_rgba(255,79,24,0.35)]">
                <activeSolution.Icon size={16} />
              </div>

              <h3 className="text-sm font-bold text-zinc-950 dark:text-white leading-tight mb-1">
                {activeSolution.title}
              </h3>

              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug line-clamp-2 px-1 mb-2">
                {activeSolution.desc}
              </p>

              <Link
                href={`/solutions/${activeSolution.slug}`}
                className="text-[10px] font-bold text-[#FF4F18] hover:underline flex items-center gap-1"
              >
                Explore details &rarr;
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full w-full px-2">
              <div className="w-10 h-10 rounded-full bg-transparent text-[#FF4F18] flex items-center justify-center mb-2 border border-zinc-200 dark:border-zinc-800">
                <span className="text-sm font-black">12</span>
              </div>
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white leading-tight">
                Digitory <span className="text-[#FF4F18]">OS</span>
              </h3>
              <p className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 mt-1 leading-snug">
                12 integrated solutions. Hover over any segment to inspect.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Bottom AI Pill */}
      <div className="w-full mt-4 flex items-center justify-between bg-zinc-950 text-white rounded-xl px-4 py-2.5 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF4F18] animate-pulse" />
          <span className="text-[11px] font-extrabold tracking-wider text-white">
            DIGITORY AI LAYER
          </span>
        </div>
        <span className="text-[10px] text-zinc-400 font-medium">
          Forecasting & Demand Engine
        </span>
      </div>

    </div>
  );
}
