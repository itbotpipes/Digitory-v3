"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Header from '../../../components/Header';
import FooterPage from '../../../components/Footer';
import OperationsReveal from '../../../components/solutions/OperationsReveal';
import FAQPage from '../../../components/home/FAQ';
import InsightsPage from '../../../components/home/Insights';
import { industriesDb, IndustryData } from '../../data/industriesDb';
import { api } from '@/lib/api';

function IndustriesDetailsContent() {
  const searchParams = useSearchParams();
  const moduleParam = searchParams.get('module');
  const [activeKey, setActiveKey] = useState<string>("bars-restaurants");
  const [industriesList, setIndustriesList] = useState<IndustryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
            subtitle: s.subtitle || '',
            description: s.description || '',
            trustText: s.trustText || 'Trusted by restaurants across India.',
            featuresTitle: s.featuresTitle || 'Key capabilities',
            features: s.features || [],
            whyChooseTitle: s.whyChooseTitle || 'Why choose Digitory?',
            whyChoose: s.whyChoose || [],
            ctaBlock: s.ctaBlock || { title: 'Ready to grow?', desc: 'Talk to us today.' },
            heroImage: s.heroImage || '',
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
                Optimized operations for <br />
                <span className="text-[#FF4F18]">{industry.title}</span>
              </h1>

              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-xl leading-relaxed">
                {industry.description}
              </p>

              <div className="flex flex-wrap gap-4 items-center">
                <button className="inline-flex justify-center items-center text-center rounded-full bg-[#FF4F18] px-8 py-3.5 text-[15px] font-bold text-white transition-all duration-200 hover:bg-[#E03F0D] shadow-[0_8px_20px_rgba(255,79,24,0.35)] hover:shadow-[0_10px_24px_rgba(255,79,24,0.45)] active:scale-[0.98] cursor-pointer">
                  Book a Demo
                </button>
              </div>

              <p className="text-sm text-zinc-500 font-medium border-t border-zinc-150/60 dark:border-zinc-800/80 pt-6 max-w-sm leading-normal">
                {industry.trustText}
              </p>
            </div>

            {/* Right Column: Hero Image */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end w-full relative">
              <div 
                className="relative w-full max-w-[400px] aspect-[4/5] rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(255,79,24,0.15)] z-10 transition-transform duration-500 hover:-translate-y-1"
              >
                <Image
                  src={industry.heroImage || "/home-hero.png"}
                  alt={`Digitory for ${industry.title}`}
                  fill
                  className="object-cover transition-transform duration-500"
                  priority
                />
                {/* Subtle inner overlay for premium finish */}
                <div className="absolute inset-0 border border-black/5 dark:border-white/10 rounded-[32px] pointer-events-none" />
              </div>
            </div>

          </div>
        </section>

        {/* SECTION: THE OPERATIONAL REALITY OF INDUSTRY */}
        <OperationsReveal 
          title={
            <span>
              Managing high volume hospitality requires <span className="text-[#FF4F18]">precision at scale</span>
            </span>
          }
          words={`Whether coordinating busy table rosters or keeping bar tabs updated instantly, ${industry.title} operations require a synchronized platform to manage the continuous rush. Manual checks waste hours, while disjointed setups lead to critical slip-ups. Digitory replaces multiple point systems with one unified interface. This enables staff to execute actions quickly and allows managers to track key parameters in real time.`.split(/\s+/)}
          highlights={["precision", "scale", "synchronized", "rush", "waste", "slip-ups", "unified", "real", "time"]}
        />

        {/* SECTION: WHERE TRADITIONAL OPERATIONS BREAK DOWN */}
        <section className="bg-white dark:bg-[#0d0d0e] py-10 md:py-16 text-left">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-[44px] font-[850] tracking-tight text-zinc-900 dark:text-white leading-[1.15]">
                Where legacy systems <span className="text-[#FF4F18]">fail {industry.shortLabel}</span>
              </h2>
            </div>

            <div className="space-y-0 divide-y divide-zinc-100 dark:divide-zinc-900">
              {[
                {
                  n: '01',
                  title: 'Lagging Inventory Reconciliation',
                  body: 'Taking stock manually at the end of the day leads to high inventory variance and stock shrinkage that goes unnoticed for weeks.',
                  stat: '40%',
                  statLabel: 'average inventory variance undetected'
                },
                {
                  n: '02',
                  title: 'Kitchen and Floor Disconnection',
                  body: 'Lost or delayed paper tickets result in extended customer wait times, cold food, and disappointed regulars.',
                  stat: '15m',
                  statLabel: 'order delay during peak rush hours'
                },
                {
                  n: '03',
                  title: 'Siloed Multi-Outlet Reporting',
                  body: 'Calculating regional performance across multiple outlets manually creates reporting lag and prevents quick operational adjustments.',
                  stat: '3x',
                  statLabel: 'reporting lag across separate venues'
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-4 md:gap-8 py-8 items-center"
                >
                  <div className="col-span-2 md:col-span-1 pt-1 text-left">
                    <span className="text-xs md:text-sm font-bold text-zinc-400 dark:text-zinc-500 select-none">
                      {item.n}
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
                A modern system should connect <span className="text-[#FF4F18]">every workflow automatically</span>
              </h2>
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed pt-2">
                Operations should run like a clock. When an order is taken on the floor, it should instantly notify the kitchen, adjust raw material levels in the inventory, and log real-time numbers on the manager\'s screen.
              </p>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-white dark:bg-zinc-900/60 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60">
                <span className="text-xs font-bold text-[#FF4F18] uppercase">01 / Instant Routing</span>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-2 leading-relaxed">Real-time KOT updates prevent delays between floor staff and kitchen preparation.</p>
              </div>
              <div className="p-6 bg-white dark:bg-zinc-900/60 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60">
                <span className="text-xs font-bold text-[#FF4F18] uppercase">02 / Automated Audits</span>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-2 leading-relaxed">Real-time recipe deductions provide immediate clarity on ingredient usage.</p>
              </div>
              <div className="p-6 bg-white dark:bg-zinc-900/60 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60">
                <span className="text-xs font-bold text-[#FF4F18] uppercase">03 / Unified Dashboard</span>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-2 leading-relaxed">Consolidated insights eliminate manual spreadsheet reconciliation.</p>
              </div>
              <div className="p-6 bg-white dark:bg-zinc-900/60 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60">
                <span className="text-xs font-bold text-[#FF4F18] uppercase">04 / Central Control</span>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-2 leading-relaxed">Push menu, pricing, and tax updates to all locations in seconds.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: SOLUTIONS BUILT FOR INDUSTRY */}
        <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-16 bg-white dark:bg-[#0d0d0e]">
          <div className="text-left mb-12">
            <h3 className="text-3xl sm:text-4xl md:text-[44px] font-[850] tracking-tight text-[#111111] dark:text-white leading-[1.15]">
              {(() => {
                const words = (industry.featuresTitle || '').split(' ');
                if (words.length <= 1) return industry.featuresTitle;
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

          <div className="border border-zinc-200/60 dark:border-zinc-800/60 rounded-[32px] overflow-hidden bg-zinc-200/60 dark:bg-zinc-800/60 grid grid-cols-1 md:grid-cols-3 gap-[1px] shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
            {industry.features.map((item, idx) => (
              <div
                key={idx}
                className="p-8 sm:p-10 flex flex-col justify-start transition-colors duration-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer text-left bg-white dark:bg-[#0d0d0e] h-full"
              >
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4F18]" />
                    {item.title}
                  </h4>
                  <p className="text-zinc-600 dark:text-zinc-300 text-xs sm:text-sm leading-relaxed">
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
                Total control over your  <span className="text-[#FF4F18]">menu,staff and sales numbers</span>
              </h2>

              <div className="pt-8 border-t border-zinc-200/60 dark:border-zinc-800/60 grid grid-cols-1 sm:grid-cols-2 gap-8 gap-y-10">
                <div>
                  <span className="text-lg font-bold text-zinc-950 dark:text-white">100% cloud</span>
                  <p className="text-sm text-zinc-500 mt-2 leading-relaxed">Manage operations from your phone or browser instantly.</p>
                </div>
                <div>
                  <span className="text-lg font-bold text-zinc-950 dark:text-white">Offline Mode</span>
                  <p className="text-sm text-zinc-500 mt-2 leading-relaxed">Billing counters function even if connection drops.</p>
                </div>
                <div>
                  <span className="text-lg font-bold text-zinc-950 dark:text-white">Role-based Access</span>
                  <p className="text-sm text-zinc-500 mt-2 leading-relaxed">Secure operations by restricting employee permissions.</p>
                </div>
                <div>
                  <span className="text-lg font-bold text-zinc-950 dark:text-white">Central Menu Sync</span>
                  <p className="text-sm text-zinc-500 mt-2 leading-relaxed">Update prices across all outlet locations globally.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-14">
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed pt-2">
                Check sales figures, watch inventory counts decrease in real time, and audit daily cashier shifts from one central screen. Digitory consolidates metrics from online integrations, dine-in counters, and bar tabs automatically.
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

        {/* FAQs SECTION */}
        <FAQPage />

        {/* LATEST INSIGHTS SECTION */}
        <InsightsPage />

        {/* DYNAMIC INDUSTRY CTA SECTION */}
        <section className="mx-auto max-w-7xl px-6 md:px-8 py-16 md:py-24 bg-white dark:bg-[#0d0d0e]">
          {/* Top accent line */}
          <div className="w-16 h-1 bg-[#FF4F18] mx-auto mb-12" />
          
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-[44px] font-[850] tracking-tight leading-[1.15] text-zinc-900 dark:text-white">
              {(() => {
                const words = (industry.ctaBlock.title || '').split(' ');
                if (words.length <= 1) return industry.ctaBlock.title;
                const splitIndex = words.length - 2;
                return (
                  <>
                    {words.slice(0, splitIndex).join(' ')}{' '}
                    <span className="text-[#FF4F18]">{words.slice(splitIndex).join(' ')}</span>
                  </>
                );
              })()}
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
              {industry.ctaBlock.desc}
            </p>
          </div>

          {/* Trust indicators row */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-10 mb-12">
            <div className="flex items-center gap-2.5 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              No setup fee
            </div>
            <div className="flex items-center gap-2.5 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Free 15-min demo
            </div>
            <div className="flex items-center gap-2.5 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Go live in 48 hours
            </div>
          </div>

          <div className="text-center">
            <button className="inline-flex justify-center items-center rounded-full bg-[#FF4F18] px-10 py-4 text-[15px] font-bold text-white transition-all duration-200 hover:bg-[#E03F0D] shadow-[0_8px_20px_rgba(255,79,24,0.35)] hover:shadow-[0_10px_24px_rgba(255,79,24,0.45)] active:scale-[0.98] cursor-pointer">
              Book a Demo
            </button>
          </div>
        </section>

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
