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
  Icon: LucideIcon;
  details: NodeDetails;
}

const NODES: Node[] = [
  { 
    id: 1,  
    num: "01", 
    title: "POS & Billing",         
    sub: "Fast • Accurate • Reliable", 
    Icon: CreditCard,
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
    Icon: QrCode,
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
    Icon: ClipboardList,
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
    Icon: Tv,
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
    Icon: Boxes,
    details: {
      table: "Store Room",
      time: "08:49 PM",
      items: [
        { name: "Fresh Cream", qty: "12/20" },
        { name: "Butter Blocks", qty: "8/15" }
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
    Icon: Archive,
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
    sub: "Casted • Consistent",        
    Icon: ChefHat,
    details: {
      table: "Dish Costing",
      time: "08:52 PM",
      items: [
        { name: "Paneer Tikka (Rec.)", qty: "Cost: ₹110" },
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
    Icon: Sparkles,
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
    Icon: BarChart3,
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
    Icon: Users,
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
    Icon: ShoppingCart,
    details: {
      table: "Vendor Portal",
      time: "08:58 PM",
      items: [
        { name: "Poultry Supplier", qty: "Chicken" },
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
    Icon: TrendingUp,
    details: {
      table: "Menu Matrix",
      time: "09:00 PM",
      items: [
        { name: "Butter Chicken", qty: "Star ★" },
        { name: "Tandoori Roti", qty: "High Vol" }
      ],
      price: "Max Profit",
      status: "RECOMMENDED",
      statusColor: "text-violet-500"
    }
  },
];

export default function DigitoryLiveRecord() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleNode = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="w-full max-w-[620px] mx-auto flex flex-col gap-2.5" style={{ userSelect: "none" }}>
      
      {/* Upper header block matching reference - 20% bigger & Left Aligned */}
      <div className="flex flex-col items-start text-left gap-1 mb-1 pl-[7%]">
        <div className="inline-flex items-center gap-1.5 text-[10.5px] font-black tracking-wider text-[#FF5A0A]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A0A]" />
          <span>DIGITORY OS</span>
          <span className="text-zinc-300">/</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-500">LIVE</span>
        </div>
        <h2 className="text-[30px] font-extrabold tracking-tight text-zinc-900 dark:text-white leading-none">
          12 solutions.
        </h2>
        <h2 className="text-[30px] font-extrabold tracking-tight text-[#FF5A0A] leading-none -mt-1">
          One operating system.
        </h2>
        <p className="text-[12px] text-zinc-500 font-semibold mt-1">
          Every part of your restaurant. Connected on one live record.
        </p>
      </div>

      {/* 12 stacked cards container in a pyramid shape (wider as you go down) */}
      <div className="flex flex-col items-center gap-1 w-full relative">
        {NODES.map((n) => {
          const isExpanded = expandedId === n.id;
          const isFirst = n.id === 1;

          // Pyramid effect: width expands step-by-step as we go down (01 is narrowest, 12 is widest)
          const cardWidthPct = 88 + (n.id - 1) * 1.09;

          return (
            <div 
              key={n.id}
              className="flex flex-col border border-zinc-200/50 dark:border-zinc-800/50 rounded-lg overflow-hidden bg-white dark:bg-zinc-900 transition-all duration-200"
              style={{
                width: `${cardWidthPct}%`,
                boxShadow: isExpanded 
                  ? "0 4px 12px rgba(0, 0, 0, 0.05)" 
                  : "0 1px 3px rgba(0, 0, 0, 0.01)",
              }}
            >
              {/* Header clickable row (ultra-compact padding) */}
              <div
                onClick={() => toggleNode(n.id)}
                className="flex items-center justify-between px-3 py-1 hover:bg-zinc-50/50 dark:hover:bg-zinc-850/50 transition-colors duration-200 cursor-pointer"
                style={{
                  borderLeft: isFirst 
                    ? "3.5px solid #FF5A0A" 
                    : isExpanded 
                    ? "3.5px solid rgba(255, 90, 10, 0.6)" 
                    : "3.5px solid transparent",
                  paddingLeft: (isFirst || isExpanded) ? "10px" : "13px"
                }}
              >
                {/* Left Group */}
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 w-4">
                    {n.num}
                  </span>

                  <div className="flex items-center justify-center w-6 h-6 text-zinc-500 dark:text-zinc-400">
                    <n.Icon size={13} strokeWidth={2.2} />
                  </div>

                  <span className="text-[11.5px] font-bold text-zinc-800 dark:text-zinc-200">
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
                  
                  {/* Styled Arrow Link matching reference mock */}
                  <div style={{ color: isExpanded ? '#FF5A0A' : '#71717a' }} className="flex items-center justify-center pl-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Dynamic Accordion Body */}
              {isExpanded && (
                <div className="px-10 pb-3 pt-0.5 bg-zinc-50/50 dark:bg-zinc-950/30 animate-[fadeIn_0.15s_ease-out]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-zinc-100 dark:border-zinc-800/80 pt-2">
                    {/* Left block: details list */}
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-bold block">
                        Record Information
                      </span>
                      <div className="text-[11px] text-zinc-650 dark:text-zinc-350 font-bold">
                        {n.details.table}
                      </div>
                      <div className="space-y-0.5">
                        {n.details.items.map((item, idx) => (
                          <div key={idx} className="text-[10px] text-zinc-500 dark:text-zinc-400">
                            {item.qty} × {item.name}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right block: metrics/stats */}
                    <div className="flex flex-col justify-between sm:items-end">
                      <div className="space-y-0.5 sm:text-right">
                        <span className="text-[9px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-bold block">
                          Metric / Price
                        </span>
                        <div className="text-[14px] font-black text-zinc-800 dark:text-zinc-200">
                          {n.details.price}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mt-1">
                        <span className="w-1.2 h-1.2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider">
                          {n.details.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* DIGITORY AI LAYER Pill - strict single row on desktop/tablet */}
      <div 
        className="flex flex-row items-center bg-zinc-950 text-white rounded-2xl px-5 py-3 gap-3 justify-between w-[100%] overflow-hidden"
        style={{
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)"
        }}
      >
        <div className="flex items-center gap-1.5 text-[#FF5A0A] font-black tracking-widest text-[9.5px] shrink-0">
          <span className="w-1.5 h-1.5 bg-[#FF5A0A] rounded-xs rotate-45" />
          DIGITORY AI LAYER
        </div>

        <div className="flex items-center text-zinc-600 dark:text-zinc-800 self-stretch shrink-0 text-[11px] select-none">|</div>

        <div className="flex flex-row items-center justify-between gap-4 flex-1 text-[9.5px] text-zinc-400 font-semibold overflow-hidden">
          <div className="flex flex-col whitespace-nowrap">
            <span className="text-white font-bold text-[10px]">Predict Demand</span>
            <span className="text-zinc-500 text-[8.5px]">Know what's coming</span>
          </div>
          <div className="flex flex-col whitespace-nowrap">
            <span className="text-white font-bold text-[10px]">Detect Anomalies</span>
            <span className="text-zinc-500 text-[8.5px]">Spot issues early</span>
          </div>
          <div className="flex flex-col whitespace-nowrap">
            <span className="text-white font-bold text-[10px]">Optimise Operations</span>
            <span className="text-zinc-500 text-[8.5px]">Reduce waste</span>
          </div>
          <div className="flex flex-col whitespace-nowrap">
            <span className="text-white font-bold text-[10px]">Act in Real Time</span>
            <span className="text-zinc-500 text-[8.5px]">Intelligent • Automated</span>
          </div>
        </div>
      </div>
    </div>
  );
}
