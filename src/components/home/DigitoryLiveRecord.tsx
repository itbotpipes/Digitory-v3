"use client";

import React from "react";
import SolutionsDonutChart from "./SolutionsDonutChart";

/* PREVIOUS 12 STACKED CARDS CODE COMMENTED OUT:
import {
  CreditCard, QrCode, ClipboardList, Tv,
  Boxes, Archive, ChefHat, Sparkles,
  BarChart3, Users, ShoppingCart, TrendingUp,
  type LucideIcon
} from "lucide-react";

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
*/

export default function DigitoryLiveRecord() {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* 12 Solutions Donut Chart Section */}
      <SolutionsDonutChart />
    </div>
  );
}

