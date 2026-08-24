"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '../../../components/Header';
import FooterPage from '../../../components/Footer';
import OperationsReveal from '../../../components/solutions/OperationsReveal';
import BeliefsSection from '../../../components/about/BeliefsSection';
import ToolIntegrations from '../../../components/solutions/ToolIntegrations';
import RestaurantOS from '../../../components/home/RestaurantOS';
import FAQPage from '../../../components/home/FAQ';
import InsightsPage from '../../../components/home/Insights';
import { industriesDb, IndustryData } from '../../data/industriesDb';
import { api } from '@/lib/api';
import SolutionsDetailsCta from '../../../components/solutions/SolutionsDetailsCta';
/**
 * Helper to render highlighted text. 
 * E.g., "This is *highlighted* text" -> "This is <span className="text-[#FF4F18]">highlighted</span> text"
 */
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

function IndustriesDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const slugParam = params.slug as string;
  const moduleParam = slugParam ? slugParam.replace('details-', '') : null;
  const [activeKey, setActiveKey] = useState<string>("bars-restaurants");
  const [industriesList, setIndustriesList] = useState<IndustryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);
  const [activeOutlet, setActiveOutlet] = useState<number>(1);
  const [outletSimState, setOutletSimState] = useState<"idle" | "loading" | "success">("idle");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setActiveOutlet(1);
    setOutletSimState("idle");
  }, [activeKey]);

  useEffect(() => {
    const loadIndustriesData = async () => {
      try {
        const res = await api.get('/industries?limit=20');
        const loaded: any[] = res.data?.docs || res.data?.results || res.data || [];
        if (loaded && loaded.length > 0) {
          const normalized: IndustryData[] = loaded.map((s: any) => ({
            id: s.slug || s._id,
            slug: s.slug || '',
            shortLabel: s.shortLabel || s.title || '',
            icon: null,
            title: s.title || '',
            badge: s.badge || '',
            subtitle: s.subtitle || '',
            description: s.description || '',
            ctaText: s.ctaText || 'Book a demo',
            trustText: s.trustText || 'Trusted by restaurants across India.',
            featuresTitle: s.featuresTitle || 'Key capabilities',
            features: s.features || [],
            whyChooseTitle: s.whyChooseTitle || 'Why choose Digitory?',
            whyChoose: s.whyChoose || [],
            ctaBlock: s.ctaBlock || { title: 'Ready to grow?', desc: 'Talk to us today.' },
            heroImage: s.heroImage || '',
            image: s.image || '',
            gridTitle: s.gridTitle || '',
            gridDesc: s.gridDesc || '',
            opsTitle: s.opsTitle || '',
            opsParagraph: s.opsParagraph || '',
            opsHighlights: s.opsHighlights || '',
            heroTitle: s.heroTitle || '',
            legacyTitle: s.legacyTitle || '',
            legacyItems: s.legacyItems || [],
            workflowTitle: s.workflowTitle || '',
            workflowDesc: s.workflowDesc || '',
            workflowItems: s.workflowItems || [],
            controlTitle: s.controlTitle || '',
            controlDesc: s.controlDesc || '',
            controlItems: s.controlItems || [],
            efficiencyTitle: s.efficiencyTitle || '',
            efficiencyItems: s.efficiencyItems || [],
            faqs: s.faqs || [],
          }));

          const merged = normalized.map(item => {
            const staticEntry = industriesDb[item.id];
            return staticEntry ? { ...item, icon: staticEntry.icon } : item;
          });

          setIndustriesList(merged);
        } else {
          setIndustriesList(Object.values(industriesDb));
        }
      } catch (err) {
        console.warn('Backend offline or failed to fetch industries. Using local static fallback:', err);
        setIndustriesList(Object.values(industriesDb));
      } finally {
        setLoading(false);
      }
    };

    loadIndustriesData();
  }, []);

  useEffect(() => {
    if (moduleParam) {
      setActiveKey(moduleParam);
    } else if (industriesList.length > 0) {
      setActiveKey(industriesList[0].id || 'bars-restaurants');
    }
  }, [moduleParam, industriesList]);

  const industry = industriesList.find(s => s.id === activeKey || (s as any).slug === activeKey) || industriesList[0] || Object.values(industriesDb)[0];

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0d0d0e] flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#FF4F18] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    );
  }

  if (!industry) return null;

  const getIndustryStats = (id: string) => {
    switch (id) {
      case 'bars-restaurants':
        return [
          { label: 'Table Turnaround Speed', value: '+22%', desc: 'Faster order taking and digital billing KOTs' },
          { label: 'Liquor Variance Rate', value: '<1.5%', desc: 'Accurate peg-level inventory audits' },
          { label: 'Daily Admin Labor', value: '-2 Hrs', desc: 'Auto-reconciled cashless payments' },
          { label: 'Happy Hour Sales', value: '+40%', desc: 'Dynamic pricing and automated menus' },
        ];
      case 'nightclubs':
        return [
          { label: 'Entry Queue Checkin', value: '4.8s', desc: 'Secure high-speed digital passes' },
          { label: 'Peak Hour Bar Billing', value: '12s', desc: 'Mobile POS taps and QR tabs' },
          { label: 'Leakage & Spillage Control', value: '-95%', desc: 'Real-time bottle weight verification' },
          { label: 'Event ROI', value: '+55%', desc: 'Targeted promotions and table bookings' },
        ];
      case 'micro-breweries':
        return [
          { label: 'Brew Recipe Consistency', value: '100%', desc: 'Standardized batch ingredient tracking' },
          { label: 'Average Ticket Value', value: '+18%', desc: 'Upselling with smart combo notifications' },
          { label: 'Keg Inventory Variance', value: '<0.8%', desc: 'Automated taproom scale integration' },
          { label: 'Direct Tap Sales', value: '+32%', desc: 'Self-serve QR ordering tables' },
        ];
      case 'qsr':
        return [
          { label: 'Average Order Processing', value: '15s', desc: 'Simplified queue busting cashier flow' },
          { label: 'Recipe Ingredient Waste', value: '-30%', desc: 'Automated POS to stock decrement' },
          { label: 'Menu Push to Zomato', value: 'Instant', desc: 'Update prices and status globally' },
          { label: 'Order Accuracy', value: '99.9%', desc: 'Integrated kitchen display systems' },
        ];
      default:
        return [
          { label: 'Daily Service Speed', value: '+25%', desc: 'No paper slip delays or manual coordination' },
          { label: 'Inventory Cost Saved', value: '12%', desc: 'Smarter batching and real-time alerts' },
          { label: 'Customer Retention Rate', value: '+35%', desc: 'Automated loyalty campaigns' },
          { label: 'Multi-Outlet Sync', value: '100%', desc: 'Real-time data aggregation globally' },
        ];
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0d0e] transition-colors duration-300 flex flex-col font-sans">
      <Header />

      <main className="flex-grow bg-white dark:bg-[#0d0d0e]">

        {/* HERO SECTION */}
        <section className="mx-auto max-w-7xl px-6 md:px-8 py-12 md:py-20 bg-white dark:bg-[#0d0d0e]">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-center">

            {/* Left Column: Title & Intro */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6 md:space-y-8 text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
                {industry.heroTitle ? (
                  renderHighlightedText(industry.heroTitle)
                ) : (
                  <>
                    Optimized operations for <br />
                    <span className="text-[#FF4F18]">{industry.title}</span>
                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-xl leading-relaxed">
                {industry.description}
              </p>

              <div className="flex flex-wrap gap-4 items-center">
                <button className="inline-flex justify-center items-center text-center rounded-full bg-[#FF4F18] px-8 py-3.5 text-[15px] font-bold text-white transition-all duration-200 hover:bg-[#E03F0D] shadow-[0_8px_20px_rgba(255,79,24,0.35)] hover:shadow-[0_10px_24px_rgba(255,79,24,0.45)] active:scale-[0.98] cursor-pointer">
                  {industry.ctaText || 'Book a Demo'}
                </button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-4 pt-6 border-t border-zinc-100 dark:border-zinc-800/80 max-w-sm">
                <div className="flex -space-x-3">
                  {[
                    { text: 'R', bg: 'bg-[#ECECEC]', textCol: 'text-zinc-600' },
                    { text: 'C', bg: 'bg-[#D2E9E9]', textCol: 'text-teal-600' },
                    { text: 'B', bg: 'bg-[#FFE5D9]', textCol: 'text-orange-600' },
                    { text: 'K', bg: 'bg-[#E8EAFF]', textCol: 'text-indigo-600' },
                  ].map((circle, idx) => (
                    <div
                      key={idx}
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${circle.bg} ${circle.textCol} font-extrabold text-xs border-2 border-white dark:border-zinc-900`}
                    >
                      {circle.text}
                    </div>
                  ))}
                </div>
                <p className="text-xs md:text-sm text-zinc-500 max-w-xs leading-normal">
                  {industry.trustText || "Trusted by restaurants, cafés, bars, breweries and cloud kitchens across India."}
                </p>
              </div>
            </div>

            {/* Right Column: Interactive Outlet Data Simulator */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end w-full relative">
              <div className="w-full max-w-[450px] bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-[28px] p-6 md:p-8 relative overflow-hidden flex flex-col gap-5 select-none text-left">
                {/* Visual Header */}
                <div className="flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800/80 pb-4">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF4F18]">
                    Multi-Outlet Live Sync
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#10B981]">Live</span>
                  </span>
                </div>

                {/* Outlet Selection Tabs */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block mb-0.5">Select Active Outlet:</span>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((num) => {
                      const isActive = activeOutlet === num;
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => {
                            setActiveOutlet(num);
                            setOutletSimState("idle");
                          }}
                          className={`flex flex-col items-center justify-center py-2.5 px-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                            isActive
                              ? "bg-[#FF4F18] border-[#FF4F18] text-white shadow-[0_4px_14px_rgba(255,79,24,0.3)]"
                              : "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 text-zinc-655 dark:text-zinc-300 hover:border-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          }`}
                        >
                          <span className="text-xs font-black">Outlet 0{num}</span>
                          <span className={`text-[9px] font-bold mt-0.5 ${isActive ? "text-white/95" : "text-zinc-400 dark:text-zinc-500"}`}>
                            {num === 1 ? "Active" : num === 2 ? "Busy" : "Closed"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Outlet Data Display */}
                <div className="bg-[#F8F9FA] dark:bg-zinc-800/50 p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/80 space-y-3 min-h-[150px] flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-zinc-400 font-extrabold">
                      <span>Outlet Status</span>
                      <span className="text-[#10B981] font-bold">Connected</span>
                    </div>
                    <h5 className="text-[13px] font-black text-zinc-900 dark:text-white">
                      Outlet 0{activeOutlet} Metrics
                    </h5>
                    <p className="text-[11.5px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-semibold">
                      Real-time telemetry from Outlet 0{activeOutlet} POS, Inventory, and Kitchen.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-zinc-200/60 dark:border-zinc-700/60 text-[9px] font-bold text-zinc-450 dark:text-zinc-500">
                    <div>
                      <span className="block text-[7px] uppercase tracking-wider text-zinc-455">Total Orders</span>
                      <span className="text-zinc-900 dark:text-white font-extrabold text-[11px]">
                        {activeOutlet === 1 ? "342" : activeOutlet === 2 ? "512" : "188"}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[7px] uppercase tracking-wider text-zinc-455">Inventory Avail.</span>
                      <span className="text-zinc-900 dark:text-white font-extrabold text-[11px]">
                        {activeOutlet === 1 ? "94%" : activeOutlet === 2 ? "72%" : "45%"}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[7px] uppercase tracking-wider text-zinc-455">Total Sales</span>
                      <span className="text-zinc-900 dark:text-white font-extrabold text-[11px]">
                        {activeOutlet === 1 ? "₹89,400" : activeOutlet === 2 ? "₹1,32,000" : "₹42,300"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Simulation Trigger Button */}
                <div>
                  <button
                    type="button"
                    onClick={() => router.push("/request-demo")}
                    className="w-full inline-flex justify-center items-center gap-2 text-center rounded-full px-6 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 active:scale-[0.98] cursor-pointer bg-[#FF4F18] hover:bg-[#E03F0D]"
                  >
                    Check your restaurant’s details
                  </button>
                </div>

                {/* Footer Tagline inside widget */}
                <div className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold border-t border-zinc-200/60 dark:border-zinc-800/80 pt-4 flex justify-between">
                  <span>System: DIGI-OS v4.2</span>
                  <span>Region: AP-SOUTH</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION: THE OPERATIONAL REALITY OF INDUSTRY */}
        <OperationsReveal 
          title={
            industry.opsTitle ? (
              <span dangerouslySetInnerHTML={{ __html: industry.opsTitle }} />
            ) : (
              <span>
                Managing high volume hospitality requires <span className="text-[#FF4F18]">precision at scale</span>
              </span>
            )
          }
          words={
            industry.opsParagraph
              ? industry.opsParagraph.split(/\s+/)
              : `Whether coordinating busy table rosters or keeping bar tabs updated instantly, ${industry.title} operations require a synchronized platform to manage the continuous rush. Manual checks waste hours, while disjointed setups lead to critical slip-ups. Digitory replaces multiple point systems with one unified interface. This enables staff to execute actions quickly and allows managers to track key parameters in real time.`.split(/\s+/)
          }
          highlights={
            industry.opsHighlights
              ? industry.opsHighlights.split(',').map(h => h.trim())
              : ["precision", "scale", "synchronized", "rush", "waste", "slip-ups", "unified", "real", "time"]
          }
        />

        {/* SECTION: WHERE TRADITIONAL OPERATIONS BREAK DOWN */}
        <section className="bg-white dark:bg-[#0d0d0e] py-10 md:py-16 text-left">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-[44px] font-[850] tracking-tight text-zinc-900 dark:text-white leading-[1.15]">
                {industry.legacyTitle ? (
                  renderHighlightedText(industry.legacyTitle)
                ) : (
                  <>Where legacy systems <span className="text-[#FF4F18]">fail {industry.shortLabel}</span></>
                )}
              </h2>
            </div>

            <div className="space-y-0 divide-y divide-zinc-100 dark:divide-zinc-900">
              {(industry.legacyItems && industry.legacyItems.length > 0 ? industry.legacyItems : [
                {
                  title: 'Lagging Inventory Reconciliation',
                  body: 'Taking stock manually at the end of the day leads to high inventory variance and stock shrinkage that goes unnoticed for weeks.',
                  stat: '40%',
                  statLabel: 'average inventory variance undetected'
                },
                {
                  title: 'Kitchen and Floor Disconnection',
                  body: 'Lost or delayed paper tickets result in extended customer wait times, cold food, and disappointed regulars.',
                  stat: '15m',
                  statLabel: 'order delay during peak rush hours'
                },
                {
                  title: 'Siloed Multi-Outlet Reporting',
                  body: 'Calculating regional performance across multiple outlets manually creates reporting lag and prevents quick operational adjustments.',
                  stat: '3x',
                  statLabel: 'reporting lag across separate venues'
                },
              ]).map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-4 md:gap-8 py-8 items-center"
                >
                  <div className="col-span-2 md:col-span-1 pt-1 text-left">
                    <span className="text-xs md:text-sm font-bold text-zinc-400 dark:text-zinc-500 select-none">
                      {`0${idx + 1}`}
                    </span>
                  </div>
                  <div className="col-span-10 md:col-span-8 space-y-2 text-left">
                    <h3 className="text-xl md:text-2xl font-[850] tracking-tight text-zinc-900 dark:text-white leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
                      {item.body}
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-3 flex flex-col md:items-end text-left md:text-right mt-4 md:mt-0">
                    <span className="text-2xl md:text-3xl font-extrabold text-[#FF4F18] tracking-tight">
                      {item.stat}
                    </span>
                    <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 mt-1 max-w-[200px]">
                      {item.statLabel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: HOW MODERN OPERATIONS NEED TO FUNCTION */}
        <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-16 bg-white dark:bg-[#0d0d0e]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-3xl sm:text-4xl md:text-[44px] font-[850] tracking-tight text-zinc-900 dark:text-white leading-[1.15]">
                {industry.workflowTitle ? (
                  renderHighlightedText(industry.workflowTitle)
                ) : (
                  <>A modern system should connect <span className="text-[#FF4F18]">every workflow automatically</span></>
                )}
              </h2>
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed pt-2">
                {industry.workflowDesc || "Operations should run like a clock. When an order is taken on the floor, it should instantly notify the kitchen, adjust raw material levels in the inventory, and log real-time numbers on the manager's screen."}
              </p>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {(industry.workflowItems && industry.workflowItems.length > 0 ? industry.workflowItems : [
                { n: '01 / Instant Routing', title: '01 / Instant Routing', desc: 'Real-time KOT updates prevent delays between floor staff and kitchen preparation.' },
                { n: '02 / Automated Audits', title: '02 / Automated Audits', desc: 'Real-time recipe deductions provide immediate clarity on ingredient usage.' },
                { n: '03 / Unified Dashboard', title: '03 / Unified Dashboard', desc: 'Consolidated insights eliminate manual spreadsheet reconciliation.' },
                { n: '04 / Central Control', title: '04 / Central Control', desc: 'Push menu, pricing, and tax updates to all locations in seconds.' }
              ]).map((wItem, idx) => (
                <div key={idx} className="p-6 bg-white dark:bg-zinc-900/60 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60">
                  <span className="text-xs font-bold text-[#FF4F18] uppercase">{wItem.n || wItem.title}</span>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-2 leading-relaxed">{wItem.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: SOLUTIONS BUILT FOR INDUSTRY */}
        <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-16 bg-white dark:bg-[#0d0d0e]">
          <div className="text-left mb-12">
            <h3 className="text-3xl sm:text-4xl md:text-[44px] font-[850] tracking-tight text-[#111111] dark:text-white leading-[1.15]">
              {industry.featuresTitle && industry.featuresTitle.includes('*') ? (
                renderHighlightedText(industry.featuresTitle)
              ) : (
                (() => {
                  const words = (industry.featuresTitle || '').split(' ');
                  if (words.length <= 1) return industry.featuresTitle;
                  const splitIndex = words.length - 2;
                  return (
                    <>
                      {words.slice(0, splitIndex).join(' ')}{' '}
                      <span className="text-[#FF4F18]">{words.slice(splitIndex).join(' ')}</span>
                    </>
                  );
                })()
              )}
            </h3>
          </div>

          <div className="border border-zinc-200/60 dark:border-zinc-800/60 rounded-[32px] overflow-hidden bg-zinc-200/60 dark:bg-zinc-800/60 grid grid-cols-1 md:grid-cols-2 gap-[1px] shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
            {industry.features.map((item, idx) => (
              <div 
                key={idx}
                className="p-8 sm:p-10 bg-white dark:bg-[#0d0d0e] hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-all duration-300 text-left flex gap-5"
              >
                <div className="text-[#FF4F18] shrink-0 mt-1">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <div className="space-y-2.5">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* SECTION: REAL-TIME VISIBILITY ACROSS OPERATIONS */}
        <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-16 bg-white dark:bg-[#0d0d0e] text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-6 space-y-10">
              <h2 className="text-3xl sm:text-4xl md:text-[44px] font-[850] tracking-tight text-zinc-900 dark:text-white leading-[1.15]">
                {industry.controlTitle ? (
                  renderHighlightedText(industry.controlTitle)
                ) : (
                  <>Total control over your <span className="text-[#FF4F18]">menu, staff and sales numbers</span></>
                )}
              </h2>

              <div className="pt-8 border-t border-zinc-200/60 dark:border-zinc-800/60 grid grid-cols-1 sm:grid-cols-2 gap-8 gap-y-10">
                {(industry.controlItems && industry.controlItems.length > 0 ? industry.controlItems : [
                  { title: '100% cloud', desc: 'Manage operations from your phone or browser instantly.' },
                  { title: 'Offline Mode', desc: 'Billing counters function even if connection drops.' },
                  { title: 'Role-based Access', desc: 'Secure operations by restricting employee permissions.' },
                  { title: 'Central Menu Sync', desc: 'Update prices across all outlet locations globally.' }
                ]).map((cItem, idx) => (
                  <div key={idx}>
                    <span className="text-lg font-bold text-zinc-950 dark:text-white">{cItem.title}</span>
                    <p className="text-sm text-zinc-500 mt-2 leading-relaxed">{cItem.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-14">
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed pt-2">
                {industry.controlDesc || 'Check sales figures, watch inventory counts decrease in real time, and audit daily cashier shifts from one central screen. Digitory consolidates metrics from online integrations, dine-in counters, and bar tabs automatically.'}
              </p>

              <div className="bg-white dark:bg-zinc-900/60 p-8 rounded-[32px] border border-zinc-200/60 dark:border-zinc-800/60 space-y-6">
                <div className="flex justify-between items-center border-b border-zinc-200/60 dark:border-zinc-800/60 pb-4">
                  <span className="text-xs font-bold text-zinc-500">Global Outlet Switcher</span>
                  <span className="text-xs font-extrabold text-[#FF4F18] uppercase">9 Locations Connected</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-zinc-500">Active KOTs (Kitchen)</span>
                    <span className="text-zinc-900 dark:text-white">42 Orders</span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#FF4F18] h-full w-3/4 rounded-full" />
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-zinc-550">Average Prep Time</span>
                    <span className="text-zinc-900 dark:text-white">11.4 Minutes</span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[85%] rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: MULTI-OUTLET / SCALE READINESS */}
        {industry.whyChoose && industry.whyChoose.length > 0 && (
          <section className="bg-white dark:bg-[#0d0d0e] py-10 md:py-16 text-left">
            <div className="mx-auto max-w-7xl px-6 md:px-8">
              <div className="mb-12">
                <h3 className="text-3xl sm:text-4xl md:text-[44px] font-[850] tracking-tight text-zinc-900 dark:text-white leading-[1.15]">
                  {(() => {
                    const words = (industry.whyChooseTitle || "Why choose Digitory?").split(' ');
                    const splitIndex = words.length - 2;
                    return (
                      <>
                        {words.slice(0, splitIndex).join(' ')}{' '}
                        <span className="text-[#FF4F18]">{words.slice(splitIndex).join(' ')}</span>
                      </>
                    );
                  })()}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                {industry.whyChoose.map((text, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-zinc-900/60 p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/80 text-left flex items-start gap-4 h-full transition-all duration-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:border-zinc-300/80 dark:hover:border-zinc-700/80"
                  >
                    <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-300 leading-relaxed">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* COUNTER SECTION (from About page) */}
        <BeliefsSection showBeliefs={false} showHeading={false} />

        {/* CONNECTS WITH YOUR FAV APP (from Solutions page) */}
        <ToolIntegrations />

        {/* TESTIMONIAL SECTION (from Home page) */}
        <RestaurantOS />

        {/* FAQs SECTION */}
        {industry.faqs && industry.faqs.length > 0 ? (
          <IndustryDetailsFaq items={industry.faqs} />
        ) : (
          <FAQPage />
        )}

        {/* LATEST INSIGHTS SECTION */}
        <InsightsPage />

        {/* DYNAMIC INDUSTRY CTA SECTION */}
        <SolutionsDetailsCta 
          title={industry.ctaBlock?.title} 
          desc={industry.ctaBlock?.desc} 
        />

      </main>

      <FooterPage />
    </div>
  );
}

export default function IndustriesDetailsAllInOne() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-[#0d0d0e] flex items-center justify-center text-[#FF4F18] font-bold text-sm tracking-widest uppercase">
        Loading...
      </div>
    }>
      <IndustriesDetailsContent />
    </Suspense>
  );
}

function IndustryDetailsFaq({ items }: { items: { question: string; answer: string }[] }) {
  const [openId, setOpenId] = useState<number | null>(0);

  const handleToggle = (id: number) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <div className="bg-white dark:bg-[#0d0d0e] font-sans antialiased text-[#111111] py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="mb-14 text-left">
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-[850] tracking-tight leading-[1.15] text-[#111111] dark:text-white">
            Questions before you <span className="text-[#FF4F18]">commit?</span>
          </h2>
        </div>
        <div className="max-w-4xl mx-auto border-t border-zinc-100 dark:border-zinc-800">
          {items.map((item, idx) => {
            const isOpen = openId === idx;
            return (
              <div key={idx} className="border-b border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => handleToggle(idx)}
                  className="w-full flex items-center justify-between py-6 text-left outline-none cursor-pointer group"
                >
                  <span className="text-[16px] sm:text-[18px] font-bold text-[#111111] dark:text-zinc-100 pr-6 transition-colors duration-200 group-hover:text-zinc-600 dark:group-hover:text-zinc-400">
                    {item.question}
                  </span>
                  <span className="text-[#FF4F18] font-[400] text-[26px] leading-none select-none flex-shrink-0 w-6 text-right transition-transform duration-200">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-[250px] pb-6 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-[15px] sm:text-[16px] text-[#666666] dark:text-zinc-400 leading-relaxed max-w-[90%]">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
