import { useEffect, useState } from 'react';
import { isSupabaseConfigured } from '../lib/supabase.js';

export function useConnectionStatus() {
  const [isOnline, setIsOnline] = useState(
    () => typeof navigator === 'undefined' || navigator.onLine
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    isSupabaseConfigured,
    modeLabel: isSupabaseConfigured ? 'Supabase' : 'Demonstração local',
  };
}
