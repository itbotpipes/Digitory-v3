'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

export default function AnalyticsSeoPage() {
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('');
  const [googleTagManagerId, setGoogleTagManagerId] = useState('');
  const [facebookPixelId, setFacebookPixelId] = useState('');
  const [customHeadScripts, setCustomHeadScripts] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await api.get('/settings', token);
      if (res.data) {
        setGoogleAnalyticsId(res.data.googleAnalyticsId || '');
        setGoogleTagManagerId(res.data.googleTagManagerId || '');
        setFacebookPixelId(res.data.facebookPixelId || '');
        setCustomHeadScripts(res.data.customHeadScripts || '');
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const token = localStorage.getItem('admin_token') || '';
      const payload = {
        googleAnalyticsId,
        googleTagManagerId,
        facebookPixelId,
        customHeadScripts,
      };

      const res = await api.put('/settings', payload, token);
      if (res.data) {
        setMessage('✅ Analytics & Pixels settings updated successfully!');
        setTimeout(() => setMessage(''), 4000);
      }
    } catch (err: any) {
      console.error('Error updating analytics settings:', err);
      setMessage(err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-sm font-semibold text-zinc-500">
        <div className="w-6 h-6 border-2 border-[#FF4F18] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        Loading Analytics settings...
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <form onSubmit={handleSaveSettings} className="space-y-8 max-w-4xl">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-1">
            Analytics & Marketing Pixels
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Integrate Google Analytics, Google Tag Manager, Meta (Facebook) Pixel, and custom head scripts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* GA4 */}
          <div className="p-5 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl space-y-2.5">
            <label className="block text-xs font-extrabold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
              Google Analytics ID
            </label>
            <input
              type="text"
              value={googleAnalyticsId}
              onChange={(e) => setGoogleAnalyticsId(e.target.value)}
              placeholder="G-XXXXXXXXXX"
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#FF4F18]"
            />
            <p className="text-[10px] text-zinc-400">Measurement ID (GA4)</p>
          </div>

          {/* GTM */}
          <div className="p-5 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl space-y-2.5">
            <label className="block text-xs font-extrabold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
              Google Tag Manager ID
            </label>
            <input
              type="text"
              value={googleTagManagerId}
              onChange={(e) => setGoogleTagManagerId(e.target.value)}
              placeholder="GTM-XXXXXXX"
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#FF4F18]"
            />
            <p className="text-[10px] text-zinc-400">Container ID (GTM)</p>
          </div>

          {/* Meta Pixel */}
          <div className="p-5 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl space-y-2.5">
            <label className="block text-xs font-extrabold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
              Meta / Facebook Pixel ID
            </label>
            <input
              type="text"
              value={facebookPixelId}
              onChange={(e) => setFacebookPixelId(e.target.value)}
              placeholder="123456789012345"
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#FF4F18]"
            />
            <p className="text-[10px] text-zinc-400">Pixel ID (Facebook Meta Ads)</p>
          </div>
        </div>

        {/* Custom Head Scripts */}
        <div className="space-y-2.5">
          <label className="block text-xs font-bold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
            Custom Head Tracking Scripts (JavaScript / Hotjar / Clarity)
          </label>
          <textarea
            rows={5}
            value={customHeadScripts}
            onChange={(e) => setCustomHeadScripts(e.target.value)}
            placeholder="Paste raw <script> or tracking code snippets here..."
            className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#FF4F18] resize-none"
          />
          <p className="text-[11px] text-zinc-400">
            Pasted script tags are automatically injected into the public site head layout.
          </p>
        </div>

        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-4">
          {message && (
            <p className={clsx("text-xs font-bold flex items-center gap-1.5", message.startsWith('✅') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')}>
              {message.startsWith('✅') ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              <span>{message}</span>
            </p>
          )}
          <Button
            type="submit"
            disabled={saving}
            className="bg-[#FF4F18] text-white hover:bg-[#E03F0D] font-extrabold px-7 py-3 rounded-xl text-xs ml-auto shrink-0 shadow-xs cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Analytics Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}
