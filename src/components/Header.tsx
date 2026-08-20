import { RefreshCw, Activity, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  lastUpdated: string;
  isChecking: boolean;
  onCheckNow: () => void;
  onOpenAdmin: () => void;
}

export function Header({ lastUpdated, isChecking, onCheckNow, onOpenAdmin }: HeaderProps) {
  const formattedTime = new Date(lastUpdated).toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-bold text-sm shadow-sm">
            <Activity className="w-4 h-4 text-emerald-400" />
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

        {/* Actions & Admin controls */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:inline-block">
            Son kontrol: <span className="font-mono text-zinc-700 dark:text-zinc-300">{formattedTime}</span>
          </span>

          <button
            id="open-admin-btn"
            onClick={onOpenAdmin}
            title="Yönetici Girişi (Ctrl+Shift+A)"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors shadow-2xs cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span className="hidden sm:inline">Yönetici</span>
          </button>

          <button
            id="refresh-status-btn"
            onClick={onCheckNow}
            disabled={isChecking}
            title="Şimdi otomatik kontrol yap"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-emerald-600' : ''}`} />
            <span className="hidden sm:inline">{isChecking ? 'Kontrol ediliyor...' : 'Yenile'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
