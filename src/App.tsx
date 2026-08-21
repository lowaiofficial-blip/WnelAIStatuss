import { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { StatusBanner } from './components/StatusBanner';
import { OverallStatusBanner } from './components/OverallStatusBanner';
import { ServicesList } from './components/ServicesList';
import { IncidentsSection } from './components/IncidentsSection';
import { ScheduledMaintenanceSection } from './components/ScheduledMaintenanceSection';
import { AdminModal } from './components/AdminModal';
import { SystemStatusResponse } from './types';
import { RefreshCw } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<SystemStatusResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Calculate average latency across all active services
  const averageLatency = useMemo(() => {
    if (!data?.services || data.services.length === 0) return 0;
    const latencies = data.services.map((s) => s.latencyMs || 0).filter((l) => l > 0);
    if (latencies.length === 0) return 0;
    const sum = latencies.reduce((acc, curr) => acc + curr, 0);
    return Math.round(sum / latencies.length);
  }, [data]);

  // Fetch real status snapshot
  const fetchStatus = useCallback(async (silent = false) => {
    if (!silent) setIsChecking(true);
    try {
      const res = await fetch('/api/status');
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const json: SystemStatusResponse = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch status:', err);
      setError('Status verisi alınamadı. Yeniden bağlanılıyor...');
    } finally {
      setLoading(false);
      setIsChecking(false);
    }
  }, []);

  // Immediate probe trigger (POST /api/check-now)
  const handleCheckNow = async () => {
    setIsChecking(true);
    try {
      const res = await fetch('/api/check-now', { method: 'POST' });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const json: SystemStatusResponse = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      console.error('Check now error:', err);
      await fetchStatus(true);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Auto-poll status periodically
    const interval = setInterval(() => {
      fetchStatus(true);
    }, 10000); // 10 seconds for near real-time updates
    return () => clearInterval(interval);
  }, [fetchStatus]);

  // Secret keyboard shortcut: Ctrl+Shift+A or Cmd+Shift+A to toggle admin modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-600 dark:text-zinc-400">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-emerald-600" />
          <span className="text-sm font-medium">WnelAI Servis Sağlık Durumu Alınıyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/60 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Clean Minimalist Header with Live ping & Theme switcher */}
      <Header
        lastUpdated={data?.lastUpdated || new Date().toISOString()}
        isChecking={isChecking}
        onCheckNow={handleCheckNow}
        onOpenAdmin={() => setIsAdminOpen(true)}
        averageLatency={averageLatency}
      />

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full space-y-6 sm:space-y-8 flex-1">
        
        {/* GitHub Engineering Status Illustration Banner */}
        <StatusBanner />

        {/* Error notification if connection issue */}
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => fetchStatus()}
              className="underline font-semibold hover:text-rose-900 dark:hover:text-rose-200 cursor-pointer"
            >
              Tekrar Dene
            </button>
          </div>
        )}

        {/* Overall Status Banner (Computed from Services) */}
        {data && (
          <OverallStatusBanner
            overallStatus={data.overallStatus}
            title={data.overallStatusTitle}
            subtitle={data.overallStatusSubtitle}
          />
        )}

        {/* Scheduled Maintenance (Only rendered if scheduled) */}
        {data && (
          <ScheduledMaintenanceSection maintenance={data.scheduledMaintenance} />
        )}

        {/* GitHub Status Style Services List (Uptime Bars, Pills, Live Latency, Tooltips) */}
        {data && (
          <ServicesList
            services={data.services}
            isChecking={isChecking}
          />
        )}

        {/* Incidents Section (Current Incidents & Incident History) */}
        {data && (
          <IncidentsSection
            activeIncidents={data.activeIncidents}
            pastIncidents={data.pastIncidents}
          />
        )}

      </main>

      {/* Admin Management Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        data={data}
        onDataUpdated={(newData) => setData(newData)}
      />

      {/* Clean Minimal Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 py-6 text-xs text-zinc-500 dark:text-zinc-400 mt-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              WnelAI Status
            </span>
            <span>•</span>
            <span>GitHub Status Formatı Uptime & Ping İzleme</span>
          </div>

          <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">
            Durum ve gecikme bilgileri anlık olarak izlenmektedir.
          </p>
        </div>
      </footer>

    </div>
  );
}
