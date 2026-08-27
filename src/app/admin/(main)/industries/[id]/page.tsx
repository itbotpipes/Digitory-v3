'use client';

import React, { useState, useEffect, use } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';

interface IndustryEditorProps {
  params: Promise<{ id: string }>;
}

export default function AdminIndustryEditor({ params }: IndustryEditorProps) {
  const resolvedParams = use(params);
  const isNew = resolvedParams.id === 'new';

  const [formData, setFormData] = useState({
    slug: '',
    shortLabel: '',
    title: '',
    badge: '',
    subtitle: '',
    description: '',
    ctaText: '',
    trustText: '',
    heroImage: '',
    image: '',
    icon: '',
    gridTitle: '',
    gridDesc: '',
    opsTitle: '',
    opsParagraph: '',
    opsHighlights: '',
    featuresTitle: '',
    features: [] as any[],
    whyChooseTitle: '',
    whyChoose: [] as string[],
    ctaBlock: { title: '', desc: '' },

    heroTitle: '',
    legacyTitle: '',
    legacyItems: [] as any[],
    workflowTitle: '',
    workflowDesc: '',
    workflowItems: [] as any[],
    controlTitle: '',
    controlDesc: '',
    controlItems: [] as any[],
    efficiencyTitle: '',
    efficiencyItems: [] as any[],
    faqs: [] as any[],
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const heroImageInputRef = React.useRef<HTMLInputElement>(null);
  const cardImageInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'heroImage' | 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldName);
    setMessage('');

    try {
      const token = localStorage.getItem('admin_token') || '';
      const data = new FormData();
      data.append('file', file);
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/media`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: data,
      });

      if (!res.ok) throw new Error('Upload failed');
      const json = await res.json();
      const cloudUrl = json.data?.url || json.url;
      
      setFormData(prev => ({ ...prev, [fieldName]: cloudUrl }));
      setMessage(`${fieldName === 'heroImage' ? 'Hero image' : 'Card image'} uploaded successfully!`);
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || 'Failed to upload image');
      alert(err.message || 'Failed to upload image');
    } finally {
      setUploadingField(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }

    const cachedPerms = localStorage.getItem('admin_permissions');
    if (cachedPerms) {
      try {
        const perms: string[] = JSON.parse(cachedPerms);
        if (!perms.includes('*') && !perms.includes('manage_industries')) {
          alert('You do not have permission to manage industries');
          window.location.href = '/admin/dashboard';
          return;
        }
      } catch (_) {}
    }

    if (!isNew) {
      fetchIndustry(token);
    }
  }, [isNew, resolvedParams.id]);

  const fetchIndustry = async (token: string) => {
    try {
      const res = await api.get(`/industries/${resolvedParams.id}`, token);
      const s = res.data;
      setFormData({
        slug: s.slug || '',
        shortLabel: s.shortLabel || '',
        title: s.title || '',
        badge: s.badge || '',
        subtitle: s.subtitle || '',
        description: s.description || '',
        ctaText: s.ctaText || '',
        trustText: s.trustText || '',
        heroImage: s.heroImage || '',
        image: s.image || '',
        icon: s.icon || '',
        gridTitle: s.gridTitle || '',
        gridDesc: s.gridDesc || '',
        opsTitle: s.opsTitle || '',
        opsParagraph: s.opsParagraph || '',
        opsHighlights: s.opsHighlights || '',
        featuresTitle: s.featuresTitle || '',
        features: s.features || [],
        whyChooseTitle: s.whyChooseTitle || '',
        whyChoose: s.whyChoose || [],
        ctaBlock: s.ctaBlock || { title: '', desc: '' },

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
      });
    } catch (err) {
      console.error(err);
      setMessage('Failed to load industry');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    const token = localStorage.getItem('admin_token');

    try {
      if (isNew) {
        await api.post('/industries', formData, token!);
        setMessage('Industry created successfully!');
        setTimeout(() => { window.location.href = '/admin/dashboard?tab=industries'; }, 1000);
      } else {
        await api.put(`/industries/${resolvedParams.id}`, formData, token!);
        setMessage('Industry updated successfully!');
      }
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || 'Failed to save industry');
    } finally {
      setSaving(false);
    }
  };

  const addArrayItem = (key: string, defaultItem: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: [...prev[key], defaultItem] }));
  };

  const updateArrayItem = (key: string, index: number, field: string, value: string) => {
    setFormData((prev: any) => {
      const newArray = [...prev[key]];
      if (typeof newArray[index] === 'string') {
        newArray[index] = value;
      } else {
        newArray[index][field] = value;
      }
      return { ...prev, [key]: newArray };
    });
  };

  const removeArrayItem = (key: string, index: number) => {
    setFormData((prev: any) => {
      const newArray = [...prev[key]];
      newArray.splice(index, 1);
      return { ...prev, [key]: newArray };
    });
  };

  const updateObjectField = (key: string, field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value }
    }));
  };

  const inputCls = 'w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F18]';
  const innerInputCls = 'w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900';

  if (loading) return <div className="p-8 text-center">Loading editor...</div>;

  return (
    <div className="bg-white dark:bg-[#111111] p-6 md:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <h2 className="text-2xl font-bold">{isNew ? 'Create New Industry' : 'Edit Industry'}</h2>
        <Link href="/admin/dashboard?tab=industries" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-medium">
          &larr; Back to Dashboard
        </Link>
      </div>

      {message && (
        <div className={`p-4 rounded-xl mb-6 font-medium ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 text-[#FF4F18] rounded-xl mb-8 font-medium text-sm border border-orange-100 dark:border-orange-800/30">
        💡 <strong>Pro Tip:</strong> In any Title field below, you can wrap words in asterisks to make them orange on the website! For example: <code>Optimized operations for *Bars & Restaurants*</code>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* BASIC INFO */}
        <section className="space-y-6">
          <h3 className="text-lg font-extrabold text-[#FF4F18]">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Title (Internal) *</label>
              <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug *</label>
              <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required className={inputCls} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Hero Title (Public)</label>
              <input type="text" value={formData.heroTitle} onChange={e => setFormData({...formData, heroTitle: e.target.value})} placeholder="e.g. Optimized operations for *Bars & Restaurants*" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Short Label (for menus) *</label>
              <input type="text" value={formData.shortLabel} onChange={e => setFormData({...formData, shortLabel: e.target.value})} required className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Badge (e.g. 01 • Café OS)</label>
              <input type="text" value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CTA Button Text (e.g. Book a Demo)</label>
              <input type="text" value={formData.ctaText} onChange={e => setFormData({...formData, ctaText: e.target.value})} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Trust Text</label>
              <input type="text" value={formData.trustText} onChange={e => setFormData({...formData, trustText: e.target.value})} className={inputCls} />
            </div>

            {/* Hero Image */}
            <div className="md:col-span-2 border-t border-zinc-150 dark:border-zinc-800 pt-6">
              <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">Hero Page Banner Image</label>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {formData.heroImage ? (
                  <div className="relative w-48 aspect-[16/9] rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 group">
                    <img src={formData.heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, heroImage: '' })}
                        className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-700 transition-colors cursor-pointer"
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-48 aspect-[16/9] rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center p-4 text-center text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-900/20">
                    <span className="text-[11px] font-medium leading-tight">No Hero Image</span>
                  </div>
                )}
                           <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      disabled={uploadingField !== null}
                      onClick={() => heroImageInputRef.current?.click()}
                      className="bg-[#FF4F18] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#E03F0D] disabled:opacity-50 transition-colors cursor-pointer w-max"
                    >
                      {uploadingField === 'heroImage' ? 'Uploading to Cloudinary...' : 'Upload Hero Image'}
                    </button>
                    {formData.heroImage && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, heroImage: '' })}
                        className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 px-3 py-2 rounded-xl text-xs font-bold hover:bg-red-500/20 transition-colors cursor-pointer"
                      >
                        Remove Image
                      </button>
                    )}
                  </div>
                  <input
                    ref={heroImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageUpload(e, 'heroImage')}
                    className="hidden"
                  />
                  {formData.heroImage && (
                    <input 
                      type="text" 
                      value={formData.heroImage} 
                      onChange={e => setFormData({...formData, heroImage: e.target.value})} 
                      className={`${inputCls} text-xs py-1.5 font-mono max-w-sm`} 
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Grid Card Image */}
            <div className="md:col-span-2 border-t border-zinc-150 dark:border-zinc-800 pt-6">
              <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">Grid Card Preview Image</label>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {formData.image ? (
                  <div className="relative w-48 aspect-[16/9] rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 group">
                    <img src={formData.image} alt="Card Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-700 transition-colors cursor-pointer"
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-48 aspect-[16/9] rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center p-4 text-center text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-900/20">
                    <span className="text-[11px] font-medium leading-tight">No Card Image</span>
                  </div>
                )}
                
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      disabled={uploadingField !== null}
                      onClick={() => cardImageInputRef.current?.click()}
                      className="bg-[#FF4F18] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#E03F0D] disabled:opacity-50 transition-colors cursor-pointer w-max"
                    >
                      {uploadingField === 'image' ? 'Uploading to Cloudinary...' : 'Upload Card Image'}
                    </button>
                    {formData.image && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 px-3 py-2 rounded-xl text-xs font-bold hover:bg-red-500/20 transition-colors cursor-pointer"
                      >
                        Remove Image
                      </button>
                    )}
                  </div>
                  <input
                    ref={cardImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageUpload(e, 'image')}
                    className="hidden"
                  />
                  {formData.image && (
                    <input 
                      type="text" 
                      value={formData.image} 
                      onChange={e => setFormData({...formData, image: e.target.value})} 
                      className={`${inputCls} text-xs py-1.5 font-mono max-w-sm`} 
                    />
                  )}
                </div>
              </div>
            </div>

          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Subtitle</label>
            <input type="text" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className={inputCls} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} className={inputCls} />
          </div>

          {/* Grid Information */}
          <div className="border-t border-zinc-150 dark:border-zinc-800 pt-6 space-y-6">
            <h4 className="text-md font-bold text-zinc-800 dark:text-zinc-200">Main Grid Headers</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Grid Section Heading</label>
                <input type="text" value={formData.gridTitle} onChange={e => setFormData({...formData, gridTitle: e.target.value})} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Grid Section Description</label>
                <input type="text" value={formData.gridDesc} onChange={e => setFormData({...formData, gridDesc: e.target.value})} className={inputCls} />
              </div>
            </div>
          </div>

          {/* Operational Highlight */}
          <div className="border-t border-zinc-150 dark:border-zinc-800 pt-6 space-y-4">
            <h4 className="text-md font-bold text-zinc-800 dark:text-zinc-200">Operational Highlight Section</h4>
            <div>
              <label className="block text-sm font-medium mb-1">Highlight Title</label>
              <input type="text" placeholder="e.g. Turn tables faster with unified systems" value={formData.opsTitle} onChange={e => setFormData({...formData, opsTitle: e.target.value})} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Highlight Description</label>
              <textarea value={formData.opsParagraph} onChange={e => setFormData({...formData, opsParagraph: e.target.value})} rows={3} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Orange Highlights (comma separated words to make orange)</label>
              <input type="text" placeholder="e.g. faster, unified" value={formData.opsHighlights} onChange={e => setFormData({...formData, opsHighlights: e.target.value})} className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Icon (SVG String)</label>
            <textarea value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} rows={2} className={`${inputCls} font-mono text-xs`} />
          </div>
        </section>

        {/* LEGACY SYSTEMS */}
        <section className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-[#FF4F18]">Legacy Systems Fail</h3>
            <button type="button" onClick={() => addArrayItem('legacyItems', { title: '', body: '', stat: '', statLabel: '' })} className="text-sm font-bold bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700">+ Add Legacy Item</button>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Section Title</label>
            <input type="text" placeholder="e.g. Where legacy systems *fail QSR*" value={formData.legacyTitle} onChange={e => setFormData({...formData, legacyTitle: e.target.value})} className={inputCls} />
          </div>
          {formData.legacyItems.map((item: any, idx: number) => (
            <div key={idx} className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 relative">
              <button type="button" onClick={() => removeArrayItem('legacyItems', idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm font-bold">Remove</button>
              <div className="space-y-3 pr-16">
                <input type="text" placeholder="Title (e.g. Lagging Inventory)" value={item.title} onChange={e => updateArrayItem('legacyItems', idx, 'title', e.target.value)} className={innerInputCls} />
                <textarea placeholder="Body" rows={2} value={item.body} onChange={e => updateArrayItem('legacyItems', idx, 'body', e.target.value)} className={innerInputCls} />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Stat (e.g. 40%)" value={item.stat} onChange={e => updateArrayItem('legacyItems', idx, 'stat', e.target.value)} className={innerInputCls} />
                  <input type="text" placeholder="Stat Label" value={item.statLabel} onChange={e => updateArrayItem('legacyItems', idx, 'statLabel', e.target.value)} className={innerInputCls} />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* MODERN WORKFLOW */}
        <section className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-[#FF4F18]">Modern Workflow</h3>
            <button type="button" onClick={() => addArrayItem('workflowItems', { n: '', title: '', desc: '' })} className="text-sm font-bold bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700">+ Add Workflow Item</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Section Title</label>
              <input type="text" placeholder="e.g. A modern system should connect *every workflow automatically*" value={formData.workflowTitle} onChange={e => setFormData({...formData, workflowTitle: e.target.value})} className={inputCls} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Section Description</label>
              <textarea rows={2} value={formData.workflowDesc} onChange={e => setFormData({...formData, workflowDesc: e.target.value})} className={inputCls} />
            </div>
          </div>
          {formData.workflowItems.map((item: any, idx: number) => (
            <div key={idx} className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 relative">
              <button type="button" onClick={() => removeArrayItem('workflowItems', idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm font-bold">Remove</button>
              <div className="space-y-3 pr-16">
                <input type="text" placeholder="Number / Tag (e.g. 01 / Instant Routing)" value={item.n || item.title} onChange={e => { updateArrayItem('workflowItems', idx, 'title', e.target.value); updateArrayItem('workflowItems', idx, 'n', e.target.value); }} className={innerInputCls} />
                <textarea placeholder="Description" rows={2} value={item.desc} onChange={e => updateArrayItem('workflowItems', idx, 'desc', e.target.value)} className={innerInputCls} />
              </div>
            </div>
          ))}
        </section>

        {/* EFFICIENCY GAINS */}
        <section className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-[#FF4F18]">Efficiency Gains (Stats)</h3>
            <button type="button" onClick={() => addArrayItem('efficiencyItems', { value: '', label: '', desc: '' })} className="text-sm font-bold bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700">+ Add Stat</button>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Section Title</label>
            <input type="text" placeholder="e.g. Quantifiable efficiency gains *recorded by our partners*" value={formData.efficiencyTitle} onChange={e => setFormData({...formData, efficiencyTitle: e.target.value})} className={inputCls} />
          </div>
          {formData.efficiencyItems.map((item: any, idx: number) => (
            <div key={idx} className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 relative">
              <button type="button" onClick={() => removeArrayItem('efficiencyItems', idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm font-bold">Remove</button>
              <div className="space-y-3 pr-16">
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Value (e.g. 15s)" value={item.value} onChange={e => updateArrayItem('efficiencyItems', idx, 'value', e.target.value)} className={innerInputCls} />
                  <input type="text" placeholder="Label (e.g. Average Order Processing)" value={item.label} onChange={e => updateArrayItem('efficiencyItems', idx, 'label', e.target.value)} className={innerInputCls} />
                </div>
                <textarea placeholder="Description (e.g. Simplified queue busting...)" rows={2} value={item.desc} onChange={e => updateArrayItem('efficiencyItems', idx, 'desc', e.target.value)} className={innerInputCls} />
              </div>
            </div>
          ))}
        </section>

        {/* CONTROL SECTION */}
        <section className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-[#FF4F18]">Control Section</h3>
            <button type="button" onClick={() => addArrayItem('controlItems', { title: '', desc: '' })} className="text-sm font-bold bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700">+ Add Control Item</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Section Title</label>
              <input type="text" placeholder="e.g. Total control over your *menu, staff and sales numbers*" value={formData.controlTitle} onChange={e => setFormData({...formData, controlTitle: e.target.value})} className={inputCls} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Section Description</label>
              <textarea rows={3} value={formData.controlDesc} onChange={e => setFormData({...formData, controlDesc: e.target.value})} className={inputCls} />
            </div>
          </div>
          {formData.controlItems.map((item: any, idx: number) => (
            <div key={idx} className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 relative">
              <button type="button" onClick={() => removeArrayItem('controlItems', idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm font-bold">Remove</button>
              <div className="space-y-3 pr-16">
                <input type="text" placeholder="Title (e.g. 100% cloud)" value={item.title} onChange={e => updateArrayItem('controlItems', idx, 'title', e.target.value)} className={innerInputCls} />
                <textarea placeholder="Description" rows={2} value={item.desc} onChange={e => updateArrayItem('controlItems', idx, 'desc', e.target.value)} className={innerInputCls} />
              </div>
            </div>
          ))}
        </section>

        {/* FEATURES */}
        <section className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-[#FF4F18]">Features</h3>
            <button type="button" onClick={() => addArrayItem('features', { title: '', desc: '', linkText: '', linkHref: '' })} className="text-sm font-bold bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700">+ Add Feature</button>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Features Section Title</label>
            <input type="text" placeholder="e.g. Built for busy restaurants" value={formData.featuresTitle} onChange={e => setFormData({...formData, featuresTitle: e.target.value})} className={inputCls} />
          </div>
          {formData.features.map((item, idx) => (
            <div key={idx} className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 relative">
              <button type="button" onClick={() => removeArrayItem('features', idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm font-bold">Remove</button>
              <div className="space-y-3 pr-16">
                <input type="text" placeholder="Feature Title" value={item.title} onChange={e => updateArrayItem('features', idx, 'title', e.target.value)} className={innerInputCls} />
                <textarea placeholder="Feature Description" rows={2} value={item.desc} onChange={e => updateArrayItem('features', idx, 'desc', e.target.value)} className={innerInputCls} />
                <input type="text" placeholder="Link Text (optional)" value={item.linkText || ''} onChange={e => updateArrayItem('features', idx, 'linkText', e.target.value)} className={innerInputCls} />
                <input type="text" placeholder="Link URL (optional, e.g. /solutions/pos)" value={item.linkHref || ''} onChange={e => updateArrayItem('features', idx, 'linkHref', e.target.value)} className={innerInputCls} />
              </div>
            </div>
          ))}
        </section>

        {/* WHY CHOOSE */}
        <section className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-[#FF4F18]">Why Choose (bullet points)</h3>
            <button type="button" onClick={() => addArrayItem('whyChoose', '')} className="text-sm font-bold bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700">+ Add Point</button>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Section Title</label>
            <input type="text" placeholder="e.g. Why choose Digitory?" value={formData.whyChooseTitle} onChange={e => setFormData({...formData, whyChooseTitle: e.target.value})} className={inputCls} />
          </div>
          {formData.whyChoose.map((item, idx) => (
            <div key={idx} className="flex gap-3 items-center">
              <input type="text" placeholder={`Point ${idx + 1}`} value={item} onChange={e => updateArrayItem('whyChoose', idx, '', e.target.value)} className={`${innerInputCls} flex-1`} />
              <button type="button" onClick={() => removeArrayItem('whyChoose', idx)} className="text-red-500 hover:text-red-700 text-sm font-bold shrink-0">Remove</button>
            </div>
          ))}
        </section>

        {/* SECTION: FAQs */}
        <section className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-[#FF4F18]">Frequently Asked Questions</h3>
            <button type="button" onClick={() => addArrayItem('faqs', { question: '', answer: '' })} className="text-sm font-bold bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700">+ Add FAQ</button>
          </div>
          {formData.faqs.map((item: any, idx: number) => (
            <div key={idx} className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 relative">
              <button type="button" onClick={() => removeArrayItem('faqs', idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm font-bold">Remove</button>
              <div className="space-y-3 pr-16">
                <input type="text" placeholder="Question" value={item.question} onChange={e => updateArrayItem('faqs', idx, 'question', e.target.value)} className={innerInputCls} />
                <textarea placeholder="Answer" rows={2} value={item.answer} onChange={e => updateArrayItem('faqs', idx, 'answer', e.target.value)} className={innerInputCls} />
              </div>
            </div>
          ))}
        </section>

        {/* CTA BLOCK */}
        <section className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <h3 className="text-lg font-extrabold text-[#FF4F18]">Bottom CTA Block</h3>
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <input type="text" placeholder="CTA Title" value={formData.ctaBlock.title} onChange={e => updateObjectField('ctaBlock', 'title', e.target.value)} className={innerInputCls} />
            <textarea placeholder="CTA Description" rows={3} value={formData.ctaBlock.desc} onChange={e => updateObjectField('ctaBlock', 'desc', e.target.value)} className={innerInputCls} />
          </div>
        </section>

        {/* SUBMIT */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-4 sticky bottom-6 bg-white/80 dark:bg-[#111111]/80 backdrop-blur-md p-4 rounded-2xl shadow-sm">
          <Link href="/admin/dashboard?tab=industries" className="px-6 py-3 font-bold rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 font-bold rounded-xl bg-[#FF4F18] text-white hover:bg-[#E03F0D] transition-colors disabled:opacity-50 shadow-[0_4px_14px_rgba(255,79,24,0.3)]"
          >
            {saving ? 'Saving...' : 'Save Industry'}
          </button>
        </div>
      </form>
    </div>
  );
}
