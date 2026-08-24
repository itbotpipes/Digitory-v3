'use client';

import React, { useEffect, useState, use } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ArrowLeft, Save, RefreshCw, FileJson } from 'lucide-react';
import Link from 'next/link';

export default function SeoEditor({ params }: { params: Promise<{ pageType: string }> }) {
  const resolvedParams = use(params);
  const pageType = resolvedParams.pageType;

  const router = useRouter();
  const searchParams = useSearchParams();
  const pageId = searchParams.get('id');
  const pageUrl = searchParams.get('url');
  const pageName = searchParams.get('name');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seo, setSeo] = useState<any>({
    title: '',
    description: '',
    keywords: '',
    canonicalUrl: '',
    slug: '',
    robotsIndex: 'index',
    robotsFollow: 'follow',
    openGraph: { title: '', description: '', image: '' },
    twitterCard: { title: '', description: '', image: '' },
    schemaType: 'None',
    schemaData: ''
  });

  const [jsonInput, setJsonInput] = useState('');
  const [showJsonInput, setShowJsonInput] = useState(false);

  // Speed Audit Simulator state
  const [auditMode, setAuditMode] = useState<'desktop' | 'mobile'>('desktop');
  const [auditRunning, setAuditRunning] = useState(false);
  const [scores, setScores] = useState({
    performance: 94,
    accessibility: 96,
    bestPractices: 100,
    seo: 80,
    lcp: '1.1s',
    cls: '0.01',
    inp: '42ms'
  });

  const runSpeedAudit = () => {
    setAuditRunning(true);
    setTimeout(() => {
      const isDesktop = auditMode === 'desktop';
      let performanceScore = isDesktop ? Math.floor(Math.random() * 6) + 94 : Math.floor(Math.random() * 12) + 78;
      
      // Calculate SEO score based on actual checks
      let seoCalculated = 10;
      if (seo.title) seoCalculated += 30;
      if (seo.description) seoCalculated += 30;
      if (seo.keywords) seoCalculated += 15;
      if (seo.canonicalUrl) seoCalculated += 15;

      setScores({
        performance: performanceScore,
        accessibility: Math.floor(Math.random() * 4) + 96,
        bestPractices: 100,
        seo: seoCalculated,
        lcp: isDesktop ? '1.0s' : '2.3s',
        cls: isDesktop ? '0.01' : '0.06',
        inp: isDesktop ? '35ms' : '78ms'
      });
      setAuditRunning(false);
    }, 1200);
  };

  useEffect(() => {
    // Sync SEO simulator score initially
    let seoCalculated = 10;
    if (seo.title) seoCalculated += 30;
    if (seo.description) seoCalculated += 30;
    if (seo.keywords) seoCalculated += 15;
    if (seo.canonicalUrl) seoCalculated += 15;
    setScores(prev => ({ ...prev, seo: seoCalculated }));
  }, [seo.title, seo.description, seo.keywords, seo.canonicalUrl]);

  const handleInjectJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setSeo((prev: any) => ({
        ...prev,
        title: parsed.title ?? prev.title,
        description: parsed.description ?? prev.description,
        keywords: Array.isArray(parsed.keywords) ? parsed.keywords.join(', ') : parsed.keywords ?? prev.keywords,
        canonicalUrl: parsed.canonicalUrl ?? prev.canonicalUrl,
        slug: parsed.slug ?? prev.slug,
        robotsIndex: parsed.robotsIndex ?? prev.robotsIndex,
        robotsFollow: parsed.robotsFollow ?? prev.robotsFollow,
        openGraph: {
          title: parsed.openGraph?.title ?? prev.openGraph.title,
          description: parsed.openGraph?.description ?? prev.openGraph.description,
          image: parsed.openGraph?.image ?? prev.openGraph.image,
        },
        twitterCard: {
          title: parsed.twitterCard?.title ?? prev.twitterCard.title,
          description: parsed.twitterCard?.description ?? prev.twitterCard.description,
          image: parsed.twitterCard?.image ?? prev.twitterCard.image,
        },
        schemaType: parsed.schemaType ?? prev.schemaType,
        schemaData: parsed.schemaData ? (typeof parsed.schemaData === 'object' ? JSON.stringify(parsed.schemaData, null, 2) : parsed.schemaData) : prev.schemaData
      }));
      setShowJsonInput(false);
      alert('JSON injected successfully! Click Save Changes to commit.');
    } catch (e) {
      alert('Failed to parse JSON. Please verify syntax.');
    }
  };

  useEffect(() => {
    if (!pageId) return;
    const fetchSeo = async () => {
      try {
        const token = localStorage.getItem('admin_token') || '';
        const res = await api.get(`/seo/${pageType}/${pageId}`, token);
        if (res.data) {
          setSeo({
            ...res.data,
            keywords: Array.isArray(res.data.keywords) ? res.data.keywords.join(', ') : res.data.keywords || '',
            schemaData: res.data.schemaData ? JSON.stringify(res.data.schemaData, null, 2) : ''
          });
        }
      } catch (error) {
        console.error('Failed to fetch SEO', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSeo();
  }, [pageId, pageType]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('admin_token') || '';
      
      let parsedSchema = null;
      if (seo.schemaType !== 'None' && seo.schemaData) {
        try {
          parsedSchema = JSON.parse(seo.schemaData);
        } catch (e) {
          alert('Invalid JSON in Schema Data');
          setSaving(false);
          return;
        }
      }

      const payload = {
        pageId,
        pageType: pageType,
        ...seo,
        keywords: seo.keywords.split(',').map((k: string) => k.trim()).filter(Boolean),
        schemaData: parsedSchema
      };

      await api.post('/seo', payload, token);
      alert('SEO saved successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to save SEO');
    } finally {
      setSaving(false);
    }
  };

  const handleAutoGenerate = () => {
    setSeo((prev: any) => ({
      ...prev,
      title: prev.title || `${pageName} | Digitory`,
      slug: prev.slug || pageName?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || ''
    }));
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Loading Editor...</div>;

  const titleLength = seo.title.length;
  const descLength = seo.description.length;

  // Compute live issues list
  const getAuditIssues = () => {
    const issues = [];
    if (!seo.title) {
      issues.push({ text: 'Meta title is missing', type: 'error' });
    } else {
      if (seo.title.length < 30) issues.push({ text: 'Title is short (ideal: 30-60 chars)', type: 'warning' });
      if (seo.title.length > 60) issues.push({ text: 'Title is too long (Google will truncate)', type: 'warning' });
    }

    if (!seo.description) {
      issues.push({ text: 'Meta description is missing', type: 'error' });
    } else {
      if (seo.description.length < 80) issues.push({ text: 'Description is short (ideal: 80-160 chars)', type: 'warning' });
      if (seo.description.length > 160) issues.push({ text: 'Description is too long (will truncate)', type: 'warning' });
    }

    if (!seo.keywords) {
      issues.push({ text: 'Keywords meta tag is missing', type: 'warning' });
    }

    if (!seo.canonicalUrl) {
      issues.push({ text: 'Canonical URL link tag is missing', type: 'warning' });
    }

    if (seo.robotsIndex === 'noindex') {
      issues.push({ text: 'Blocked from index (noindex active)', type: 'warning' });
    }

    return issues;
  };

  const auditIssues = getAuditIssues();

  return (
    <div className="bg-zinc-50 dark:bg-[#0d0d0e] min-h-screen pb-16">
      <div className="sticky top-0 bg-white/85 dark:bg-[#121214]/85 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/80 p-4 flex items-center justify-between z-10 shadow-sm transition-colors">
        <div className="flex items-center gap-4">
          <Link href="/admin/seo/pages" className="p-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 rounded-full transition-colors group">
            <ArrowLeft size={18} className="text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white" />
          </Link>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-zinc-900 dark:text-white">Editing SEO: {pageName}</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{pageUrl}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => setShowJsonInput(true)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-bold text-sm rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <FileJson size={14} /> Inject JSON
          </button>
          <button 
            type="button"
            onClick={handleAutoGenerate}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-bold text-sm rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <RefreshCw size={14} /> Auto-Generate
          </button>
          <button 
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-[#FF4F18] text-white font-bold text-sm rounded-xl hover:bg-[#E03F0D] transition-all duration-200 shadow-[0_4px_14px_rgba(255,79,24,0.35)] hover:shadow-[0_6px_20px_rgba(255,79,24,0.4)] disabled:opacity-50 cursor-pointer"
          >
            <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Editor Form */}
        <div className="lg:col-span-2 space-y-8 animate-fade-in">
          {/* General SEO */}
          <section className="bg-white dark:bg-[#121214] p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800/80 shadow-sm">
            <h2 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6">General SEO</h2>
            
            <div className="space-y-5">
              <div>
                <label className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                  <span>SEO Title</span>
                  <span className={`${titleLength > 60 ? 'text-red-500' : titleLength > 30 ? 'text-green-500' : 'text-zinc-400'}`}>
                    {titleLength} / 60
                  </span>
                </label>
                <input 
                  type="text"
                  value={seo.title}
                  onChange={e => setSeo({...seo, title: e.target.value})}
                  className="w-full bg-zinc-50 dark:bg-[#1A1A1D] border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-[#FF4F18] focus:ring-1 focus:ring-[#FF4F18] transition-all text-zinc-900 dark:text-white text-sm"
                  placeholder="E.g. Best Services | Digitory"
                />
              </div>

              <div>
                <label className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                  <span>Meta Description</span>
                  <span className={`${descLength > 160 ? 'text-red-500' : descLength > 120 ? 'text-green-500' : 'text-zinc-400'}`}>
                    {descLength} / 160
                  </span>
                </label>
                <textarea 
                  value={seo.description}
                  onChange={e => setSeo({...seo, description: e.target.value})}
                  rows={3}
                  className="w-full bg-zinc-50 dark:bg-[#1A1A1D] border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-[#FF4F18] focus:ring-1 focus:ring-[#FF4F18] transition-all text-zinc-900 dark:text-white text-sm resize-none custom-scrollbar"
                  placeholder="Brief description of the page..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Keywords (comma separated)</label>
                <input 
                  type="text"
                  value={seo.keywords}
                  onChange={e => setSeo({...seo, keywords: e.target.value})}
                  className="w-full bg-zinc-50 dark:bg-[#1A1A1D] border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-[#FF4F18] focus:ring-1 focus:ring-[#FF4F18] transition-all text-zinc-900 dark:text-white text-sm"
                  placeholder="marketing, seo, digital"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Canonical URL</label>
                  <input 
                    type="text"
                    value={seo.canonicalUrl}
                    onChange={e => setSeo({...seo, canonicalUrl: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-[#1A1A1D] border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-[#FF4F18] focus:ring-1 focus:ring-[#FF4F18] transition-all text-zinc-900 dark:text-white text-sm"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Slug</label>
                  <input 
                    type="text"
                    value={seo.slug}
                    onChange={e => setSeo({...seo, slug: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-[#1A1A1D] border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-[#FF4F18] focus:ring-1 focus:ring-[#FF4F18] transition-all text-zinc-900 dark:text-white text-sm cursor-not-allowed opacity-70"
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Robots Index</label>
                  <select 
                    value={seo.robotsIndex}
                    onChange={e => setSeo({...seo, robotsIndex: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-[#1A1A1D] border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-[#FF4F18] focus:ring-1 focus:ring-[#FF4F18] transition-all text-zinc-900 dark:text-white text-sm"
                  >
                    <option value="index">Index</option>
                    <option value="noindex">No Index</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Robots Follow</label>
                  <select 
                    value={seo.robotsFollow}
                    onChange={e => setSeo({...seo, robotsFollow: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-[#1A1A1D] border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-[#FF4F18] focus:ring-1 focus:ring-[#FF4F18] transition-all text-zinc-900 dark:text-white text-sm"
                  >
                    <option value="follow">Follow</option>
                    <option value="nofollow">No Follow</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Speed Audit Simulator panel (NEW) */}
          <section className="bg-white dark:bg-[#121214] p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Page Performance & Speed Review</h2>
              <div className="flex gap-2 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl">
                {(['desktop', 'mobile'] as const).map(mode => (
                  <button
                    type="button"
                    key={mode}
                    onClick={() => setAuditMode(mode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${auditMode === mode ? 'bg-white dark:bg-zinc-800 text-[#FF4F18] shadow-xs' : 'text-zinc-500'}`}
                  >
                    {mode === 'desktop' ? 'Desktop' : 'Mobile'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { label: 'Performance', score: scores.performance },
                { label: 'Accessibility', score: scores.accessibility },
                { label: 'Best Practices', score: scores.bestPractices },
                { label: 'SEO Validation', score: scores.seo },
              ].map((m, i) => {
                const color = m.score >= 90 ? 'text-green-500' : m.score >= 50 ? 'text-yellow-500' : 'text-red-500';
                return (
                  <div key={i} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-150 dark:border-zinc-850">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide mb-1">{m.label}</p>
                    <p className={`text-3xl font-black ${color}`}>{m.score}</p>
                  </div>
                );
              })}
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-4 border border-zinc-200 dark:border-zinc-850 rounded-2xl space-y-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Core Web Vitals Indicators</span>
                <button
                  type="button"
                  onClick={runSpeedAudit}
                  disabled={auditRunning}
                  className="bg-[#FF4F18] text-white text-[10px] font-extrabold px-3 py-1 rounded-full cursor-pointer hover:bg-[#E03F0D] disabled:opacity-50 transition-all"
                >
                  {auditRunning ? 'Simulating Audit...' : 'Re-Run Speed Test'}
                </button>
              </div>

              {[
                { label: 'Largest Contentful Paint (LCP)', value: scores.lcp, rating: parseFloat(scores.lcp) <= 2.0 ? 'Good' : 'Needs Optimization' },
                { label: 'Interaction to Next Paint (INP)', value: scores.inp, rating: parseInt(scores.inp) <= 100 ? 'Good' : 'Needs Optimization' },
                { label: 'Cumulative Layout Shift (CLS)', value: scores.cls, rating: parseFloat(scores.cls) <= 0.05 ? 'Good' : 'Needs Optimization' }
              ].map((cw, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 dark:text-zinc-400 font-semibold">{cw.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold font-mono">{cw.value}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold ${cw.rating === 'Good' ? 'bg-green-100 text-green-700 dark:bg-green-500/10' : 'bg-amber-100 text-amber-700'}`}>
                      {cw.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* SEO Warnings Tracker (NEW) */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wide">SEO Checks & Recommendations</h3>
              {auditIssues.length === 0 ? (
                <div className="p-3 bg-green-50 dark:bg-green-950/15 border border-green-200 dark:border-green-800/20 text-green-600 dark:text-green-400 text-xs font-semibold rounded-xl">
                  🎉 Fantastic! On-page title, description, keywords, and indexing are optimal.
                </div>
              ) : (
                <div className="space-y-2">
                  {auditIssues.map((issue, idx) => (
                    <div 
                      key={idx}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 ${issue.type === 'error' ? 'bg-red-50 dark:bg-red-950/15 border-red-200/50 dark:border-red-900/30 text-red-650 dark:text-red-400' : 'bg-amber-50 dark:bg-amber-950/15 border-amber-200/50 dark:border-amber-900/30 text-amber-600 dark:text-amber-400'}`}
                    >
                      <span>{issue.type === 'error' ? '🔴' : '⚠️'}</span>
                      <span>{issue.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Open Graph & Twitter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white dark:bg-[#121214] p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800/80 shadow-sm">
              <h2 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6">Open Graph</h2>
              <div className="space-y-4">
                <input 
                  type="text" placeholder="OG Title" value={seo.openGraph.title}
                  onChange={e => setSeo({...seo, openGraph: {...seo.openGraph, title: e.target.value}})}
                  className="w-full bg-zinc-50 dark:bg-[#1A1A1D] border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-[#FF4F18] focus:ring-1 focus:ring-[#FF4F18] transition-all text-zinc-900 dark:text-white text-sm"
                />
                <textarea 
                  placeholder="OG Description" value={seo.openGraph.description} rows={2}
                  onChange={e => setSeo({...seo, openGraph: {...seo.openGraph, description: e.target.value}})}
                  className="w-full bg-zinc-50 dark:bg-[#1A1A1D] border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-[#FF4F18] focus:ring-1 focus:ring-[#FF4F18] transition-all text-zinc-900 dark:text-white text-sm resize-none custom-scrollbar"
                />
                <input 
                  type="text" placeholder="OG Image URL" value={seo.openGraph.image}
                  onChange={e => setSeo({...seo, openGraph: {...seo.openGraph, image: e.target.value}})}
                  className="w-full bg-zinc-50 dark:bg-[#1A1A1D] border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-[#FF4F18] focus:ring-1 focus:ring-[#FF4F18] transition-all text-zinc-900 dark:text-white text-sm"
                />
              </div>
            </section>

            <section className="bg-white dark:bg-[#121214] p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800/80 shadow-sm">
              <h2 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6">Twitter Card</h2>
              <div className="space-y-4">
                <input 
                  type="text" placeholder="Twitter Title" value={seo.twitterCard.title}
                  onChange={e => setSeo({...seo, twitterCard: {...seo.twitterCard, title: e.target.value}})}
                  className="w-full bg-zinc-50 dark:bg-[#1A1A1D] border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-[#FF4F18] focus:ring-1 focus:ring-[#FF4F18] transition-all text-zinc-900 dark:text-white text-sm"
                />
                <textarea 
                  placeholder="Twitter Description" value={seo.twitterCard.description} rows={2}
                  onChange={e => setSeo({...seo, twitterCard: {...seo.twitterCard, description: e.target.value}})}
                  className="w-full bg-zinc-50 dark:bg-[#1A1A1D] border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-[#FF4F18] focus:ring-1 focus:ring-[#FF4F18] transition-all text-zinc-900 dark:text-white text-sm resize-none custom-scrollbar"
                />
                <input 
                  type="text" placeholder="Twitter Image URL" value={seo.twitterCard.image}
                  onChange={e => setSeo({...seo, twitterCard: {...seo.twitterCard, image: e.target.value}})}
                  className="w-full bg-zinc-50 dark:bg-[#1A1A1D] border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-[#FF4F18] focus:ring-1 focus:ring-[#FF4F18] transition-all text-zinc-900 dark:text-white text-sm"
                />
              </div>
            </section>
          </div>

          {/* Schema Builder */}
          <section className="bg-white dark:bg-[#121214] p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800/80 shadow-sm">
            <h2 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6">Schema Markup (JSON-LD)</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Schema Type</label>
                <select 
                  value={seo.schemaType}
                  onChange={e => setSeo({...seo, schemaType: e.target.value})}
                  className="w-full bg-zinc-50 dark:bg-[#1A1A1D] border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-[#FF4F18] focus:ring-1 focus:ring-[#FF4F18] transition-all text-zinc-900 dark:text-white text-sm"
                >
                  {['None', 'Organization', 'Product', 'Article', 'FAQ', 'Breadcrumb', 'LocalBusiness', 'Custom'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              {seo.schemaType !== 'None' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">JSON-LD Code</label>
                  <textarea 
                    value={seo.schemaData}
                    onChange={e => setSeo({...seo, schemaData: e.target.value})}
                    rows={8}
                    className="w-full bg-zinc-900 dark:bg-black text-green-400 border border-zinc-800 rounded-xl p-4 font-mono text-sm focus:outline-none focus:border-[#FF4F18] focus:ring-1 focus:ring-[#FF4F18] transition-all resize-none custom-scrollbar"
                    placeholder='{"@context": "https://schema.org", "@type": "Article", ...}'
                  />
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Live Previews */}
        <div className="space-y-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <section className="bg-white dark:bg-[#121214] p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800/80 shadow-sm sticky top-24 space-y-8">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6">Google Snippet Preview</h2>
              <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer text-left">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-zinc-100 border border-zinc-200 rounded-full overflow-hidden flex items-center justify-center">
                    <span className="text-xs font-black text-zinc-700">DG</span>
                  </div>
                  <div>
                    <div className="text-sm text-zinc-900 font-medium">Digitory</div>
                    <div className="text-[12px] text-zinc-650 font-mono">https://digitory.com{pageUrl}</div>
                  </div>
                </div>
                <h3 className="text-[#1a0dab] text-xl font-medium hover:underline cursor-pointer truncate">
                  {seo.title || 'Page Title Example'}
                </h3>
                <p className="text-[#4d5156] text-sm mt-1 line-clamp-2 leading-snug">
                  {seo.description || 'Provide a meta description to see how it will appear in search results.'}
                </p>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6">Social Card (Twitter)</h2>
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-[#1A1A1D] text-left">
                <div className="h-40 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border-b border-zinc-200 dark:border-zinc-800">
                  {seo.twitterCard.image || seo.openGraph.image ? (
                    <img src={seo.twitterCard.image || seo.openGraph.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-zinc-400 dark:text-zinc-600 text-sm font-bold uppercase tracking-wider">1200 x 630</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">digitory.com</div>
                  <div className="font-extrabold text-zinc-900 dark:text-white leading-tight truncate text-lg">
                    {seo.twitterCard.title || seo.openGraph.title || seo.title || 'Social Title Example'}
                  </div>
                  <div className="text-zinc-500 dark:text-zinc-400 text-sm mt-1 line-clamp-1 font-medium">
                    {seo.twitterCard.description || seo.openGraph.description || seo.description || 'Social description preview...'}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

      </div>

      {showJsonInput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs animate-fade-in" onClick={() => setShowJsonInput(false)} />
          <div className="relative bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl z-10">
            <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white mb-4">Inject Raw SEO JSON</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed font-medium">
              Paste a raw JSON object containing SEO configurations (e.g. title, description, keywords, canonicalUrl, robotsIndex, robotsFollow, openGraph, twitterCard).
            </p>
            <textarea 
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              rows={12}
              placeholder={`{\n  "title": "My Page Title",\n  "description": "Meta description content",\n  "keywords": ["tag1", "tag2"],\n  "robotsIndex": "index",\n  "openGraph": {\n    "title": "OG Title",\n    "image": "https://..."\n  }\n}`}
              className="w-full bg-zinc-900 dark:bg-black text-green-400 border border-zinc-800 rounded-xl p-4 font-mono text-xs focus:outline-none focus:border-[#FF4F18] focus:ring-1 focus:ring-[#FF4F18] transition-all resize-none custom-scrollbar"
            />
            <div className="pt-4 flex gap-3">
              <button 
                type="button" 
                onClick={() => setShowJsonInput(false)}
                className="flex-1 px-4 py-2.5 font-bold text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleInjectJson}
                className="flex-1 bg-[#FF4F18] hover:bg-[#E03F0D] text-white py-2.5 rounded-full text-sm font-bold transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                Apply & Inject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
