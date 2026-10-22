'use client';

import { useEffect, useRef } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

interface TelemetryPayload {
  sessionId: string;
  slideKey: string;
  dwellSeconds: number;
  deviceType: 'DESKTOP' | 'TABLET' | 'MOBILE';
  userAgent?: string;
}

export function useDeckTelemetry(token: string, activeSlideKey: string) {
  const enterTimeRef = useRef<number>(Date.now());
  const currentSlideRef = useRef<string>(activeSlideKey);
  const sessionIdRef = useRef<string>('');

  // Initialize or retrieve persistent sessionId for this browser session
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let sid = sessionStorage.getItem('soodfolio_telemetry_sid');
    if (!sid) {
      sid = `ses_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem('soodfolio_telemetry_sid', sid);
    }
    sessionIdRef.current = sid;
  }, []);

  // Helper to send telemetry beacon
  const sendBeaconEvent = (slideKey: string, dwellSeconds: number) => {
    if (!token || dwellSeconds < 1 || typeof window === 'undefined') return;

    const width = window.innerWidth;
    const deviceType: 'DESKTOP' | 'TABLET' | 'MOBILE' =
      width < 640 ? 'MOBILE' : width < 1024 ? 'TABLET' : 'DESKTOP';

    const payload: TelemetryPayload = {
      sessionId: sessionIdRef.current || 'anonymous_session',
      slideKey,
      dwellSeconds,
      deviceType,
      userAgent: navigator.userAgent,
    };

    const endpoint = `${API_BASE}/public/links/${encodeURIComponent(token)}/telemetry`;
    const dataString = JSON.stringify(payload);

    try {
      // Primary: navigator.sendBeacon (asynchronous non-blocking beacon)
      if (typeof navigator.sendBeacon === 'function') {
        const blob = new Blob([dataString], { type: 'application/json' });
        const success = navigator.sendBeacon(endpoint, blob);
        if (success) return;
      }

      // Fallback: fetch with keepalive flag
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: dataString,
        keepalive: true,
      }).catch(() => {
        // Suppress telemetry network error silently
      });
    } catch (err) {
      console.debug('Telemetry beacon dispatch skipped:', err);
    }
  };

  // Handle active slide transitions
  useEffect(() => {
    const prevSlide = currentSlideRef.current;
    const now = Date.now();
    const elapsedSeconds = Math.round((now - enterTimeRef.current) / 1000);

    // Send dwell time for the previous slide if it was viewed for at least 1s
    if (prevSlide && elapsedSeconds >= 1) {
      sendBeaconEvent(prevSlide, elapsedSeconds);
    }

    // Reset timer for the new active slide
    currentSlideRef.current = activeSlideKey;
    enterTimeRef.current = now;
  }, [activeSlideKey]);

  // Handle tab visibility change & page unload
  useEffect(() => {
    const handleFlushCurrentSlide = () => {
      const now = Date.now();
      const elapsedSeconds = Math.round((now - enterTimeRef.current) / 1000);
      if (currentSlideRef.current && elapsedSeconds >= 1) {
        sendBeaconEvent(currentSlideRef.current, elapsedSeconds);
      }
      enterTimeRef.current = now;
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleFlushCurrentSlide();
      } else {
        enterTimeRef.current = Date.now();
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleFlushCurrentSlide);
    window.addEventListener('pagehide', handleFlushCurrentSlide);

    return () => {
      handleFlushCurrentSlide();
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleFlushCurrentSlide);
      window.removeEventListener('pagehide', handleFlushCurrentSlide);
    };
  }, [token]);
}
