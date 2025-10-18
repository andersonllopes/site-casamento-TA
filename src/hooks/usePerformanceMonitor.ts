import { useEffect } from 'react';

export const usePerformanceMonitor = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime);
        }
        if (entry.entryType === 'first-input') {
          console.log('FID:', (entry as any).processingStart - entry.startTime);
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
    } catch (e) {
      console.warn('PerformanceObserver not supported');
    }

    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      console.log('Connection type:', conn.effectiveType);
      console.log('Downlink speed:', conn.downlink);
    }

    return () => {
      observer.disconnect();
    };
  }, []);
};
