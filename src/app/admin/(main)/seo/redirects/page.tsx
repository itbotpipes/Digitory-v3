'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Plus, ArrowRight, Trash2, Edit2, Search, CheckCircle2, XCircle, RefreshCw, Link as LinkIcon } from 'lucide-react';

type RedirectRule = {
  _id: string;
  oldUrl: string;
  newUrl: string;
  status: 301 | 302;
  isEnabled: boolean;
  createdAt?: string;
};

export default function RedirectsManagerPage() {
  const [redirects, setRedirects] = useState<RedirectRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form states
  const [oldUrl, setOldUrl] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [status, setStatus] = useState<301 | 302>(301);
  const [isEnabled, setIsEnabled] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRedirects();
  }, []);

  const fetchRedirects = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await api.get('/redirects', token);
      if (res.data) {
        setRedirects(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch redirects:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setOldUrl('');
    setNewUrl('');
    setStatus(301);
    setIsEnabled(true);
    setIsModalOpen(true);
  };

  const openEditModal = (rule: RedirectRule) => {
    setEditingId(rule._id);
    setOldUrl(rule.oldUrl);
    setNewUrl(rule.newUrl);
    setStatus(rule.status);
    setIsEnabled(rule.isEnabled);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldUrl.trim() || !newUrl.trim()) {
      alert('Please fill in both Source and Target URLs.');
      return;
    }

    // Ensure leading slash if relative URL
    const cleanOld = oldUrl.trim().startsWith('/') || oldUrl.trim().startsWith('http') ? oldUrl.trim() : `/${oldUrl.trim()}`;
    const cleanNew = newUrl.trim().startsWith('/') || newUrl.trim().startsWith('http') ? newUrl.trim() : `/${newUrl.trim()}`;

    setSaving(true);
    try {
      const token = localStorage.getItem('admin_token') || '';
      const payload = { oldUrl: cleanOld, newUrl: cleanNew, status, isEnabled };

      if (editingId) {
        await api.put(`/redirects/${editingId}`, payload, token);
      } else {
        await api.post('/redirects', payload, token);
      }

      setIsModalOpen(false);
      fetchRedirects();
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Failed to save redirect rule');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (rule: RedirectRule) => {
    try {
      const token = localStorage.getItem('admin_token') || '';
      const updated = { ...rule, isEnabled: !rule.isEnabled };
      await api.put(`/redirects/${rule._id}`, updated, token);
      setRedirects(prev => prev.map(r => r._id === rule._id ? { ...r, isEnabled: !r.isEnabled } : r));
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this redirect rule?')) return;

    try {
      const token = localStorage.getItem('admin_token') || '';
      await api.delete(`/redirects/${id}`, token);
      setRedirects(prev => prev.filter(r => r._id !== id));
    } catch (error) {
      console.error('Failed to delete redirect:', error);
      alert('Failed to delete redirect');
    }
  };

  const filteredRedirects = redirects.filter(r => 
    r.oldUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.newUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 space-y-8 animate-fade-in">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text"
            placeholder="Search redirects by URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-[#1A1A1D] border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm outline-none focus:border-[#FF4F18] focus:ring-1 focus:ring-[#FF4F18] transition-all"
          />
        </div>

        <button 
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 bg-[#FF4F18] text-white font-bold px-6 py-3 rounded-2xl hover:bg-[#E03F0D] transition-all duration-200 shadow-[0_4px_14px_rgba(255,79,24,0.35)] hover:shadow-[0_6px_20px_rgba(255,79,24,0.4)] transform hover:-translate-y-0.5"
        >
          <Plus size={18} /> Add Redirect Rule
        </button>
      </div>

      {/* Redirects Table */}
      <div className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800/80 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-zinc-500 dark:text-zinc-400 flex items-center justify-center gap-3">
            <RefreshCw className="animate-spin text-[#FF4F18]" size={20} /> Loading redirect rules...
          </div>
        ) : filteredRedirects.length === 0 ? (
          <div className="p-16 text-center text-zinc-500 dark:text-zinc-400">
            <LinkIcon className="mx-auto mb-4 text-zinc-300 dark:text-zinc-700" size={48} />
            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-1">No Redirect Rules Found</h3>
            <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-6">Create 301 (Permanent) or 302 (Temporary) URL redirects to route legacy URLs or broken links.</p>
            <button 
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-all"
            >
              <Plus size={16} /> Create First Rule
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-xs uppercase font-extrabold tracking-wider text-zinc-500 dark:text-zinc-400 bg-zinc-50/50 dark:bg-[#1A1A1D]/50">
                  <th className="py-4 px-6">Status Code</th>
                  <th className="py-4 px-6">Source URL (Old)</th>
                  <th className="py-4 px-6">Target URL (New)</th>
                  <th className="py-4 px-6">Active</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60 text-sm">
                {filteredRedirects.map((rule) => (
                  <tr key={rule._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                    <td className="py-4 px-6 font-bold whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-black inline-flex items-center gap-1.5 ${
                        rule.status === 301 
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40' 
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40'
                      }`}>
                        {rule.status} {rule.status === 301 ? 'Permanent' : 'Temporary'}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-zinc-900 dark:text-zinc-100 font-semibold max-w-xs truncate">
                      {rule.oldUrl}
                    </td>
                    <td className="py-4 px-6 font-mono text-zinc-600 dark:text-zinc-400 max-w-xs truncate">
                      <div className="flex items-center gap-2">
                        <ArrowRight size={14} className="text-[#FF4F18] shrink-0" />
                        <span>{rule.newUrl}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <button 
                        onClick={() => handleToggleStatus(rule)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                          rule.isEnabled 
                            ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 hover:bg-green-200' 
                            : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200'
                        }`}
                      >
                        {rule.isEnabled ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                        {rule.isEnabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(rule)}
                          className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                          title="Edit Rule"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(rule._id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                          title="Delete Rule"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
                {editingId ? 'Edit Redirect Rule' : 'Create New Redirect Rule'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white p-1"
              >
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2">
                  Source Path (Old URL)
                </label>
                <input 
                  type="text"
                  placeholder="/old-contact-us"
                  value={oldUrl}
                  onChange={(e) => setOldUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-[#1A1A1D] border border-zinc-200 dark:border-zinc-800 rounded-xl font-mono text-sm outline-none focus:border-[#FF4F18] focus:ring-1 focus:ring-[#FF4F18]"
                  required
                />
                <p className="text-xs text-zinc-400 mt-1">Path that visitors or crawlers try to access.</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2">
                  Target Path (New URL)
                </label>
                <input 
                  type="text"
                  placeholder="/contact"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-[#1A1A1D] border border-zinc-200 dark:border-zinc-800 rounded-xl font-mono text-sm outline-none focus:border-[#FF4F18] focus:ring-1 focus:ring-[#FF4F18]"
                  required
                />
                <p className="text-xs text-zinc-400 mt-1">Destination path or URL to redirect to.</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2">
                  Redirect Type / HTTP Status Code
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStatus(301)}
                    className={`p-3.5 rounded-xl border text-sm font-bold flex flex-col items-center justify-center transition-all ${
                      status === 301 
                        ? 'bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400' 
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                    }`}
                  >
                    <span>301 Moved Permanently</span>
                    <span className="text-xs font-normal opacity-75 mt-0.5">Best for SEO link equity</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatus(302)}
                    className={`p-3.5 rounded-xl border text-sm font-bold flex flex-col items-center justify-center transition-all ${
                      status === 302 
                        ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400' 
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                    }`}
                  >
                    <span>302 Found (Temporary)</span>
                    <span className="text-xs font-normal opacity-75 mt-0.5">Temporary maintenance</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox"
                  id="isEnabledToggle"
                  checked={isEnabled}
                  onChange={(e) => setIsEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#FF4F18] rounded cursor-pointer"
                />
                <label htmlFor="isEnabledToggle" className="text-sm font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer">
                  Enable redirect rule immediately
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-5 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-5 py-3 rounded-xl bg-[#FF4F18] text-white font-bold hover:bg-[#E03F0D] transition-all text-sm shadow-md disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Rule' : 'Create Rule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
