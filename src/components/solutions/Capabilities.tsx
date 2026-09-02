"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

interface FeatureItem {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  image?: string;
  isComingSoon?: boolean;
}

interface FeatureGroup {
  name: string;
  items: FeatureItem[];
}

function renderHighlightedText(text: string) {
  if (!text) return null;
  const parts = text.split(/(\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('*') && part.endsWith('*')) {
          return (
            <span key={index} className="text-[#FF4F18]">
              {part.slice(1, -1)}
            </span>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </>
  );
}

export default function Capabilities() {
  const router = useRouter();

  const [groupedFeatures, setGroupedFeatures] = useState<FeatureGroup[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All Solutions");
  const [gridTitle, setGridTitle] = useState('Twelve powerful features to help *your restaurant run better*');
  const [gridDesc, setGridDesc] = useState('Click on any feature card below to open its full specifications and details on a new page.');
  const [loading, setLoading] = useState(true);

  const staticGroups: FeatureGroup[] = [
    {
      name: "Run Operations",
      items: [
        {
          id: "pos",
          title: "POS & Billing",
          desc: "Billing that keeps up. Dine-in, online, direct — every order and every payment through one fast, reliable system.",
          icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
        },
        {
          id: "qr-ordering",
          title: "QR Code Ordering",
          desc: "Let guests order themselves. Guests scan, order, and pay from the table — synced live with your waiter app and kitchen so food moves faster.",
          icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1v6M4 9h16M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" />
            </svg>
          ),
        },
        {
          id: "kds",
          title: "Kitchen Display System (KDS)",
          desc: "The kitchen, in sync. Every ticket hits the right station instantly. Less shouting, less confusion, faster plates.",
          icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
        {
          id: "booking",
          title: "Table Reservations",
          desc: "Fill every table. Take bookings, manage covers, seat guests — no paper diary, no double-booking.",
          isComingSoon: true,
          icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ),
        }
      ]
    },
    {
      name: "Manage Inventory & Menu",
      items: [
        {
          id: "inventory",
          title: "Inventory Management",
          desc: "Inventory that thinks ahead. Every dish deducts stock automatically. Know what's running low before your chef does.",
          icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7.5l-8 4-8-4M12 11.5v9M20 7.5v9l-8 4M20 7.5L12 3.5M4 7.5v9l8 4M4 7.5L12 3.5" />
            </svg>
          ),
        },
        {
          id: "recipe-management",
          title: "Recipe Management",
          desc: "Cost every plate. Lock recipes, portions and costs so margins hold — even when prices move and staff change.",
          icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          ),
        },
        {
          id: "menu-engineering",
          title: "Menu Engineering",
          desc: "Optimize menu profitability. Analyze popularity, track food cost margins, and design high-yielding menus that boost bottom-line revenue.",
          icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          ),
        }
      ]
    },
    {
      name: "Grow & Understand",
      items: [
        {
          id: "reports",
          title: "Business Analytics",
          desc: "Your business, live. Sales, orders, inventory, outlet performance — everything you need to know, in one place, in real time.",
          icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          ),
        },
        {
          id: "loyalty",
          title: "Customer Loyalty & CRM",
          desc: "Regulars, not one-timers. Know who's coming back, reward them, and win the rest back with offers that actually land.",
          icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-3.75-3.75M19.5 12l-3.75 3.75m-11.25-3a9 9 0 1118 0 9 9 0 01-18 0z" />
            </svg>
          ),
        }
      ]
    },
    {
      name: "Scale & Specialize",
      items: [
        {
          id: "control-system",
          title: "Multi-Outlet Management",
          desc: "One outlet or twenty. Full visibility across every location without chasing managers or waiting on end-of-day reports.",
          icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          ),
        },
        {
          id: "event-management",
          title: "Clubs & Events",
          desc: "Cashless, end to end. Prepaid ticketing to final settlement — run high-volume events with no cash handling and no leakage.",
          icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
          ),
        },
        {
          id: "payroll",
          title: "Shift & Payroll Hub",
          desc: "Log worker attendance checklists, configure monthly shift schedules, track server table zones, and manage salary reports.",
          icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
        },
        {
          id: "central-kitchen",
          title: "Central Prep Kitchen",
          desc: "Manage batch preparation formulas, track raw material shipping to outlets, and maintain consistent dish recipes centrally.",
          icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2h-2" />
            </svg>
          ),
        }
      ]
    }
  ];

  const categoriesList = ["All Solutions", ...groupedFeatures.map(g => g.name)];
  const filteredGroups = activeCategory === "All Solutions" 
    ? groupedFeatures 
    : groupedFeatures.filter(g => g.name === activeCategory);

  useEffect(() => {
    async function loadSolutions() {
      try {
        const res = await api.get('/solutions?limit=30');
        const loaded = res.data?.docs || res.data?.results || res.data || [];
        
        if (loaded && loaded.length > 0) {
          // Flat list of static items for fallback icons
          const staticItems = staticGroups.flatMap(group =>
            group.items.map(item => ({
              ...item,
              category: group.name
            }))
          );

          // Map backend data directly
          const updatedItems = loaded.map((s: any) => {
            const staticItem = staticItems.find(f => f.id === s.slug);
            const hasCustomCategory = s.category && s.category !== "Core Operations";
            const itemCategory = hasCustomCategory ? s.category : (staticItem?.category || "Run Operations");

            // Fallback to staticItem values if database fields are missing or match the slug
            const isTitleSlug = s.title === s.slug;
            const titleVal = s.gridTitle && s.gridTitle.trim() !== '' 
              ? s.gridTitle 
              : (s.title && s.title.trim() !== '' && !isTitleSlug ? s.title : (staticItem?.title || s.title || ''));
            
            const descVal = s.gridDesc && s.gridDesc.trim() !== '' 
              ? s.gridDesc 
              : (s.description && s.description.trim() !== '' ? s.description : (s.subtitle && s.subtitle.trim() !== '' ? s.subtitle : (staticItem?.desc || '')));

            return {
              id: s.slug || s._id,
              title: titleVal,
              desc: descVal,
              image: s.image || '',
              category: itemCategory,
              icon: s.icon || staticItem?.icon || null,
              isComingSoon: s.slug === 'booking' || s.isComingSoon || staticItem?.isComingSoon || false,
            };
          });

          // Reconstruct dynamic groups ordered by standard categories first
          const categoriesOrder = ["Run Operations", "Manage Inventory & Menu", "Grow & Understand", "Scale & Specialize"];
          const uniqueCategories = Array.from(new Set<string>(updatedItems.map((item: any) => item.category as string)));
          
          const sortedCategories = uniqueCategories.sort((a: string, b: string) => {
            const indexA = categoriesOrder.indexOf(a);
            const indexB = categoriesOrder.indexOf(b);
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return a.localeCompare(b);
          });

          const newGroups: FeatureGroup[] = sortedCategories.map((catName: string) => ({
            name: catName,
            items: updatedItems.filter((item: any) => item.category === catName)
          })).filter(g => g.items.length > 0);

          setGroupedFeatures(newGroups);
        } else {
          setGroupedFeatures(staticGroups);
        }
      } catch (err) {
        console.warn('Failed to load solutions from backend:', err);
        setGroupedFeatures(staticGroups);
      } finally {
        setLoading(false);
      }
    }

    async function loadSettings() {
      try {
        const res = await api.get('/settings');
        if (res.data) {
          if (res.data.solutionsGridTitle) setGridTitle(res.data.solutionsGridTitle);
          if (res.data.solutionsGridDesc) setGridDesc(res.data.solutionsGridDesc);
        }
      } catch (err) {
        console.warn('Failed to load settings:', err);
      }
    }

    loadSolutions();
    loadSettings();
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 mb-12 md:mb-16 items-start">
          <div className="lg:col-span-7">
            <div className="h-10 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
          </div>
          <div className="lg:col-span-5 lg:pt-2">
            <div className="h-6 w-full bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse mb-2" />
            <div className="h-6 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="space-y-16">
          <div className="h-40 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-16">
      
      {/* Header Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 mb-12 md:mb-16 items-start">
        <div className="lg:col-span-7">
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-[850] tracking-tight text-[#111111] dark:text-white leading-[1.15]">
            {renderHighlightedText(gridTitle)}
          </h2>
        </div>
        <div className="lg:col-span-5 text-sm md:text-base text-zinc-650 dark:text-zinc-400 leading-relaxed lg:pt-2">
          <p>
            {gridDesc}
          </p>
        </div>
      </div>

      {/* Categories Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 md:pb-8 border-b border-zinc-200/60 dark:border-zinc-800/60 mb-12 md:mb-16">
        <nav className="flex flex-wrap items-center gap-4 sm:gap-6 md:gap-8 justify-start">
          {categoriesList.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`text-sm font-medium transition-colors cursor-pointer pb-2 -mb-[9px] ${isActive
                  ? 'text-zinc-900 dark:text-white font-bold border-b-2 border-[#FF4F18]'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
              >
                {category}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Structured Groups */}
      <div className="space-y-16 md:space-y-24">
        {filteredGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="flex flex-col md:flex-row gap-8 lg:gap-12">
            {/* Group Title Column */}
            <div className="w-full md:w-1/5 shrink-0">
              <div className="sticky top-24 pt-2">
                <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">
                  {group.name}
                </h3>
                <div className="w-12 h-1 bg-[#FF4F18] rounded-full"></div>
              </div>
            </div>
            
            {/* Group Items Grid with border lines */}
            <div className="w-full md:w-4/5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl overflow-hidden bg-white dark:bg-[#121214]">
                {group.items.map((item) => {
                  const cellContent = (
                    <div className="h-full p-6 flex flex-col justify-start transition-colors duration-200 border-r border-b border-zinc-200/80 dark:border-zinc-800/80 group-hover:bg-zinc-50/90 dark:group-hover:bg-zinc-900/50">
                      
                      {item.isComingSoon && (
                        <div className="mb-3">
                          <span className="text-[10px] uppercase tracking-widest font-extrabold text-[#FF4F18] bg-[#FFF3EF] dark:bg-[#FF4F18]/10 px-2.5 py-1 rounded-full border border-orange-100 dark:border-transparent">
                            Coming Soon
                          </span>
                        </div>
                      )}

                      {item.image ? (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4 bg-zinc-50 dark:bg-zinc-900">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        item.icon && (
                          <div className="mb-4 text-[#FF4F18] shrink-0">
                            {typeof item.icon === 'string' ? (
                              item.icon.trim().startsWith('<svg') ? (
                                <div className="w-6 h-6 [&>svg]:w-full [&>svg]:h-full flex items-center justify-center" dangerouslySetInnerHTML={{ __html: item.icon }} />
                              ) : (
                                <span className="text-xs font-mono">{item.icon}</span>
                              )
                            ) : (
                              <div className="w-6 h-6 flex items-center justify-center">{item.icon}</div>
                            )}
                          </div>
                        )
                      )}

                      <h4 className="text-base font-bold text-zinc-950 dark:text-white mb-2 leading-snug group-hover:text-[#FF4F18] transition-colors">{item.title}</h4>
                      <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  );

                  if (item.isComingSoon) {
                    return (
                      <div key={item.id} className="cursor-not-allowed opacity-75 filter grayscale-[40%] group">
                        {cellContent}
                      </div>
                    );
                  }

                  return (
                    <Link key={item.id} href={`/solutions/${item.id}`} className="cursor-pointer group block h-full">
                      {cellContent}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Digitory AI Layer */}
      <div className="mt-24 border border-zinc-200/60 dark:border-zinc-800/60 rounded-[32px] p-8 md:p-12 lg:p-16">
        <div className="max-w-4xl">
          <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6">
            Digitory <span className="text-[#FF4F18]">AI</span>
          </h3>
          
          <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-10 max-w-3xl">
            Forecasting, procurement, and anomaly detection built into every layer — so the system tells you what's coming, not just what happened. Not a bolt-on feature: a layer that touches inventory, procurement, analytics, and every outlet, and gets stronger with each release.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-5">
            <div className="flex items-start gap-3">
              <svg className="w-4 h-4 text-zinc-400 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[15px] font-medium text-zinc-700 dark:text-zinc-300">Forecast demand across menu and outlets</span>
            </div>
            
            <div className="flex items-start gap-3">
              <svg className="w-4 h-4 text-zinc-400 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[15px] font-medium text-zinc-700 dark:text-zinc-300">Auto-build purchase orders — buy what sells, cut waste</span>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-4 h-4 text-zinc-400 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[15px] font-medium text-zinc-700 dark:text-zinc-300">Spot anomalies before they cost you</span>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-4 h-4 text-zinc-400 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[15px] font-medium text-zinc-700 dark:text-zinc-300">Getting smarter with every feature we ship</span>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
