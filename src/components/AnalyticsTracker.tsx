import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    // Send page view analytics to the backend
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'pageview',
        path: location.pathname,
        timestamp: new Date().toISOString(),
      })
    }).catch(err => console.error('Analytics tracking failed:', err));
  }, [location]);

  return null;
}
