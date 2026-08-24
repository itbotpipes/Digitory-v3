'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import FooterPage from '../../../components/Footer';
import OperationsReveal from '../../../components/solutions/OperationsReveal';
import InsightsPage from '../../../components/home/Insights';
import { solutionsDb, SolutionData } from '../../data/solutionsDb';
import SolutionsDetailsCta from '../../../components/solutions/SolutionsDetailsCta';
import { api } from '@/lib/api';

function SolutionsDetailsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const moduleParam = searchParams.get('module');
  const [activeKey, setActiveKey] = useState<string>("pos");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [solutionsList, setSolutionsList] = useState<SolutionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Attempt to load solutions from backend database api with try-catch safety
    const loadSolutionsData = async () => {
      try {
        const res = await api.get('/solutions?limit=30');
        const loaded: any[] = res.data?.docs || res.data?.results || res.data || [];
        if (loaded && loaded.length > 0) {
          const normalized = loaded.map((s: any) => ({
            id: s.slug || s._id,
            slug: s.slug || '',
            shortLabel: s.shortLabel || s.title || '',
            title: s.title || '',
            badge: s.badge || '',
            subtitle: s.subtitle || '',
            description: s.description || '',
            ctaText: s.ctaText || 'Request a Demo',
            trustText: s.trustText || 'Trusted by Indian restaurants',
            gridTitle: s.gridTitle || '',
            gridDesc: s.gridDesc || '',
            opsTitle: s.opsTitle || '',
            opsParagraph: s.opsParagraph || '',
            opsHighlights: s.opsHighlights || '',
            icon: s.icon || '',
            whyChoose: s.whyChoose || [],
            featuresTitle: s.featuresTitle || 'Key Capabilities',
            features: s.features || [],
            businessTypes: s.businessTypes || [],
            integrations: s.integrations || [],
            extraGrowth: s.extraGrowth,
            extraOwnersChoice: s.extraOwnersChoice,
            supportItems: s.supportItems || [],
            securityItems: s.securityItems || [],
            ctaBlock: s.ctaBlock || { title: 'Ready to upgrade?', desc: 'Talk to us today' }
          }));
          setSolutionsList(normalized);
        } else {
          setSolutionsList(Object.values(solutionsDb));
        }
      } catch (err) {
        console.warn('Backend server offline or failed to fetch solutions database. Using local static fallback database:', err);
        setSolutionsList(Object.values(solutionsDb));
      } finally {
        setLoading(false);
      }
    };

    loadSolutionsData();
  }, []);

  useEffect(() => {
    if (moduleParam) {
      setActiveKey(moduleParam);
    } else if (solutionsList.length > 0) {
      setActiveKey(solutionsList[0].id || 'pos');
    }
  }, [moduleParam, solutionsList]);

  const solution = solutionsList.find(s => s.id === activeKey || s.slug === activeKey) || solutionsList[0] || Object.values(solutionsDb)[0];

  const handleSelectSolution = (id: string) => {
    setActiveKey(id);
    setIsDropdownOpen(false);
  };

  const [activeFeatureIdx, setActiveFeatureIdx] = useState(0);
  const [simState, setSimState] = useState<"idle" | "loading" | "success">("idle");

  useEffect(() => {
    setActiveFeatureIdx(0);
    setSimState("idle");
  }, [activeKey]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0d0d0e] flex flex-col items-center justify-center font-sans">
        <div className="w-10 h-10 border-4 border-zinc-200 dark:border-zinc-800 border-t-[#FF4F18] rounded-full animate-spin mb-4"></div>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm font-semibold tracking-wide uppercase">Loading System...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0d0e] transition-colors duration-300 flex flex-col font-sans">
      <Header />

      {/* Transparent overlay backdrop to close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40 bg-transparent cursor-default" 
          onClick={() => setIsDropdownOpen(false)} 
        />
      )}

      <main className="flex-grow space-y-0">
        
        {/* 2. Hero Section */}
        <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-center">
            
            {/* Left Column: Solution Information */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6 md:space-y-8 text-left">
              {/* Heading & Paragraph aligned to max-w-xl limits */}
              <div className="max-w-xl space-y-6 md:space-y-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
                  {(() => {
                    const words = solution.title.split(' ');
                    if (words.length <= 1) return solution.title;
                    
                    // For multi-word titles, highlight the last 2 words if title has 3+ words, else last 1 word.
                    const highlightCount = words.length >= 3 ? 2 : 1;
                    const splitIndex = words.length - highlightCount;
                    
                    const normalText = words.slice(0, splitIndex).join(' ');
                    const orangeText = words.slice(splitIndex).join(' ');
                    
                    return (
                      <>
                        {normalText}{' '}
                        <span className="text-[#FF4F18]">{orangeText}</span>
                      </>
                    );
                  })()}
                </h1>

                <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {solution.description}
                </p>
              </div>

              {/* Action CTAs */}
              <div className="flex flex-wrap gap-4 items-center">
                <button className="inline-flex justify-center items-center text-center rounded-full bg-[#FF4F18] px-8 py-3.5 text-[15px] font-bold text-white transition-all duration-200 hover:bg-[#E03F0D] shadow-[0_8px_20px_rgba(255,79,24,0.35)] hover:shadow-[0_10px_24px_rgba(255,79,24,0.45)] active:scale-[0.98] cursor-pointer">
                  {solution.ctaText === 'Request a Demo' ? 'Book a demo' : solution.ctaText}
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
                  {solution.trustText || "Trusted by restaurants, cafés, bars, breweries and cloud kitchens across India."}
                </p>
              </div>
            </div>

            {/* Right Column: Interactive Widget (Connected Ecosystem Preview) */}
            <div className="lg:col-span-5 flex justify-center w-full">
              {(() => {
                const activeFeature = solution.features[activeFeatureIdx] || solution.features[0] || { title: 'System Core', desc: 'Main operations layer.' };
                return (
                  <div className="w-full max-w-[500px] bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.015)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] rounded-[24px] p-6 md:p-8 relative overflow-hidden flex flex-col gap-5 select-none text-left">
                    
                    {/* Visual Header */}
                    <div className="flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800/80 pb-4">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF4F18]">
                        Interactive Module Simulator
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#10B981]">Live</span>
                      </span>
                    </div>

                    {/* Tabs of Features styled like Table Selectors */}
                    <div className="flex flex-col gap-2.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block mb-0.5">Select Active Feature:</span>
                      <div className="grid grid-cols-3 gap-3">
                        {solution.features.slice(0, 3).map((feat, idx) => {
                          const isActive = activeFeatureIdx === idx;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setActiveFeatureIdx(idx);
                                setSimState("idle");
                              }}
                              className={`flex flex-col items-center justify-center py-2.5 px-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                                isActive
                                  ? "bg-[#FF4F18] border-[#FF4F18] text-white shadow-[0_4px_14px_rgba(255,79,24,0.3)]"
                                  : "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200/60 dark:border-zinc-800 text-zinc-650 dark:text-zinc-300 hover:border-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                              }`}
                            >
                              <span className="text-xs font-black truncate max-w-full leading-tight">
                                {feat.title.split(' ').slice(0, 2).join(' ')}
                              </span>
                              <span className={`text-[9px] font-bold mt-0.5 ${isActive ? "text-white/95" : "text-zinc-400 dark:text-zinc-500"}`}>
                                {idx === 0 ? "Ready" : idx === 1 ? "Active" : "Online"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Interactive Status Display */}
                    <div className="bg-[#F8F9FA] dark:bg-zinc-800/50 p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/80 space-y-3 min-h-[150px] flex flex-col justify-between">
                      {simState === "success" ? (
                        <div className="flex flex-col items-center justify-center text-center gap-2 py-4 h-full my-auto animate-[fadeIn_0.3s_ease]">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-[#10B981]">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <h5 className="text-[14px] font-bold text-emerald-800 dark:text-emerald-400">
                            Problem Solved!
                          </h5>
                          <p className="text-[11px] text-zinc-550 dark:text-zinc-400 leading-normal max-w-[240px]">
                            <strong>{activeFeature.title}</strong> has been successfully configured. Operational bottlenecks resolved and workflow is fully optimized.
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-zinc-400 font-extrabold">
                              <span>Feature Status</span>
                              <span className="text-[#10B981] font-bold">Operational</span>
                            </div>
                            <h5 className="text-[13px] font-black text-zinc-900 dark:text-white">
                              {activeFeature.title}
                            </h5>
                            <p className="text-[11.5px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-semibold">
                              {activeFeature.desc}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-zinc-200/60 dark:border-zinc-700/60 text-[10px] font-bold text-zinc-450 dark:text-zinc-500">
                            <div>
                              <span className="block text-[8px] uppercase tracking-wider text-zinc-455">Response Speed</span>
                              <span className="text-zinc-900 dark:text-white font-extrabold text-[11.5px]">
                                {activeFeatureIdx === 0 ? "12ms" : activeFeatureIdx === 1 ? "18ms" : "24ms"}
                              </span>
                            </div>
                            <div>
                              <span className="block text-[8px] uppercase tracking-wider text-zinc-455">Accuracy Rate</span>
                              <span className="text-zinc-900 dark:text-white font-extrabold text-[11.5px]">
                                {activeFeatureIdx === 0 ? "99.8%" : activeFeatureIdx === 1 ? "99.4%" : "99.9%"}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Simulation Trigger Button */}
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          if (simState === "idle") {
                            setSimState("loading");
                            setTimeout(() => {
                              setSimState("success");
                            }, 1200);
                          } else if (simState === "success") {
                            router.push("/request-demo");
                          }
                        }}
                        disabled={simState === "loading"}
                        className={`w-full inline-flex justify-center items-center gap-2 text-center rounded-full px-6 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 active:scale-[0.98] cursor-pointer ${
                          simState === "loading"
                            ? "bg-zinc-400 cursor-not-allowed"
                            : simState === "success"
                            ? "bg-emerald-600 hover:bg-emerald-750 shadow-[0_4px_14px_rgba(16,185,129,0.2)]"
                            : "bg-[#FF4F18] hover:bg-[#E03F0D]"
                        }`}
                      >
                        {simState === "loading" && (
                          <span className="flex items-center justify-center gap-1.5">
                            <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Configuring Module...
                          </span>
                        )}
                        {simState === "idle" && `Simulate ${solution.shortLabel || 'Module'}`}
                        {simState === "success" && "Book a Demo"}
                      </button>
                    </div>

                    {/* Footer Tagline inside widget */}
                    <div className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold border-t border-zinc-200/60 dark:border-zinc-800/80 pt-4 flex justify-between">
                      <span>System: DIGI-OS v4.2</span>
                      <span>Region: AP-SOUTH</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </section>

        {/* 3. Operational Problem Statement */}
        <OperationsReveal 
          title={solution.opsTitle ? <span dangerouslySetInnerHTML={{ __html: solution.opsTitle }} /> : undefined}
          words={solution.opsParagraph ? solution.opsParagraph.split(/\s+/) : undefined}
          highlights={solution.opsHighlights ? solution.opsHighlights.split(',').map(h => h.trim()) : undefined}
        />

        {/* 4. How Digitory's Layer Works */}
        <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start mb-12">
            <div className="lg:col-span-7">
              <h2 className="text-3xl sm:text-4xl md:text-[44px] font-[850] tracking-tight text-zinc-900 dark:text-white leading-[1.15]">
                One unified layer, <span className="text-[#FF4F18]">infinite control</span>
              </h2>
            </div>
            <div className="lg:col-span-5 text-zinc-600 dark:text-zinc-300 text-sm md:text-base leading-relaxed lg:pt-2">
              <p>
                Digitory works as a smart, real-time operating layer. We interface directly with POS, inventory levels, recipe configurations, and KDS monitors to automate every task seamlessly.
              </p>
            </div>
          </div>

          {/* How it works steps - formatted as a unified grid container matching home features */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-[28px] overflow-hidden bg-white dark:bg-[#0d0d0e] grid grid-cols-1 md:grid-cols-3">
            {solution.whyChoose.slice(0, 3).map((item, idx) => (
              <div 
                key={idx} 
                className={`p-8 sm:p-10 flex flex-col justify-start transition-all duration-300 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 text-left ${
                  idx === 0 ? 'border-b border-zinc-200 dark:border-zinc-800 md:border-r md:border-b-0' :
                  idx === 1 ? 'border-b border-zinc-200 dark:border-zinc-800 md:border-r md:border-b-0' :
                  ''
                }`}
              >
                <span className="text-sm font-bold text-zinc-400 mb-2">0{idx + 1}</span>
                <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 mt-4">
                  {item.title}
                </h4>
                <p className="text-zinc-600 dark:text-zinc-300 text-xs sm:text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Key Operational Capabilities */}
        <section className="bg-white py-10 md:py-16">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="text-left mb-12">
              <h3 className="text-3xl sm:text-4xl md:text-[44px] font-[850] text-[#111111] dark:text-white tracking-tight mt-2 leading-[1.15]">
                {(() => {
                  const words = solution.featuresTitle.split(' ');
                  if (words.length <= 1) return solution.featuresTitle;
                  const highlightCount = words.length >= 3 ? 2 : 1;
                  const splitIndex = words.length - highlightCount;
                  const normalText = words.slice(0, splitIndex).join(' ');
                  const orangeText = words.slice(splitIndex).join(' ');
                  return (
                    <>
                      {normalText}{' '}
                      <span className="text-[#FF4F18]">{orangeText}</span>
                    </>
                  );
                })()}
              </h3>
            </div>

            {/* Unified 2x2 grid style matching home page features */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-[28px] overflow-hidden bg-white dark:bg-[#0d0d0e] grid grid-cols-1 md:grid-cols-2">
              {solution.features.map((item, idx) => {
                // Determine border dividers dynamically for a 2-column layout (2x3 or 2x2 grid)
                const isEven = idx % 2 === 0;
                const isLastRow = idx >= solution.features.length - 2;
                const borderClasses = `p-6 md:p-8 flex gap-5 transition-all duration-300 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 text-left
                  ${isEven ? 'border-b border-zinc-200 dark:border-zinc-800 md:border-r' : 'border-b border-zinc-200 dark:border-zinc-800'}
                  ${isLastRow ? 'md:border-b-0' : ''}
                  ${idx === solution.features.length - 1 ? 'border-b-0' : ''}
                `;

                return (
                  <div key={idx} className={borderClasses}>
                    <div className="w-10 h-10 text-[#FF4F18] flex items-center justify-center shrink-0 mt-0.5">
                      {item.icon ? (
                        <span className="w-5.5 h-5.5 flex items-center justify-center">
                          {item.icon}
                        </span>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-lg font-bold text-zinc-900 dark:text-white">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. Operational Outcomes / Metrics */}
        <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-16 text-left">
          {/* Centered Header Block */}
          <div className="mb-16 md:mb-20 text-center">
            <h2 className="text-center text-3xl sm:text-4xl md:text-[44px] font-[850] tracking-tight text-zinc-900 dark:text-white leading-[1.15]">
              Real operational <span className="text-[#FF4F18]">outcomes & metrics</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-y-12 gap-x-4 md:grid-cols-4 md:gap-0 text-center">
            {[
              { value: "22%", label: "Faster Table Turnover", desc: "Reduce wait times during peak shifts" },
              { value: "32%", label: "Less Ingredient Waste", desc: "Optimise portions & control recipes" },
              { value: "98%", label: "KDS Accuracy", desc: "Eliminate order errors & lost tickets" },
              { value: "15 hrs", label: "Saved Weekly", desc: "Cut manual inventory check stress" }
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center px-4 md:border-r md:border-zinc-200 dark:md:border-zinc-800 last:border-r-0">
                <h3 className="text-2xl md:text-3xl font-bold leading-tight max-w-[260px]">
                  <span className="text-[#FF4F18]">{stat.value}</span>
                </h3>
                <h3 className="text-2xl md:text-3xl font-bold leading-tight max-w-[260px]">
                  <span className="text-zinc-900 dark:text-white">{stat.label}</span>
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-3 max-w-[260px] leading-relaxed">
                  {stat.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Impact on Restaurant Operations (Verticals list) */}
        <section className="bg-white py-10 md:py-16">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            {/* Left-aligned Header Block */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 mb-16 items-start">
              <div className="lg:col-span-7">
                <h2 className="text-3xl sm:text-4xl md:text-[44px] font-[850] tracking-tight text-zinc-900 dark:text-white leading-[1.15]">
                  Built for every kind of <span className="text-[#FF4F18]">food business</span>
                </h2>
              </div>
              <div className="lg:col-span-5 text-zinc-600 dark:text-zinc-300 text-sm md:text-base leading-relaxed lg:pt-2">
                <p>
                  No matter what type of food or beverage business you run, Digitory adapts to your operations, inventory configurations, and team roles.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {solution.businessTypes.map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-left hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-all duration-300"
                >
                  <h4 className="text-md font-bold text-zinc-955 dark:text-white mb-2.5 flex items-center gap-2.5">
                    {item.icon ? (
                      <span className="text-[#FF4F18] w-5 h-5 flex items-center justify-center shrink-0">
                        {item.icon}
                      </span>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF4F18]" />
                    )}
                    {item.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Built for Modern F&B Workflows (Extra integrations/support details) */}
        {(solution.extraGrowth || solution.integrations || solution.supportItems || solution.securityItems || solution.extraOwnersChoice) && (
          <section className="mx-auto max-w-7xl px-6 md:px-8 py-16 md:py-24 text-left">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-x-12 lg:gap-x-16 items-start">
              
              {/* Column 1: Growth */}
              {solution.extraGrowth && (
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF4F18]">Scalability</span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
                    {solution.extraGrowth.title}
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-350 leading-relaxed">
                    {solution.extraGrowth.desc}
                  </p>
                </div>
              )}

              {/* Column 2: Owner's Choice */}
              {solution.extraOwnersChoice && (
                <div className="space-y-4 md:border-l md:border-zinc-200/60 dark:md:border-zinc-800/60 md:pl-8 lg:pl-12">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF4F18]">Business Value</span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
                    {solution.extraOwnersChoice.title}
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-350 leading-relaxed">
                    {solution.extraOwnersChoice.desc}
                  </p>
                </div>
              )}

              {/* Column 3: Support */}
              {solution.supportItems && (
                <div className="space-y-5 md:border-l md:border-zinc-200/60 dark:md:border-zinc-800/60 md:pl-8 lg:pl-12">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#FF4F18]">Customer Success</span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight mt-1">
                      Support you can count on
                    </h3>
                  </div>
                  <ul className="space-y-3.5">
                    {solution.supportItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-[#FF4F18] font-bold text-sm shrink-0">✓</span>
                        <span className="text-sm text-zinc-600 dark:text-zinc-300 font-semibold leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          </section>
        )}

        {/* 9. FAQs Section (Accordion matching home page FAQ) */}
        <SolutionsDetailsFaq />

        {/* 10. Latest Insights Section */}
        <InsightsPage />

        {/* 11. CTA Section */}
        <SolutionsDetailsCta 
          title={solution.ctaBlock?.title} 
          desc={solution.ctaBlock?.desc} 
        />

      </main>

      <FooterPage />
    </div>
  );
}

export default function SolutionsDetailsAllInOne() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-[#0d0d0e] flex items-center justify-center text-[#FF4F18] font-bold text-sm tracking-widest uppercase">
        Loading...
      </div>
    }>
      <SolutionsDetailsContent />
    </Suspense>
  );
}

function SolutionsDetailsFaq() {
  const [openId, setOpenId] = useState<number | null>(1); // First item open by default

  const handleToggle = (id: number) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  const FAQ_ITEMS = [
    {
      id: 1,
      question: "How does Digitory manage orders from different platforms?",
      answer: "Whether it's dine-in, online orders, QR or direct orders, everything flows into one connected system, so you never have to switch between multiple apps."
    },
    {
      id: 2,
      question: "How does the kitchen stay in sync during rush hours?",
      answer: "Orders are sent to the right kitchen station instantly, reducing communication gaps, delays and missed tickets when every second counts."
    },
    {
      id: 3,
      question: "Can Digitory help reduce inventory wastage?",
      answer: "Yes. Inventory updates automatically with every sale, helping you track stock movement, reduce wastage and protect your margins."
    },
    {
      id: 4,
      question: "Can I manage customer loyalty and repeat business?",
      answer: "Absolutely. Build customer profiles, run loyalty programs and targeted campaigns that keep guests coming back."
    },
    {
      id: 5,
      question: "Will I get real-time reports and insights?",
      answer: "Yes. Monitor sales, inventory, outlet performance and business trends in real time, so you can make faster, data-backed decisions."
    },
    {
      id: 6,
      question: "Can I manage multiple outlets from one dashboard?",
      answer: "Yes. Compare outlet performance, monitor operations, and track key metrics across all your locations without chasing managers for updates."
    },
    {
      id: 7,
      question: "Will billing slow us down during peak hours?",
      answer: "Not at all. Digitory is built for handling chaos better, helping your team bill faster, reducing queues, and keeping operations moving smoothly during rush hours."
    }
  ];

  return (
    <div className="bg-white font-sans antialiased text-[#111111] py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-8">

        {/* Title */}
        <div className="mb-14 text-left">
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-[850] tracking-tight leading-[1.15] text-[#111111] dark:text-white">
            Questions before you <span className="text-[#FF4F18]">commit?</span>
          </h2>
        </div>

        {/* Accordions Container */}
        <div className="max-w-4xl mx-auto border-t border-zinc-100">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="border-b border-zinc-100"
              >
                {/* Question Trigger */}
                <button
                  onClick={() => handleToggle(item.id)}
                  className="w-full flex items-center justify-between py-6 text-left outline-none cursor-pointer group"
                >
                  <span className="text-[16px] sm:text-[18px] font-bold text-[#111111] pr-6 transition-colors duration-200 group-hover:text-zinc-600">
                    {item.question}
                  </span>

                  {/* Plus/Minus Indicator */}
                  <span className="text-[#FF4F18] font-[400] text-[26px] leading-none select-none flex-shrink-0 w-6 text-right transition-transform duration-200">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {/* Answer Panel */}
                <div
                  className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${isOpen ? "max-h-[250px] pb-6 opacity-100" : "max-h-0 opacity-0"}
                  `}
                >
                  <p className="text-[15px] sm:text-[16px] text-[#666666] leading-relaxed max-w-[90%]">
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
