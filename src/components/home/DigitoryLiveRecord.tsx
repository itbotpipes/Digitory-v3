"use client";

import React, { useState } from "react";
import {
  CreditCard, QrCode, ClipboardList, Tv,
  Boxes, Archive, ChefHat, Sparkles,
  BarChart3, Users, ShoppingCart, TrendingUp,
  type LucideIcon,
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
  svgX: number;
  svgY: number;
  anchorX: "left" | "center" | "right";
  anchorY: "top" | "center" | "bottom";
  details: NodeDetails;
}

const NODES: Node[] = [
  { 
    id: 1,  
    num: "01", 
    title: "POS & Billing",         
    sub: "Fast • Accurate",          
    Icon: CreditCard,   
    svgX: 220, 
    svgY: 125,  
    anchorX: "right",  
    anchorY: "bottom",
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
    svgX: 350, 
    svgY: 90,  
    anchorX: "center", 
    anchorY: "bottom",
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
    svgX: 480, 
    svgY: 125,  
    anchorX: "left",   
    anchorY: "bottom",
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
    svgX: 575, 
    svgY: 220, 
    anchorX: "left",   
    anchorY: "center",
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
    svgX: 610, 
    svgY: 350, 
    anchorX: "left",   
    anchorY: "center",
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
    svgX: 575, 
    svgY: 480, 
    anchorX: "left",   
    anchorY: "center",
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
    Icon: ChefHat,      
    svgX: 480, 
    svgY: 575, 
    anchorX: "left",   
    anchorY: "top",
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
    svgX: 350, 
    svgY: 610, 
    anchorX: "center", 
    anchorY: "top",
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
    svgX: 220, 
    svgY: 575, 
    anchorX: "right",  
    anchorY: "top",
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
    svgX: 125,  
    svgY: 480, 
    anchorX: "right",  
    anchorY: "center",
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
    svgX: 90,  
    svgY: 350, 
    anchorX: "right",  
    anchorY: "center",
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
    svgX: 125,  
    svgY: 220, 
    anchorX: "right",  
    anchorY: "center",
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

const DEFAULT_DETAILS: NodeDetails = {
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

export default function DigitoryLiveRecord() {
  const [hoveredNodeId, setHoveredNodeId] = useState<number | null>(null);

  const activeDetails = hoveredNodeId 
    ? NODES.find(n => n.id === hoveredNodeId)?.details || DEFAULT_DETAILS
    : DEFAULT_DETAILS;

  return (
    <div className="digitory-visual">
      {/* SVG network layer */}
      <NetworkSVG hoveredNodeId={hoveredNodeId} />

      {/* 12 service node cards */}
      {NODES.map((n) => (
        <NodeCard 
          key={n.id} 
          node={n} 
          isHovered={hoveredNodeId === n.id}
          onMouseEnter={() => setHoveredNodeId(n.id)}
          onMouseLeave={() => setHoveredNodeId(null)}
        />
      ))}

      {/* Central 3D hardware stack using Layer 1.png */}
      <div className="record-stack" style={{ 
        position: 'relative', 
        width: '330px', 
        height: '330px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        {/* The physical device image */}
        <img 
          src="/Layer 1.png" 
          alt="Digitory Live Record" 
          style={{ 
            width: '100%', 
            height: 'auto', 
            objectFit: 'contain',
            pointerEvents: 'none'
          }} 
        />
      </div>
    </div>
  );
}

/* ── Node card ── */
function NodeCard({ 
  node, 
  isHovered, 
  onMouseEnter, 
  onMouseLeave 
}: { 
  node: Node; 
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const { Icon, svgX, svgY, anchorX, anchorY, num, title, sub } = node;

  const leftPct = (svgX / 700) * 100;
  const topPct  = (svgY / 700) * 100;

  const translateX =
    anchorX === "left"   ? "0%"    :
    anchorX === "right"  ? "-100%" : "-50%";
  const translateY =
    anchorY === "top"    ? "0%"    :
    anchorY === "bottom" ? "-100%" : "-50%";

  return (
    <div
      style={{
        position: "absolute",
        left: `${leftPct}%`,
        top:  `${topPct}%`,
        transform: `translate(${translateX}, ${translateY})`,
        zIndex: 10,
        cursor: "pointer",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "#fff",
        border: isHovered ? "1px solid #FF5A0A" : "1px solid rgba(0,0,0,0.07)",
        borderRadius: "14px",
        padding: "8px 11px",
        boxShadow: isHovered 
          ? "0 4px 14px rgba(255,90,10,0.18)" 
          : "0 2px 10px rgba(0,0,0,0.06)",
        whiteSpace: "nowrap",
        minWidth: "130px",
        transition: "all 0.2s ease-in-out",
      }}>
        <div style={{
          flexShrink: 0,
          width: "30px",
          height: "30px",
          borderRadius: "8px",
          background: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease-in-out",
        }}>
          <Icon size={14} color="#FF5A0A" strokeWidth={1.8} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
          <span style={{ fontSize: "8px", fontWeight: 800, color: "#FF5A0A", lineHeight: 1 }}>{num}</span>
          <span style={{ fontSize: "9.5px", fontWeight: 700, color: "#111", lineHeight: 1.2 }}>{title}</span>
          <span style={{ fontSize: "7.5px", color: "#aaa", lineHeight: 1 }}>{sub}</span>
        </div>
      </div>
    </div>
  );
}

/* ── SVG connector lines ── */
function NetworkSVG({ hoveredNodeId }: { hoveredNodeId: number | null }) {
  const center = { x: 350, y: 350 };

  return (
    <svg
      className="network-bg"
      viewBox="0 0 700 700"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="blurGlow">
          <feGaussianBlur stdDeviation="12" />
        </filter>
        <radialGradient id="orangeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#FF6A00" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#FF6A00" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Connector lines */}
      <g strokeLinecap="round" fill="none">
        {NODES.map((n) => {
          const isHovered = hoveredNodeId === n.id;
          const mx = (n.svgX + center.x) / 2;
          const my = (n.svgY + center.y) / 2;
          return (
            <path
              key={n.id}
              d={`M ${n.svgX} ${n.svgY} Q ${mx} ${my} ${center.x} ${center.y}`}
              stroke={isHovered ? "#FF5A0A" : "#FF7A2D"}
              strokeWidth={isHovered ? 2 : 1.3}
              strokeOpacity={isHovered ? 0.7 : 0.22}
              style={{ transition: "all 0.2s ease-in-out" }}
            />
          );
        })}
      </g>

      {/* Dots at node positions */}
      <g fill="#FF5A0A">
        {NODES.map((n) => {
          const isHovered = hoveredNodeId === n.id;
          return (
            <circle 
              key={n.id} 
              cx={n.svgX} 
              cy={n.svgY} 
              r={isHovered ? 4.5 : 3.5} 
              style={{ transition: "all 0.2s ease-in-out" }}
            />
          );
        })}
      </g>
    </svg>
  );
}

function DigitoryMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="3"  y="3"  width="9"  height="9"  rx="1.5" fill="#FF5A0A" />
      <rect x="10" y="10" width="15" height="15" rx="2"   fill="#FF5A0A" />
      <rect x="13" y="13" width="6"  height="6"  rx="1"   fill="white"   />
    </svg>
  );
}
