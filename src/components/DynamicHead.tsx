'use client';

import { useEffect } from 'react';
import { api } from '@/lib/api';

export default function DynamicHead() {
  const updateHead = (siteTitle?: string, faviconUrl?: string) => {
    if (siteTitle) {
      document.title = siteTitle;
    }
    if (faviconUrl) {
      let faviconLink = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
      if (!faviconLink) {
        faviconLink = document.createElement('link');
        faviconLink.rel = 'shortcut icon';
        document.head.appendChild(faviconLink);
      }
      faviconLink.href = faviconUrl;
    }
  };

  useEffect(() => {
    // 1. Apply locally cached values immediately to avoid tab title flickering
    const cachedTitle = localStorage.getItem('branding_site_title');
    const cachedFavicon = localStorage.getItem('branding_favicon');
    if (cachedTitle || cachedFavicon) {
      updateHead(cachedTitle || undefined, cachedFavicon || undefined);
    }

    // 2. Fetch fresh settings from backend API
    const fetchHeadSettings = async () => {
      try {
        const res = await api.get('/settings');
        const branding = res.data?.branding || res.data?.data?.branding;
        if (branding) {
          const title = branding.siteTitle;
          const favicon = branding.favicon;

          if (title) {
            localStorage.setItem('branding_site_title', title);
          }
          if (favicon) {
            localStorage.setItem('branding_favicon', favicon);
          }

          updateHead(title, favicon);
        }
      } catch (err) {
        // Silently handle error fallback
      }
    };

    fetchHeadSettings();

    // 3. Listen for live settings updates dispatched from Admin Settings panel
    const handleLiveUpdate = (e: Event) => {
      const customEvt = e as CustomEvent;
      if (customEvt.detail) {
        updateHead(customEvt.detail.siteTitle, customEvt.detail.favicon);
      } else {
        const title = localStorage.getItem('branding_site_title') || undefined;
        const favicon = localStorage.getItem('branding_favicon') || undefined;
        updateHead(title, favicon);
      }
    };

    window.addEventListener('branding_settings_update', handleLiveUpdate);
    return () => {
      window.removeEventListener('branding_settings_update', handleLiveUpdate);
    };
  }, []);

  return null;
}
