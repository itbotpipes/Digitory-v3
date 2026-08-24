'use client';

import React, { useState, useEffect, use } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';

interface SolutionEditorProps {
  params: Promise<{ id: string }>;
}

export default function AdminSolutionEditor({ params }: SolutionEditorProps) {
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
    image: '',
    gridTitle: '',
    gridDesc: '',
    opsTitle: '',
    opsParagraph: '',
    opsHighlights: '',
    icon: '',
    whyChoose: [] as any[],
    featuresTitle: '',
    features: [] as any[],
    businessTypes: [] as any[],
    integrations: [] as any[],
    extraGrowth: { title: '', desc: '' },
    extraOwnersChoice: { title: '', desc: '' },
    supportItems: [] as string[],
    securityItems: [] as string[],
    ctaBlock: { title: '', desc: '' },
    category: '',
    layerTitle: '',
    layerDesc: '',
    metricsTitle: '',
    metricsItems: [] as any[],
    businessTypesTitle: '',
    businessTypesDesc: '',
    faqs: [] as any[],
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
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

      if (res.status === 401) {
        localStorage.removeItem('admin_token');
        alert('Your session has expired. Please log in again.');
        window.location.href = '/admin/login';
        return;
      }

      if (!res.ok) throw new Error('Upload failed');
      const json = await res.json();
      const cloudUrl = json.data?.url || json.url;
      
      setFormData(prev => ({ ...prev, image: cloudUrl }));
      setMessage('Solution image uploaded successfully!');
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || 'Failed to upload image');
      alert(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

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
        if (!perms.includes('*') && !perms.includes('manage_solutions')) {
          alert('You do not have permission to manage solutions');
          window.location.href = '/admin/dashboard';
          return;
        }
      } catch (_) {}
    }
    
    if (!isNew) {
      fetchSolution(token);
    }
  }, [isNew, resolvedParams.id]);

  const fetchSolution = async (token: string) => {
    try {
      const res = await api.get(`/solutions/${resolvedParams.id}`, token);
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
        image: s.image || '',
        gridTitle: s.gridTitle || '',
        gridDesc: s.gridDesc || '',
        opsTitle: s.opsTitle || '',
        opsParagraph: s.opsParagraph || '',
        opsHighlights: s.opsHighlights || '',
        icon: s.icon || '',
        whyChoose: s.whyChoose || [],
        featuresTitle: s.featuresTitle || '',
        features: s.features || [],
        businessTypes: s.businessTypes || [],
        integrations: s.integrations || [],
        extraGrowth: s.extraGrowth || { title: '', desc: '' },
        extraOwnersChoice: s.extraOwnersChoice || { title: '', desc: '' },
        supportItems: s.supportItems || [],
        securityItems: s.securityItems || [],
        ctaBlock: s.ctaBlock || { title: '', desc: '' },
        category: s.category || '',
        layerTitle: s.layerTitle || '',
        layerDesc: s.layerDesc || '',
        metricsTitle: s.metricsTitle || '',
        metricsItems: s.metricsItems || [],
        businessTypesTitle: s.businessTypesTitle || '',
        businessTypesDesc: s.businessTypesDesc || '',
        faqs: s.faqs || [],
      });
    } catch (err) {
      console.error(err);
      setMessage('Failed to load solution');
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
        await api.post('/solutions', formData, token!);
        setMessage('Solution created successfully!');
        setTimeout(() => { window.location.href = '/admin/dashboard'; }, 1000);
      } else {
        await api.put(`/solutions/${resolvedParams.id}`, formData, token!);
        setMessage('Solution updated successfully!');
      }
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || 'Failed to save solution');
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
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
  };

  if (loading) {
    return <div className="p-8 text-center">Loading editor...</div>;
  }

  return (
    <div className="bg-white dark:bg-[#111111] p-6 md:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <h2 className="text-2xl font-bold">{isNew ? 'Create New Solution' : 'Edit Solution'}</h2>
        <Link href="/admin/dashboard" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-medium">
          &larr; Back to Dashboard
        </Link>
      </div>

      {message && (
        <div className={`p-4 rounded-xl mb-6 font-medium ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 text-[#FF4F18] rounded-xl mb-8 font-medium text-sm border border-orange-100 dark:border-orange-800/30">
        💡 <strong>Pro Tip:</strong> In any Title field below, you can wrap words in asterisks to make them orange on the website! For example: <code>Real operational *outcomes & metrics*</code>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* SECTION: BASIC INFO */}
        <section className="space-y-6">
          <h3 className="text-lg font-extrabold text-[#FF4F18]">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F18]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={e => setFormData({...formData, slug: e.target.value})}
                required
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F18]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category (e.g. core, frontend, etc.)</label>
              <input
                type="text"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F18]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Short Label (for menus) *</label>
              <input
                type="text"
                value={formData.shortLabel}
                onChange={e => setFormData({...formData, shortLabel: e.target.value})}
                required
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F18]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Badge (e.g. 01 • POS)</label>
              <input
                type="text"
                value={formData.badge}
                onChange={e => setFormData({...formData, badge: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F18]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Subtitle</label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={e => setFormData({...formData, subtitle: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F18]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description (Landing page details)</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F18]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-50/20 dark:bg-zinc-900/10 p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50">
            <div className="md:col-span-2">
              <span className="text-xs font-bold text-[#FF4F18] uppercase tracking-wider block mb-2">Grid Box Settings (Landing Page Grid)</span>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Grid Box Title (Fallback: local feature title)</label>
              <input
                type="text"
                value={formData.gridTitle}
                onChange={e => setFormData({...formData, gridTitle: e.target.value})}
                placeholder="e.g. Orders & billing"
                className="w-full px-4 py-2 rounded-xl text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F18]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Grid Box Short Summary (Fallback: local short summary)</label>
              <input
                type="text"
                value={formData.gridDesc}
                onChange={e => setFormData({...formData, gridDesc: e.target.value})}
                placeholder="e.g. Take dine-in, takeaway, online..."
                className="w-full px-4 py-2 rounded-xl text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F18]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 bg-orange-50/10 dark:bg-orange-950/5 p-5 rounded-2xl border border-orange-200/30 dark:border-orange-950/20">
            <div>
              <span className="text-xs font-bold text-[#FF4F18] uppercase tracking-wider block mb-2">Operations Reveal Section Settings</span>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Section Title (Fallback: What happens when operations get fragmented?)</label>
              <input
                type="text"
                value={formData.opsTitle}
                onChange={e => setFormData({...formData, opsTitle: e.target.value})}
                placeholder="e.g. What happens when operations get fragmented?"
                className="w-full px-4 py-2 rounded-xl text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F18]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Section Paragraph Content (Use space-separated words)</label>
              <textarea
                value={formData.opsParagraph}
                onChange={e => setFormData({...formData, opsParagraph: e.target.value})}
                placeholder="Most business operators rely on disconnected systems..."
                rows={4}
                className="w-full px-4 py-2 rounded-xl text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F18]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Highlighted Words (Comma-separated list of words that turn orange & bold)</label>
              <input
                type="text"
                value={formData.opsHighlights}
                onChange={e => setFormData({...formData, opsHighlights: e.target.value})}
                placeholder="e.g. five, disconnected, missed, behind, waste, chaos"
                className="w-full px-4 py-2 rounded-xl text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F18]"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Solution Grid Image (Cloudinary)</label>
            <div className="flex flex-col sm:flex-row gap-4 items-start bg-zinc-50/50 dark:bg-zinc-900/10 p-4 rounded-2xl border border-zinc-250/20">
              {formData.image ? (
                <div className="relative w-48 h-32 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 group">
                  <img src={formData.image} alt="Solution Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: '' })}
                      className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-700 transition-colors"
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-48 h-32 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center p-4 text-center text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-900/20">
                  <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[10px] font-medium leading-tight">No Image Uploaded</span>
                </div>
              )}
              
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  disabled={uploadingImage}
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#FF4F18] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#E03F0D] disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {uploadingImage ? 'Uploading...' : 'Upload Image'}
                </button>
                <p className="text-[10px] text-zinc-500 max-w-[200px] leading-normal">
                  JPG, PNG or WEBP. Upload custom card image for this solution.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                {formData.image && (
                  <div className="mt-1">
                    <label className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1">Direct URL</label>
                    <input 
                      type="text" 
                      value={formData.image} 
                      onChange={e => setFormData({...formData, image: e.target.value})} 
                      className="w-full px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-mono max-w-xs" 
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">CTA Text</label>
              <input
                type="text"
                value={formData.ctaText}
                onChange={e => setFormData({...formData, ctaText: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F18]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Trust Text</label>
              <input
                type="text"
                value={formData.trustText}
                onChange={e => setFormData({...formData, trustText: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F18]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Icon (SVG String)</label>
              <textarea
                value={formData.icon}
                onChange={e => setFormData({...formData, icon: e.target.value})}
                rows={2}
                className="w-full font-mono text-xs px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F18]"
              />
            </div>
          </div>
        </section>

        {/* SECTION: WHY CHOOSE */}
        <section className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-[#FF4F18]">Why Choose</h3>
            <button type="button" onClick={() => addArrayItem('whyChoose', { title: '', desc: '' })} className="text-sm font-bold bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700">+ Add Item</button>
          </div>
          {formData.whyChoose.map((item, idx) => (
            <div key={idx} className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 relative">
              <button type="button" onClick={() => removeArrayItem('whyChoose', idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm font-bold">Remove</button>
              <div className="space-y-4 pr-16">
                <input type="text" placeholder="Title" value={item.title} onChange={e => updateArrayItem('whyChoose', idx, 'title', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" />
                <textarea placeholder="Description" rows={2} value={item.desc} onChange={e => updateArrayItem('whyChoose', idx, 'desc', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" />
              </div>
            </div>
          ))}
        </section>

        {/* SECTION: UNIFIED LAYER */}
        <section className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <h3 className="text-lg font-extrabold text-[#FF4F18]">Unified Layer Section</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Layer Section Title</label>
              <input type="text" placeholder="e.g. One unified layer, *infinite control*" value={formData.layerTitle} onChange={e => setFormData({...formData, layerTitle: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Layer Section Description</label>
              <textarea rows={2} value={formData.layerDesc} onChange={e => setFormData({...formData, layerDesc: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900" />
            </div>
          </div>
        </section>

        {/* SECTION: OUTCOMES & METRICS */}
        <section className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-[#FF4F18]">Outcomes & Metrics</h3>
            <button type="button" onClick={() => addArrayItem('metricsItems', { value: '', label: '', desc: '' })} className="text-sm font-bold bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700">+ Add Metric</button>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Metrics Section Title</label>
            <input type="text" placeholder="e.g. Real operational *outcomes & metrics*" value={formData.metricsTitle} onChange={e => setFormData({...formData, metricsTitle: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900" />
          </div>
          {formData.metricsItems.map((item: any, idx: number) => (
            <div key={idx} className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 relative">
              <button type="button" onClick={() => removeArrayItem('metricsItems', idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm font-bold">Remove</button>
              <div className="space-y-3 pr-16">
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Value (e.g. 22%)" value={item.value} onChange={e => updateArrayItem('metricsItems', idx, 'value', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" />
                  <input type="text" placeholder="Label (e.g. Faster Table Turnover)" value={item.label} onChange={e => updateArrayItem('metricsItems', idx, 'label', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" />
                </div>
                <textarea placeholder="Description" rows={2} value={item.desc} onChange={e => updateArrayItem('metricsItems', idx, 'desc', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" />
              </div>
            </div>
          ))}
        </section>

        {/* SECTION: FEATURES */}
        <section className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-[#FF4F18]">Features (Interactive Modules)</h3>
            <button type="button" onClick={() => addArrayItem('features', { title: '', desc: '', icon: '', speed: '', accuracy: '' })} className="text-sm font-bold bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700">+ Add Feature</button>
          </div>
          <input type="text" placeholder="Features Section Title" value={formData.featuresTitle} onChange={e => setFormData({...formData, featuresTitle: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900" />
          
          {formData.features.map((item, idx) => (
            <div key={idx} className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 relative">
              <button type="button" onClick={() => removeArrayItem('features', idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm font-bold">Remove</button>
              <div className="space-y-4 pr-16">
                <input type="text" placeholder="Feature Title" value={item.title} onChange={e => updateArrayItem('features', idx, 'title', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" />
                <textarea placeholder="Feature Description" rows={2} value={item.desc} onChange={e => updateArrayItem('features', idx, 'desc', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Simulator Speed (e.g. 12ms)" value={item.speed || ''} onChange={e => updateArrayItem('features', idx, 'speed', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" />
                  <input type="text" placeholder="Simulator Accuracy (e.g. 99.8%)" value={item.accuracy || ''} onChange={e => updateArrayItem('features', idx, 'accuracy', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" />
                </div>
                <textarea placeholder="Icon SVG (optional)" rows={1} value={item.icon} onChange={e => updateArrayItem('features', idx, 'icon', e.target.value)} className="w-full font-mono text-xs px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" />
              </div>
            </div>
          ))}
        </section>

        {/* SECTION: BUSINESS TYPES */}
        <section className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-[#FF4F18]">Business Types</h3>
            <button type="button" onClick={() => addArrayItem('businessTypes', { name: '', desc: '', icon: '' })} className="text-sm font-bold bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700">+ Add Business Type</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Section Title (e.g. Built for every kind of *food business*)" value={formData.businessTypesTitle} onChange={e => setFormData({...formData, businessTypesTitle: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900" />
            <textarea placeholder="Section Description" rows={2} value={formData.businessTypesDesc} onChange={e => setFormData({...formData, businessTypesDesc: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900" />
          </div>
          {formData.businessTypes.map((item, idx) => (
            <div key={idx} className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 relative">
              <button type="button" onClick={() => removeArrayItem('businessTypes', idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm font-bold">Remove</button>
              <div className="space-y-4 pr-16">
                <input type="text" placeholder="Type Name (e.g. Restaurants)" value={item.name} onChange={e => updateArrayItem('businessTypes', idx, 'name', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" />
                <textarea placeholder="Description" rows={2} value={item.desc} onChange={e => updateArrayItem('businessTypes', idx, 'desc', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" />
                <textarea placeholder="Icon SVG (optional)" rows={1} value={item.icon} onChange={e => updateArrayItem('businessTypes', idx, 'icon', e.target.value)} className="w-full font-mono text-xs px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" />
              </div>
            </div>
          ))}
        </section>

        {/* SECTION: EXTRAS */}
        <section className="space-y-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <h3 className="text-lg font-extrabold text-[#FF4F18]">Extra Blocks</h3>
          
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <h4 className="font-bold text-sm">Extra Growth Block</h4>
            <input type="text" placeholder="Title" value={formData.extraGrowth.title} onChange={e => updateObjectField('extraGrowth', 'title', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" />
            <textarea placeholder="Description" rows={2} value={formData.extraGrowth.desc} onChange={e => updateObjectField('extraGrowth', 'desc', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" />
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <h4 className="font-bold text-sm">Extra Owners Choice Block</h4>
            <input type="text" placeholder="Title" value={formData.extraOwnersChoice.title} onChange={e => updateObjectField('extraOwnersChoice', 'title', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" />
            <textarea placeholder="Description" rows={2} value={formData.extraOwnersChoice.desc} onChange={e => updateObjectField('extraOwnersChoice', 'desc', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" />
          </div>
          
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm">Support Items (Bullet Points)</h4>
              <button type="button" onClick={() => addArrayItem('supportItems', '')} className="text-xs font-bold bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded hover:bg-zinc-200">- Add Support Point</button>
            </div>
            {formData.supportItems.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input type="text" placeholder={`Support point ${idx + 1}`} value={item} onChange={e => updateArrayItem('supportItems', idx, '', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" />
                <button type="button" onClick={() => removeArrayItem('supportItems', idx)} className="text-red-500 hover:text-red-700 text-xs font-bold">Remove</button>
              </div>
            ))}
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm">Security Items (Bullet Points)</h4>
              <button type="button" onClick={() => addArrayItem('securityItems', '')} className="text-xs font-bold bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded hover:bg-zinc-200">- Add Security Point</button>
            </div>
            {formData.securityItems.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input type="text" placeholder={`Security point ${idx + 1}`} value={item} onChange={e => updateArrayItem('securityItems', idx, '', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" />
                <button type="button" onClick={() => removeArrayItem('securityItems', idx)} className="text-red-500 hover:text-red-700 text-xs font-bold">Remove</button>
              </div>
            ))}
          </div>
          
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <h4 className="font-bold text-sm">Bottom CTA Block</h4>
            <input type="text" placeholder="Title" value={formData.ctaBlock.title} onChange={e => updateObjectField('ctaBlock', 'title', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" />
            <textarea placeholder="Description" rows={2} value={formData.ctaBlock.desc} onChange={e => updateObjectField('ctaBlock', 'desc', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" />
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm">Frequently Asked Questions (FAQs)</h4>
              <button type="button" onClick={() => addArrayItem('faqs', { question: '', answer: '' })} className="text-xs font-bold bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded hover:bg-zinc-200">+ Add FAQ</button>
            </div>
            {formData.faqs.map((item: any, idx: number) => (
              <div key={idx} className="bg-zinc-100/50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-200/50 dark:border-zinc-700/50 relative">
                <button type="button" onClick={() => removeArrayItem('faqs', idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-bold">Remove</button>
                <div className="space-y-2 pr-12">
                  <input type="text" placeholder="Question" value={item.question} onChange={e => updateArrayItem('faqs', idx, 'question', e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm bg-white dark:bg-zinc-900" />
                  <textarea placeholder="Answer" rows={2} value={item.answer} onChange={e => updateArrayItem('faqs', idx, 'answer', e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm bg-white dark:bg-zinc-900" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SUBMIT BUTTON */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-4 sticky bottom-6 bg-white/80 dark:bg-[#111111]/80 backdrop-blur-md p-4 rounded-2xl shadow-sm">
          <Link href="/admin/dashboard" className="px-6 py-3 font-bold rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 font-bold rounded-xl bg-[#FF4F18] text-white hover:bg-[#E03F0D] transition-colors disabled:opacity-50 shadow-[0_4px_14px_rgba(255,79,24,0.3)]"
          >
            {saving ? 'Saving...' : 'Save Solution'}
          </button>
        </div>
      </form>
    </div>
  );
}
