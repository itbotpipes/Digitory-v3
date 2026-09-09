'use client';

import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Upload, CheckCircle2, AlertCircle } from 'lucide-react';

interface OptionsProps {
  className?: string;
}

export default function Options({ className }: OptionsProps) {
  const [loggingOut, setLoggingOut] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Settings variables
  const [logoBlackUrl, setLogoBlackUrl] = useState('/digitory-black.png');
  const [logoWhiteUrl, setLogoWhiteUrl] = useState('/digitory-white.png');
  const [companyName, setCompanyName] = useState('Digitory');
  const [siteTitle, setSiteTitle] = useState('Digitory - Restaurant Operating System');
  const [faviconUrl, setFaviconUrl] = useState('/favicon.ico');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('admin_token') || '';
        const res = await api.get('/settings', token);
        const branding = res.data?.branding || res.data?.data?.branding;
        if (branding) {
          setLogoBlackUrl(branding.logo || '/digitory-black.png');
          setLogoWhiteUrl(branding.logoWhite || '/digitory-white.png');
          if (branding.companyName) {
            setCompanyName(branding.companyName);
          }
          if (branding.siteTitle) {
            setSiteTitle(branding.siteTitle);
          }
          if (branding.favicon) {
            setFaviconUrl(branding.favicon);
          }
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>, target: 'black' | 'white' | 'favicon') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const token = localStorage.getItem('admin_token') || '';
      const json = await api.upload('/media', file, token);
      const url = json.data?.url || json.url;
      if (url) {
        if (target === 'black') {
          setLogoBlackUrl(url);
          localStorage.setItem('branding_logo_black', url);
          window.dispatchEvent(new Event('branding_logo_update'));
        } else if (target === 'white') {
          setLogoWhiteUrl(url);
          localStorage.setItem('branding_logo_white', url);
          window.dispatchEvent(new Event('branding_logo_update'));
        } else if (target === 'favicon') {
          setFaviconUrl(url);
          localStorage.setItem('branding_favicon', url);
          window.dispatchEvent(new CustomEvent('branding_settings_update', { detail: { favicon: url, siteTitle } }));
        }
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setMessage('❌ Failed to upload image');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const token = localStorage.getItem('admin_token') || '';
      const payload = {
        branding: {
          logo: logoBlackUrl,
          logoWhite: logoWhiteUrl,
          companyName,
          siteTitle,
          favicon: faviconUrl
        }
      };
      await api.put('/settings', payload, token);
      setMessage('✅ Settings updated successfully!');
      
      localStorage.setItem('branding_logo_black', logoBlackUrl);
      localStorage.setItem('branding_logo_white', logoWhiteUrl);
      localStorage.setItem('branding_site_title', siteTitle);
      localStorage.setItem('branding_favicon', faviconUrl);

      window.dispatchEvent(new Event('branding_logo_update'));
      window.dispatchEvent(new CustomEvent('branding_settings_update', { detail: { favicon: faviconUrl, siteTitle } }));
    } catch (err: any) {
      console.error(err);
      setMessage('❌ ' + (err.message || 'Failed to update settings'));
    } finally {
      setSaving(false);
    }
  };

  const logOutHandler = async () => {
    setLoggingOut(true);
    localStorage.removeItem('admin_token');
    window.location.href = '/admin/login';
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-zinc-400">
        <div className="w-6 h-6 border-2 border-[#FF4F18] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        Loading settings...
      </div>
    );
  }

  return (
    <div className={clsx("space-y-8 max-w-4xl", className)}>
      <form onSubmit={handleSaveSettings} className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-6 space-y-8">
        {/* SECTION 1: BROWSER TAB & IDENTITY */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-zinc-900 dark:text-white mb-1">Browser Tab & Website Identity Settings</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Configure the browser tab icon (favicon) and the tab title displayed across your website.</p>
          </div>

          {/* Browser Tab Preview Card */}
          <div className="p-5 bg-[#FAF9F7] dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wide text-zinc-400">Browser Tab Live Preview</h3>
            <div className="inline-flex items-center gap-3 bg-[#2D2A26] text-zinc-200 px-4 py-2.5 rounded-t-xl text-xs font-semibold max-w-md shadow-md border-t-2 border-[#FF4F18]">
              <img 
                src={faviconUrl} 
                alt="Favicon preview" 
                className="w-4 h-4 object-contain rounded-xs"
                onError={(e) => { e.currentTarget.src = '/favicon.ico'; }}
              />
              <span className="truncate max-w-[280px] text-zinc-100">{siteTitle || 'Digitory - Restaurant Operating System'}</span>
              <span className="ml-auto text-zinc-400 text-xs hover:text-white cursor-default">×</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wide text-zinc-500">Favicon Icon Image</label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center p-2 shrink-0">
                    <img 
                      src={faviconUrl} 
                      alt="Favicon" 
                      className="w-7 h-7 object-contain"
                      onError={(e) => { e.currentTarget.src = '/favicon.ico'; }}
                    />
                  </div>
                  <label className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-[#FF4F18]/50 px-4 py-2.5 rounded-xl cursor-pointer hover:bg-white dark:hover:bg-zinc-900 transition-colors text-xs font-semibold">
                    <Upload size={14} className="text-zinc-400" />
                    <span>Upload Favicon Icon</span>
                    <input type="file" accept="image/*,.ico" onChange={(e) => handleUploadImage(e, 'favicon')} className="hidden" />
                  </label>
                </div>
                <input
                  type="text"
                  value={faviconUrl}
                  onChange={(e) => setFaviconUrl(e.target.value)}
                  placeholder="Or paste Favicon Image URL..."
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs focus:outline-none focus:ring-1 focus:ring-[#FF4F18]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wide text-zinc-500">Browser Tab Title Text</label>
                <input
                  type="text"
                  required
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  placeholder="e.g. Digitory - Restaurant Operating System"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF4F18]"
                />
                <p className="text-[11px] text-zinc-400">This text appears in browser tabs, bookmarks, and search engine titles.</p>
              </div>
            </div>
          </div>
        </div>



        {/* SECTION 3: NAVBAR LOGO & BRANDING */}
        <div className="pt-6 border-t border-zinc-150 dark:border-zinc-800 space-y-6">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-zinc-900 dark:text-white mb-1">Navbar Logo & Branding Settings</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Upload custom logo assets for the admin panel header layout.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-850 rounded-2xl space-y-4">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wide text-zinc-400 mb-1">Logo (Light Theme)</h3>
                <p className="text-[10px] text-zinc-550 leading-tight">Image displayed inside Sidebar navigation on light mode screens.</p>
              </div>
              
              <div className="h-16 w-full flex items-center justify-center bg-white rounded-xl border border-zinc-150 p-2">
                <img src={logoBlackUrl} alt="Light Mode Logo Preview" className="h-8 max-w-full object-contain" onError={(e) => { e.currentTarget.src = '/digitory-black.png'; }} />
              </div>

              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-[#FF4F18]/50 px-4 py-3 rounded-xl cursor-pointer hover:bg-white dark:hover:bg-zinc-900 transition-colors text-xs font-semibold">
                <Upload size={14} className="text-zinc-400" />
                <span>Upload Light Theme Logo</span>
                <input type="file" accept="image/*" onChange={(e) => handleUploadImage(e, 'black')} className="hidden" />
              </label>
            </div>

            <div className="p-5 bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-850 rounded-2xl space-y-4">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wide text-zinc-400 mb-1">Logo (Dark Theme)</h3>
                <p className="text-[10px] text-zinc-550 leading-tight">Image displayed inside Sidebar navigation on dark mode screens.</p>
              </div>

              <div className="h-16 w-full flex items-center justify-center bg-zinc-900 rounded-xl border border-zinc-800 p-2">
                <img src={logoWhiteUrl} alt="Dark Mode Logo Preview" className="h-8 max-w-full object-contain" onError={(e) => { e.currentTarget.src = '/digitory-white.png'; }} />
              </div>

              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-[#FF4F18]/50 px-4 py-3 rounded-xl cursor-pointer hover:bg-white dark:hover:bg-zinc-900 transition-colors text-xs font-semibold">
                <Upload size={14} className="text-zinc-400" />
                <span>Upload Dark Theme Logo</span>
                <input type="file" accept="image/*" onChange={(e) => handleUploadImage(e, 'white')} className="hidden" />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wide text-zinc-500">Company / Brand Name</label>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full max-w-md px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF4F18]"
              placeholder="Digitory"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-850 flex items-center justify-between gap-4">
          {message && (
            <p className={clsx("text-xs font-bold flex items-center gap-1.5", message.startsWith('✅') ? 'text-green-600 dark:text-green-400' : 'text-red-650 dark:text-red-400')}>
              {message.startsWith('✅') ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              <span>{message}</span>
            </p>
          )}
          <Button type="submit" disabled={saving} className="bg-[#FF4F18] text-white hover:bg-[#E03F0D] font-extrabold px-6 py-2.5 rounded-xl text-xs ml-auto shrink-0 shadow-xs cursor-pointer">
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>

      <div className="bg-red-50/30 dark:bg-red-950/10 border border-red-200/50 dark:border-red-900/20 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-extrabold text-red-600 dark:text-red-500 mb-0.5">Logout from Console</h3>
          <p className="text-xs text-zinc-500">Sign out of active admin sessions and return to the secure login gateway page.</p>
        </div>
        <Button
          disabled={loggingOut}
          variant="destructive"
          onClick={logOutHandler}
          className="font-extrabold px-6 py-2.5 rounded-xl text-xs cursor-pointer shadow-xs shrink-0"
        >
          {loggingOut ? 'Logging out...' : 'Logout Session'}
        </Button>
      </div>
    </div>
  );
}
