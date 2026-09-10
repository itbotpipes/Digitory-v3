'use client';

import React from 'react';
import Link from 'next/link';
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
  Hexagon,
  Package,
  ChefHat,
  ShoppingCart,
  BarChart3,
  Users,
  ArrowDown
} from 'lucide-react';

/* 
====================================================================
PREVIOUS HERO IMPLEMENTATION (COMMENTED OUT AS REQUESTED)
====================================================================

import DigitoryLiveRecord from './DigitoryLiveRecord';

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

interface ServiceNode {
  id: number;
  num: string;
  title: string;
  sub: string;
  x: number;
  y: number;
  icon: React.ComponentType<any>;
  details: NodeDetails;
}

const serviceNodes: ServiceNode[] = [
  {
    id: 1,
    num: "01",
    title: "POS & Billing",
    sub: "Fast • Accurate",
    x: 23, y: 8,
    icon: CreditCard,
    details: {
      table: "Counter 02",
      time: "08:43 PM",
      items: [
        { name: "Cheese Garlic Bread", qty: 1 },
        { name: "Cold Brew Coffee", qty: 2 }
      ],
      price: "₹450",
      status: "BILLING",
      statusColor: "text-orange-500"
    }
  },
  {
    id: 2,
    num: "02",
    title: "QR Ordering",
    sub: "Contactless • Quick",
    x: 50, y: 2,
    icon: QrCode,
    details: {
      table: "Table 04",
      time: "08:45 PM",
      items: [
        { name: "Virgin Mojito", qty: 2 },
        { name: "Peri Peri Fries", qty: 1 }
      ],
      price: "₹380",
      status: "QR ORDERED",
      statusColor: "text-blue-500"
    }
  },
  {
    id: 3,
    num: "03",
    title: "Order Management",
    sub: "Track • Manage",
    x: 77, y: 8,
    icon: ClipboardList,
    details: {
      table: "KOT #412",
      time: "08:46 PM",
      items: [
        { name: "Veg Hakka Noodles", qty: 1 },
        { name: "Chilli Paneer Dry", qty: 1 }
      ],
      price: "₹540",
      status: "DISPATCHED",
      statusColor: "text-purple-500"
    }
  },
  {
    id: 4,
    num: "04",
    title: "Kitchen Display",
    sub: "Real-time • Clear",
    x: 91, y: 24,
    icon: Tv,
    details: {
      table: "Station 1 (Mains)",
      time: "08:48 PM",
      items: [
        { name: "Dal Makhani", qty: 1 },
        { name: "Lachha Paratha", qty: 3 }
      ],
      price: "₹410",
      status: "COOKING",
      statusColor: "text-amber-500"
    }
  },
  {
    id: 5,
    num: "05",
    title: "Smart Stock Counting",
    sub: "Live • Automated",
    x: 93, y: 50,
    icon: Hexagon,
    details: {
      table: "Store Room",
      time: "08:49 PM",
      items: [
        { name: "Fresh Cream (Mother Dairy)", qty: "12/20" },
        { name: "Butter Blocks (Amul)", qty: "8/15" }
      ],
      price: "85% OK",
      status: "AUDITED",
      statusColor: "text-teal-500"
    }
  },
  {
    id: 6,
    num: "06",
    title: "Inventory Management",
    sub: "GRN • PO • Vendors",
    x: 91, y: 76,
    icon: Package,
    details: {
      table: "PO #819",
      time: "08:50 PM",
      items: [
        { name: "Basmati Rice (50kg)", qty: "2 Bags" },
        { name: "Refined Oil (15L)", qty: "5 Tins" }
      ],
      price: "Sent",
      status: "GRN RECORDED",
      statusColor: "text-indigo-500"
    }
  },
  {
    id: 7,
    num: "07",
    title: "Recipe Management",
    sub: "Costed • Consistent",
    x: 77, y: 92,
    icon: ChefHat,
    details: {
      table: "Dish Costing",
      time: "08:52 PM",
      items: [
        { name: "Paneer Tikka (Recipe)", qty: "Cost: ₹110" },
        { name: "Selling Price", qty: "Price: ₹320" }
      ],
      price: "34% Cost",
      status: "OPTIMIZED",
      statusColor: "text-emerald-500"
    }
  },
  {
    id: 8,
    num: "08",
    title: "Clubs & Events",
    sub: "Cashless • Engaging",
    x: 50, y: 98,
    icon: Sparkles,
    details: {
      table: "VVIP Event",
      time: "08:54 PM",
      items: [
        { name: "Entry Cover Charge", qty: "25 Ppl" },
        { name: "VIP Table Booking", qty: "2 Tables" }
      ],
      price: "₹45,000",
      status: "CASHLESS",
      statusColor: "text-rose-500"
    }
  },
  {
    id: 9,
    num: "09",
    title: "Business Analytics",
    sub: "Cost • Revenue • Profit",
    x: 23, y: 92,
    icon: BarChart3,
    details: {
      table: "EOD Summary",
      time: "08:55 PM",
      items: [
        { name: "Net Sales Today", qty: "₹1,24,500" },
        { name: "Gross Margin", qty: "68.2%" }
      ],
      price: "+14.2% MoM",
      status: "HEALTHY",
      statusColor: "text-green-500"
    }
  },
  {
    id: 10,
    num: "10",
    title: "Customer Loyalty",
    sub: "CRM • Rewards",
    x: 9, y: 76,
    icon: Users,
    details: {
      table: "Member #482",
      time: "08:56 PM",
      items: [
        { name: "Siddharth Sharma", qty: "Gold" },
        { name: "Points Redeemed", qty: "320 pts" }
      ],
      price: "₹120 Disc",
      status: "REWARDED",
      statusColor: "text-pink-500"
    }
  },
  {
    id: 11,
    num: "11",
    title: "Procurement",
    sub: "Purchase • Control",
    x: 7, y: 50,
    icon: ShoppingCart,
    details: {
      table: "Vendor Portal",
      time: "08:58 PM",
      items: [
        { name: "Poultry Supplier Ltd", qty: "Chicken" },
        { name: "Price Approved", qty: "₹240/kg" }
      ],
      price: "Best Bid",
      status: "CONTRACTED",
      statusColor: "text-cyan-500"
    }
  },
  {
    id: 12,
    num: "12",
    title: "Menu Engineering",
    sub: "Profit • Optimised",
    x: 9, y: 24,
    icon: TrendingUp,
    details: {
      table: "Menu Matrix",
      time: "09:00 PM",
      items: [
        { name: "Butter Chicken", qty: "Star ⭐️" },
        { name: "Tandoori Roti", qty: "High Vol" }
      ],
      price: "Max Profit",
      status: "RECOMMENDED",
      statusColor: "text-violet-500"
    }
  }
];

const defaultDetails: NodeDetails = {
  table: "Table 18",
  time: "08:42 PM",
  items: [
    { name: "Paneer Tikka", qty: 2 },
    { name: "Butter Chicken", qty: 1 }
  ],
  price: "₹860",
  status: "LIVE",
  statusColor: "text-emerald-500"
};
====================================================================
*/

export default function Hero() {
  const trustCircles = [
    { text: 'R', bg: 'bg-[#ECECEC]', textCol: 'text-zinc-600' },
    { text: 'C', bg: 'bg-[#D2E9E9]', textCol: 'text-teal-600' },
    { text: 'B', bg: 'bg-[#FFE5D9]', textCol: 'text-orange-600' },
    { text: 'K', bg: 'bg-[#E8EAFF]', textCol: 'text-indigo-600' },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 pt-4 pb-10 md:pt-8 md:pb-16 lg:pt-10 lg:pb-20">
      {/* Top Header & CTAs */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-8 md:mb-12 space-y-4 md:space-y-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
          Manage busy hours <span className="text-[#FF4F18]">with ease</span>
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-xl leading-relaxed">
          From billing and inventory to customer loyalty and reports, Digitory helps you run your restaurant smoothly and grow your business.
        </p>

        <div className="flex flex-wrap gap-4 items-center justify-center pt-2">
          <Link
            href="/request-demo"
            className="inline-flex justify-center items-center text-center rounded-full bg-[#FF4F18] px-7 py-3 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-[#E03F0D] shadow-[0_8px_20px_rgba(255,79,24,0.35)] hover:shadow-[0_10px_24px_rgba(255,79,24,0.45)] active:scale-[0.98] cursor-pointer"
          >
            Book a demo
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center gap-4 pt-2">
          <div className="flex -space-x-3">
            {trustCircles.map((circle, idx) => (
              <div
                key={idx}
                className={`flex h-7 w-7 items-center justify-center rounded-full ${circle.bg} ${circle.textCol} font-extrabold text-xs border-2 border-white dark:border-zinc-900`}
              >
                {circle.text}
              </div>
            ))}
          </div>
          <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 max-w-xs leading-normal text-left">
            Trusted by restaurants, cafes, bars, breweries and cloud kitchens across India.
          </p>
        </div>
      </div>

      {/* NEW HERO CARD: Digitory AI Layer (Exact replica of attached image) */}
      <div className="w-full max-w-6xl mx-auto bg-[#FAFAFA] dark:bg-zinc-900/90 border border-zinc-200/90 dark:border-zinc-800 rounded-[28px] md:rounded-[36px] p-5 sm:p-7 md:p-10 shadow-xl shadow-zinc-200/40 dark:shadow-none space-y-8 select-none">
        
        {/* Card Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          {/* Title */}
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-sky-500 shrink-0" />
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
              Digitory AI layer
            </h2>
          </div>

          {/* AI Feature Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-[#E4F0FD] text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-300 px-3.5 py-1.5 rounded-full text-xs font-bold transition-transform hover:scale-105">
              <TrendingUp className="w-3.5 h-3.5" />
              Forecasting
            </span>
            <span className="inline-flex items-center gap-1.5 bg-[#E4F0FD] text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-300 px-3.5 py-1.5 rounded-full text-xs font-bold transition-transform hover:scale-105">
              <Tag className="w-3.5 h-3.5" />
              Pricing
            </span>
            <span className="inline-flex items-center gap-1.5 bg-[#E4F0FD] text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-300 px-3.5 py-1.5 rounded-full text-xs font-bold transition-transform hover:scale-105">
              <Bell className="w-3.5 h-3.5" />
              Alerts
            </span>
            <span className="inline-flex items-center gap-1.5 bg-[#E4F0FD] text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-300 px-3.5 py-1.5 rounded-full text-xs font-bold transition-transform hover:scale-105">
              <Lightbulb className="w-3.5 h-3.5" />
              Recommendations
            </span>
          </div>
        </div>

        {/* Group 1: Run operations */}
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="bg-[#FAF0ED] text-[#A63C2C] dark:bg-rose-950/40 dark:text-rose-300 px-3.5 py-1 rounded-full text-xs font-black tracking-wide shrink-0">
              Run operations
            </span>
            <div className="h-[1px] bg-zinc-200/80 dark:bg-zinc-800 flex-1 ml-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-[#F8F6F4] dark:bg-zinc-800/60 border border-zinc-200/50 dark:border-zinc-700/50 rounded-2xl p-3.5 flex items-center gap-3.5 hover:shadow-md hover:border-zinc-300 transition-all duration-200 group cursor-pointer">
              <div className="p-2.5 rounded-xl bg-[#FAF0ED] text-[#A63C2C] dark:bg-rose-950/50 dark:text-rose-300 shrink-0 group-hover:scale-110 transition-transform">
                <CreditCard className="w-5 h-5" />
              </div>
              <span className="text-sm font-black text-zinc-900 dark:text-white leading-snug">
                POS and billing
              </span>
            </div>

            <div className="bg-[#F8F6F4] dark:bg-zinc-800/60 border border-zinc-200/50 dark:border-zinc-700/50 rounded-2xl p-3.5 flex items-center gap-3.5 hover:shadow-md hover:border-zinc-300 transition-all duration-200 group cursor-pointer">
              <div className="p-2.5 rounded-xl bg-[#FAF0ED] text-[#A63C2C] dark:bg-rose-950/50 dark:text-rose-300 shrink-0 group-hover:scale-110 transition-transform">
                <QrCode className="w-5 h-5" />
              </div>
              <span className="text-sm font-black text-zinc-900 dark:text-white leading-snug">
                QR ordering
              </span>
            </div>

            <div className="bg-[#F8F6F4] dark:bg-zinc-800/60 border border-zinc-200/50 dark:border-zinc-700/50 rounded-2xl p-3.5 flex items-center gap-3.5 hover:shadow-md hover:border-zinc-300 transition-all duration-200 group cursor-pointer">
              <div className="p-2.5 rounded-xl bg-[#FAF0ED] text-[#A63C2C] dark:bg-rose-950/50 dark:text-rose-300 shrink-0 group-hover:scale-110 transition-transform">
                <ClipboardList className="w-5 h-5" />
              </div>
              <span className="text-sm font-black text-zinc-900 dark:text-white leading-snug">
                Order management
              </span>
            </div>

            <div className="bg-[#F8F6F4] dark:bg-zinc-800/60 border border-zinc-200/50 dark:border-zinc-700/50 rounded-2xl p-3.5 flex items-center gap-3.5 hover:shadow-md hover:border-zinc-300 transition-all duration-200 group cursor-pointer">
              <div className="p-2.5 rounded-xl bg-[#FAF0ED] text-[#A63C2C] dark:bg-rose-950/50 dark:text-rose-300 shrink-0 group-hover:scale-110 transition-transform">
                <Tv className="w-5 h-5" />
              </div>
              <span className="text-sm font-black text-zinc-900 dark:text-white leading-snug">
                Kitchen display
              </span>
            </div>
          </div>
        </div>

        {/* Group 2: Manage inventory */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center">
            <span className="bg-[#EFF7EC] text-[#2C6B26] dark:bg-emerald-950/40 dark:text-emerald-300 px-3.5 py-1 rounded-full text-xs font-black tracking-wide shrink-0">
              Manage inventory
            </span>
            <div className="h-[1px] bg-zinc-200/80 dark:bg-zinc-800 flex-1 ml-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-[#F8F6F4] dark:bg-zinc-800/60 border border-zinc-200/50 dark:border-zinc-700/50 rounded-2xl p-3.5 flex items-center gap-3.5 hover:shadow-md hover:border-zinc-300 transition-all duration-200 group cursor-pointer">
              <div className="p-2.5 rounded-xl bg-[#EFF7EC] text-[#2C6B26] dark:bg-emerald-950/50 dark:text-emerald-300 shrink-0 group-hover:scale-110 transition-transform">
                <Hexagon className="w-5 h-5" />
              </div>
              <span className="text-sm font-black text-zinc-900 dark:text-white leading-snug">
                Stock counting
              </span>
            </div>

            <div className="bg-[#F8F6F4] dark:bg-zinc-800/60 border border-zinc-200/50 dark:border-zinc-700/50 rounded-2xl p-3.5 flex items-center gap-3.5 hover:shadow-md hover:border-zinc-300 transition-all duration-200 group cursor-pointer">
              <div className="p-2.5 rounded-xl bg-[#EFF7EC] text-[#2C6B26] dark:bg-emerald-950/50 dark:text-emerald-300 shrink-0 group-hover:scale-110 transition-transform">
                <Package className="w-5 h-5" />
              </div>
              <span className="text-sm font-black text-zinc-900 dark:text-white leading-snug">
                Inventory management
              </span>
            </div>

            <div className="bg-[#F8F6F4] dark:bg-zinc-800/60 border border-zinc-200/50 dark:border-zinc-700/50 rounded-2xl p-3.5 flex items-center gap-3.5 hover:shadow-md hover:border-zinc-300 transition-all duration-200 group cursor-pointer">
              <div className="p-2.5 rounded-xl bg-[#EFF7EC] text-[#2C6B26] dark:bg-emerald-950/50 dark:text-emerald-300 shrink-0 group-hover:scale-110 transition-transform">
                <ChefHat className="w-5 h-5" />
              </div>
              <span className="text-sm font-black text-zinc-900 dark:text-white leading-snug">
                Recipe management
              </span>
            </div>

            <div className="bg-[#F8F6F4] dark:bg-zinc-800/60 border border-zinc-200/50 dark:border-zinc-700/50 rounded-2xl p-3.5 flex items-center gap-3.5 hover:shadow-md hover:border-zinc-300 transition-all duration-200 group cursor-pointer">
              <div className="p-2.5 rounded-xl bg-[#EFF7EC] text-[#2C6B26] dark:bg-emerald-950/50 dark:text-emerald-300 shrink-0 group-hover:scale-110 transition-transform">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <span className="text-sm font-black text-zinc-900 dark:text-white leading-snug">
                Procurement portal
              </span>
            </div>

            <div className="bg-[#F8F6F4] dark:bg-zinc-800/60 border border-zinc-200/50 dark:border-zinc-700/50 rounded-2xl p-3.5 flex items-center gap-3.5 hover:shadow-md hover:border-zinc-300 transition-all duration-200 group cursor-pointer">
              <div className="p-2.5 rounded-xl bg-[#EFF7EC] text-[#2C6B26] dark:bg-emerald-950/50 dark:text-emerald-300 shrink-0 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-sm font-black text-zinc-900 dark:text-white leading-snug">
                Menu engineering
              </span>
            </div>
          </div>
        </div>

        {/* Group 3: Grow and understand */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center">
            <span className="bg-[#EBF7F5] text-[#1F665E] dark:bg-teal-950/40 dark:text-teal-300 px-3.5 py-1 rounded-full text-xs font-black tracking-wide shrink-0">
              Grow and understand
            </span>
            <div className="h-[1px] bg-zinc-200/80 dark:bg-zinc-800 flex-1 ml-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-[#F8F6F4] dark:bg-zinc-800/60 border border-zinc-200/50 dark:border-zinc-700/50 rounded-2xl p-3.5 flex items-center gap-3.5 hover:shadow-md hover:border-zinc-300 transition-all duration-200 group cursor-pointer">
              <div className="p-2.5 rounded-xl bg-[#EBF7F5] text-[#1F665E] dark:bg-teal-950/50 dark:text-teal-300 shrink-0 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-sm font-black text-zinc-900 dark:text-white leading-snug">
                Business analytics
              </span>
            </div>

            <div className="bg-[#F8F6F4] dark:bg-zinc-800/60 border border-zinc-200/50 dark:border-zinc-700/50 rounded-2xl p-3.5 flex items-center gap-3.5 hover:shadow-md hover:border-zinc-300 transition-all duration-200 group cursor-pointer">
              <div className="p-2.5 rounded-xl bg-[#EBF7F5] text-[#1F665E] dark:bg-teal-950/50 dark:text-teal-300 shrink-0 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-sm font-black text-zinc-900 dark:text-white leading-snug">
                Loyalty and CRM
              </span>
            </div>
          </div>
        </div>

        {/* Group 4: Scale and specialize */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center">
            <span className="bg-[#FAF0F3] text-[#9E2B45] dark:bg-pink-950/40 dark:text-pink-300 px-3.5 py-1 rounded-full text-xs font-black tracking-wide shrink-0">
              Scale and specialize
            </span>
            <div className="h-[1px] bg-zinc-200/80 dark:bg-zinc-800 flex-1 ml-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-[#F8F6F4] dark:bg-zinc-800/60 border border-zinc-200/50 dark:border-zinc-700/50 rounded-2xl p-3.5 flex items-center gap-3.5 hover:shadow-md hover:border-zinc-300 transition-all duration-200 group cursor-pointer">
              <div className="p-2.5 rounded-xl bg-[#FAF0F3] text-[#9E2B45] dark:bg-pink-950/50 dark:text-pink-300 shrink-0 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-sm font-black text-zinc-900 dark:text-white leading-snug">
                Clubs and events
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="pt-6 flex flex-col items-center justify-center border-t border-zinc-200/60 dark:border-zinc-800">
          <p className="text-xs sm:text-sm font-extrabold text-zinc-500 dark:text-zinc-400 tracking-wide text-center">
            12 integrated modules • 1 connected platform
          </p>

          <button 
            onClick={() => {
              window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' });
            }}
            className="mt-4 h-9 w-9 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-md flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:scale-110 transition-transform cursor-pointer"
            aria-label="Scroll down"
          >
            <ArrowDown className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>

      </div>
    </section>
  );
}
