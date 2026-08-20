import { useState, useEffect } from 'react';
import { RefreshCw, Activity, ShieldCheck, Zap } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  lastUpdated: string;
  isChecking: boolean;
  onCheckNow: () => void;
  onOpenAdmin: () => void;
  averageLatency?: number;
}

export function Header({ lastUpdated, isChecking, onCheckNow, onOpenAdmin, averageLatency }: HeaderProps) {
  const [relativeTime, setRelativeTime] = useState<string>('Az önce');

  // Compute live relative time updated every second
  useEffect(() => {
    const updateRelative = () => {
      if (!lastUpdated) {
        setRelativeTime('Az önce');
        return;
      }
      const diffSec = Math.floor((Date.now() - new Date(lastUpdated).getTime()) / 1000);
      if (diffSec < 5) {
        setRelativeTime('Az önce');
      } else if (diffSec < 60) {
        setRelativeTime(`${diffSec} sn önce`);
      } else if (diffSec < 3600) {
        const mins = Math.floor(diffSec / 60);
        setRelativeTime(`${mins} dk önce`);
      } else {
        setRelativeTime(
          new Date(lastUpdated).toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit',
          })
        );
      }
    };

    updateRelative();
    const interval = setInterval(updateRelative, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xs sticky top-0 z-30 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand & URL */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-bold text-sm shadow-sm transition-colors">
            <Activity className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-zinc-900 dark:text-white">
                WnelAI Status
              </h1>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                wnelai.onrender.com
              </span>
            </div>
          </div>
        </div>

        {/* Actions & Tools */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Average Latency Pill */}
          {typeof averageLatency === 'number' && averageLatency > 0 && (
            <span
              title="Tüm servislerin anlık ortalama yanıt süresi"
              className="hidden md:inline-flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-xs font-mono text-zinc-700 dark:text-zinc-300"
            >
              <Zap className="w-3 h-3 text-amber-500" />
              <span>{averageLatency}ms</span>
            </span>
          )}

          {/* Last Check Live Counter */}
          <span className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:inline-block">
            Kontrol: <span className="font-medium text-zinc-700 dark:text-zinc-300">{relativeTime}</span>
          </span>

          {/* Theme Switcher */}
          <ThemeToggle />

          {/* Secret Admin Button */}
          <button
            id="open-admin-btn"
            onClick={onOpenAdmin}
            title="Yönetici Girişi (Ctrl+Shift+A)"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors shadow-2xs cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span className="hidden sm:inline">Yönetici</span>
          </button>

          {/* Refresh / Probe Button */}
          <button
            id="refresh-status-btn"
            onClick={onCheckNow}
            disabled={isChecking}
            title="Şimdi tüm servisleri canlı pingle ve gecikmeyi ölç"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-xs disabled:opacity-50 cursor-pointer active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-emerald-400 dark:text-emerald-600' : ''}`} />
            <span>{isChecking ? 'Pingleniyor...' : 'Yenile'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
