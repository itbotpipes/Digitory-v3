'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Search, Edit3 } from 'lucide-react';

export default function SeoPagesList() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'pages' | 'blogs' | 'solutions'>('all');

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const token = localStorage.getItem('admin_token') || '';
        const res = await api.get('/seo', token);
        const loaded = res.data?.list || res.data?.docs || res.data?.results || res.data?.pages || res.data || [];
        setPages(Array.isArray(loaded) ? loaded : []);
      } catch (error) {
        console.error('Failed to fetch pages for SEO', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, []);

  const counts = {
    all: pages.length,
    pages: pages.filter(p => p.pageType === 'Page').length,
    blogs: pages.filter(p => p.pageType === 'Post' || p.pageType === 'Blog').length,
    solutions: pages.filter(p => p.pageType === 'Solution').length,
  };

  const filteredPages = pages.filter(p => {
    const matchesSearch = 
      p.name?.toLowerCase().includes(search.toLowerCase()) || 
      p.url?.toLowerCase().includes(search.toLowerCase()) ||
      p.seo?.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.seo?.description?.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType === 'blogs') return p.pageType === 'Post' || p.pageType === 'Blog';
    if (filterType === 'pages') return p.pageType === 'Page';
    if (filterType === 'solutions') return p.pageType === 'Solution';
    return true;
  });

  return (
    <div className="p-6 md:p-10 animate-fade-in space-y-6">
      {/* Top Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">SEO Pages & Content</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage SEO titles, meta descriptions, and indexing for all pages and blogs.</p>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#FF4F18] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search pages or SEO meta..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-11 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-[#FF4F18] focus:ring-1 focus:ring-[#FF4F18] w-full sm:w-72 transition-all duration-200 text-sm font-medium dark:text-white"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            filterType === 'all'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
              : 'bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
          }`}
        >
          All Items ({counts.all})
        </button>

        <button
          onClick={() => setFilterType('pages')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            filterType === 'pages'
              ? 'bg-[#FF4F18] text-white shadow-sm'
              : 'bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
          }`}
        >
          Website Pages ({counts.pages})
        </button>

        <button
          onClick={() => setFilterType('blogs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            filterType === 'blogs'
              ? 'bg-[#FF4F18] text-white shadow-sm'
              : 'bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
          }`}
        >
          Blog Posts ({counts.blogs})
        </button>

        <button
          onClick={() => setFilterType('solutions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            filterType === 'solutions'
              ? 'bg-[#FF4F18] text-white shadow-sm'
              : 'bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
          }`}
        >
          Solutions ({counts.solutions})
        </button>
      </div>

      {/* Pages Table */}
      <div className="overflow-x-auto bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800/80 rounded-2xl shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800/80 uppercase text-[11px] tracking-wider font-extrabold">
            <tr>
              <th className="px-6 py-4">Page Name</th>
              <th className="px-6 py-4">URL</th>
              <th className="px-6 py-4">SEO Title & Meta Description</th>
              <th className="px-6 py-4">Index Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-16 text-center text-zinc-400 font-semibold animate-pulse">Loading pages...</td></tr>
            ) : filteredPages.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-16 text-center text-zinc-500">No matching pages or blogs found.</td></tr>
            ) : (
              filteredPages.map(page => (
                <tr key={page._id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors group">
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white max-w-[200px]">
                    <div className="truncate font-semibold">{page.name}</div>
                    <span className="mt-1 inline-block text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      {page.pageType === 'Post' ? 'Blog' : page.pageType}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400 font-mono text-xs max-w-[180px] truncate">
                    {page.url}
                  </td>

                  {/* SEO Title & Description */}
                  <td className="px-6 py-4 max-w-[320px]">
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100 truncate" title={page.seo?.title}>
                      {page.seo?.title || <span className="text-[#FF4F18] italic text-xs font-bold">Missing Title</span>}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5" title={page.seo?.description}>
                      {page.seo?.description || <span className="text-zinc-400 italic text-[11px]">No SEO description</span>}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {page.seo?.robotsIndex === 'noindex' ? (
                      <span className="text-red-600 bg-[#FFF3EF] dark:text-red-400 dark:bg-red-500/10 px-2.5 py-1 rounded-full font-bold text-xs">No Index</span>
                    ) : (
                      <span className="text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-500/10 px-2.5 py-1 rounded-full font-bold text-xs">Index</span>
                    )}
                  </td>

                  {/* Action - Always Visible Edit SEO Button */}
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <Link 
                      href={`/admin/seo/editor/${page.pageType}?id=${page._id}&url=${encodeURIComponent(page.url)}&name=${encodeURIComponent(page.name)}`}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap text-[#FF4F18] hover:text-white font-bold border border-[#FF4F18] hover:bg-[#FF4F18] px-4 py-2 rounded-xl transition-all duration-200 shadow-sm"
                    >
                      <Edit3 size={14} /> Edit SEO
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
