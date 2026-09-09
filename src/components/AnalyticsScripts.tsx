'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { api } from '@/lib/api';

interface AnalyticsSettings {
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  facebookPixelId?: string;
  customHeadScripts?: string;
  customBodyScripts?: string;
}

export default function AnalyticsScripts() {
  const [analytics, setAnalytics] = useState<AnalyticsSettings | null>(null);

  useEffect(() => {
    // 1. Check local cache first
    const cached = localStorage.getItem('site_analytics_settings');
    if (cached) {
      try {
        setAnalytics(JSON.parse(cached));
      } catch (_) {}
    }

    // 2. Fetch fresh settings from backend
    const fetchAnalyticsSettings = async () => {
      try {
        const res = await api.get('/settings');
        const data = res.data?.analytics || res.data?.data?.analytics;
        if (data) {
          setAnalytics(data);
          localStorage.setItem('site_analytics_settings', JSON.stringify(data));
        }
      } catch (err) {
        // Fallback silently
      }
    };

    fetchAnalyticsSettings();

    // 3. Listen for live updates from Admin settings
    const handleUpdate = (e: Event) => {
      const customEvt = e as CustomEvent;
      if (customEvt.detail?.analytics) {
        setAnalytics(customEvt.detail.analytics);
      }
    };

    window.addEventListener('analytics_settings_update', handleUpdate);
    return () => window.removeEventListener('analytics_settings_update', handleUpdate);
  }, []);

  if (!analytics) return null;

  const { googleAnalyticsId, googleTagManagerId, facebookPixelId, customHeadScripts, customBodyScripts } = analytics;

  return (
    <>
      {/* 1. Google Analytics (GA4) */}
      {googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}', { page_path: window.location.pathname });
            `}
          </Script>
        </>
      )}

      {/* 2. Google Tag Manager (GTM) */}
      {googleTagManagerId && (
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${googleTagManagerId}');
          `}
        </Script>
      )}

      {/* 3. Facebook / Meta Pixel */}
      {facebookPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${facebookPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {/* 4. Custom Head Scripts (e.g. Hotjar, TikTok Pixel, Clarity) */}
      {customHeadScripts && (
        <Script id="custom-head-scripts" strategy="afterInteractive">
          {customHeadScripts.replace(/<script[^>]*>|<\/script>/gi, '')}
        </Script>
      )}
    </>
  );
}
