'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Cpu
} from 'lucide-react';
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
    sub: "Fast â€¢ Accurate",
    x: 23, y: 8,
    icon: CreditCard,
    details: {
      table: "Counter 02",
      time: "08:43 PM",
      items: [
        { name: "Cheese Garlic Bread", qty: 1 },
        { name: "Cold Brew Coffee", qty: 2 }
      ],
      price: "â‚¹450",
      status: "BILLING",
      statusColor: "text-orange-500"
    }
  },
  {
    id: 2,
    num: "02",
    title: "QR Ordering",
    sub: "Contactless â€¢ Quick",
    x: 50, y: 2,
    icon: QrCode,
    details: {
      table: "Table 04",
      time: "08:45 PM",
      items: [
        { name: "Virgin Mojito", qty: 2 },
        { name: "Peri Peri Fries", qty: 1 }
      ],
      price: "â‚¹380",
      status: "QR ORDERED",
      statusColor: "text-blue-500"
    }
  },
  {
    id: 3,
    num: "03",
    title: "Order Management",
    sub: "Track â€¢ Manage",
    x: 77, y: 8,
    icon: ClipboardList,
    details: {
      table: "KOT #412",
      time: "08:46 PM",
      items: [
        { name: "Veg Hakka Noodles", qty: 1 },
        { name: "Chilli Paneer Dry", qty: 1 }
      ],
      price: "â‚¹540",
      status: "DISPATCHED",
      statusColor: "text-purple-500"
    }
  },
  {
    id: 4,
    num: "04",
    title: "Kitchen Display",
    sub: "Real-time â€¢ Clear",
    x: 91, y: 24,
    icon: Tv,
    details: {
      table: "Station 1 (Mains)",
      time: "08:48 PM",
      items: [
        { name: "Dal Makhani", qty: 1 },
        { name: "Lachha Paratha", qty: 3 }
      ],
      price: "â‚¹410",
      status: "COOKING",
      statusColor: "text-amber-500"
    }
  },
  {
    id: 5,
    num: "05",
    title: "Smart Stock Counting",
    sub: "Live â€¢ Automated",
    x: 93, y: 50,
    icon: Boxes,
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
    sub: "GRN â€¢ PO â€¢ Vendors",
    x: 91, y: 76,
    icon: Archive,
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
    sub: "Costed â€¢ Consistent",
    x: 77, y: 92,
    icon: ChefHat,
    details: {
      table: "Dish Costing",
      time: "08:52 PM",
      items: [
        { name: "Paneer Tikka (Recipe)", qty: "Cost: â‚¹110" },
        { name: "Selling Price", qty: "Price: â‚¹320" }
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
    sub: "Cashless â€¢ Engaging",
    x: 50, y: 98,
    icon: Sparkles,
    details: {
      table: "VVIP Event",
      time: "08:54 PM",
      items: [
        { name: "Entry Cover Charge", qty: "25 Ppl" },
        { name: "VIP Table Booking", qty: "2 Tables" }
      ],
      price: "â‚¹45,000",
      status: "CASHLESS",
      statusColor: "text-rose-500"
    }
  },
  {
    id: 9,
    num: "09",
    title: "Business Analytics",
    sub: "Cost â€¢ Revenue â€¢ Profit",
    x: 23, y: 92,
    icon: BarChart3,
    details: {
      table: "EOD Summary",
      time: "08:55 PM",
      items: [
        { name: "Net Sales Today", qty: "â‚¹1,24,500" },
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
    sub: "CRM â€¢ Rewards",
    x: 9, y: 76,
    icon: Users,
    details: {
      table: "Member #482",
      time: "08:56 PM",
      items: [
        { name: "Siddharth Sharma", qty: "Gold" },
        { name: "Points Redeemed", qty: "320 pts" }
      ],
      price: "â‚¹120 Disc",
      status: "REWARDED",
      statusColor: "text-pink-500"
    }
  },
  {
    id: 11,
    num: "11",
    title: "Procurement",
    sub: "Purchase â€¢ Control",
    x: 7, y: 50,
    icon: ShoppingCart,
    details: {
      table: "Vendor Portal",
      time: "08:58 PM",
      items: [
        { name: "Poultry Supplier Ltd", qty: "Chicken" },
        { name: "Price Approved", qty: "â‚¹240/kg" }
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
    sub: "Profit â€¢ Optimised",
    x: 9, y: 24,
    icon: TrendingUp,
    details: {
      table: "Menu Matrix",
      time: "09:00 PM",
      items: [
        { name: "Butter Chicken", qty: "Star â­" },
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
  price: "â‚¹860",
  status: "LIVE",
  statusColor: "text-emerald-500"
};

export default function Hero() {
  const router = useRouter();
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const trustCircles = [
    { text: 'R', bg: 'bg-[#ECECEC]', textCol: 'text-zinc-600' },
    { text: 'C', bg: 'bg-[#D2E9E9]', textCol: 'text-teal-600' },
    { text: 'B', bg: 'bg-[#FFE5D9]', textCol: 'text-orange-600' },
    { text: 'K', bg: 'bg-[#E8EAFF]', textCol: 'text-indigo-600' },
  ];

  const activeNode = serviceNodes.find(n => n.id === hoveredNode);
  const activeDetails = activeNode ? activeNode.details : defaultDetails;

  return (
    <section className="mx-auto max-w-7xl px-6 md:px-8 pt-4 pb-10 md:pt-6 md:pb-16 lg:pt-8 lg:pb-20">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-center">

        {/* Left Copy Column */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6 md:space-y-8">
          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
            Manage busy hours <span className="text-[#FF4F18]">with ease</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-xl leading-relaxed">
            From billing and inventory to customer loyalty and reports, Digitory helps you run your restaurant smoothly and grow your business.
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
          <div className="flex items-center gap-4 pt-4 border-t border-zinc-100">
            <div className="flex -space-x-3">
              {trustCircles.map((circle, idx) => (
                <div
                  key={idx}
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${circle.bg} ${circle.textCol} font-extrabold text-xs border-2 border-white`}
                >
                  {circle.text}
                </div>
              ))}
            </div>
            <p className="text-xs md:text-sm text-zinc-500 max-w-xs leading-normal">
              Trusted by restaurants, cafÃ©s, bars, breweries and cloud kitchens across India.
            </p>
          </div>
        </div>

        {/* Right Column with stable height container - reduced from col-span-7 to col-span-6 and width constrained */}
        <div className="lg:col-span-6 flex flex-col items-center justify-start w-full select-none min-h-[580px] lg:h-[580px] max-w-[530px] ml-auto">
          <DigitoryLiveRecord />
        </div>

      </div>
    </section>
  );
}


