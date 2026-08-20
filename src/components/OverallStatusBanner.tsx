import { CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';

interface OverallStatusBannerProps {
  overallStatus: 'operational' | 'degraded' | 'outage' | 'critical';
  title: string;
  subtitle: string;
}

export function OverallStatusBanner({
  overallStatus,
  title,
  subtitle,
}: OverallStatusBannerProps) {
  if (overallStatus === 'critical') {
    return (
      <div
        id="overall-status-banner"
        className="rounded-xl p-5 sm:p-6 bg-gradient-to-r from-purple-700 via-purple-800 to-indigo-900 text-white shadow-md flex items-start sm:items-center justify-between gap-4 transition-all ring-2 ring-purple-400/40 relative overflow-hidden"
      >
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-10 h-10 rounded-full bg-purple-600 border-2 border-purple-300 flex items-center justify-center shrink-0 shadow-sm animate-pulse">
            <X className="w-6 h-6 text-white stroke-[3]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">{title}</h2>
              <span className="px-2 py-0.5 rounded-md bg-purple-950/80 border border-purple-400/40 text-purple-200 text-xs font-bold uppercase tracking-wide animate-pulse">
                P0 ACİL
              </span>
            </div>
            <p className="text-sm text-purple-100 mt-0.5 font-medium">{subtitle}</p>
          </div>
        </div>
      </div>
    );
  }

  if (overallStatus === 'outage') {
    return (
      <div
        id="overall-status-banner"
        className="rounded-xl p-5 sm:p-6 bg-rose-600 text-white shadow-sm flex items-start sm:items-center justify-between gap-4 transition-all"
      >
        <div className="flex items-center gap-3.5">
          <div className="p-2 rounded-lg bg-rose-700/60 shrink-0">
            <XCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">{title}</h2>
            <p className="text-sm text-rose-100 mt-0.5">{subtitle}</p>
          </div>
        </div>
      </div>
    );
  }

  if (overallStatus === 'degraded') {
    return (
      <div
        id="overall-status-banner"
        className="rounded-xl p-5 sm:p-6 bg-amber-500 text-zinc-950 shadow-sm flex items-start sm:items-center justify-between gap-4 transition-all"
      >
        <div className="flex items-center gap-3.5">
          <div className="p-2 rounded-lg bg-amber-600/30 shrink-0">
            <AlertTriangle className="w-6 h-6 text-zinc-950" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">{title}</h2>
            <p className="text-sm text-amber-950/80 mt-0.5">{subtitle}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="overall-status-banner"
      className="rounded-xl p-5 sm:p-6 bg-emerald-600 text-white shadow-sm flex items-start sm:items-center justify-between gap-4 transition-all"
    >
      <div className="flex items-center gap-3.5">
        <div className="p-2 rounded-lg bg-emerald-700/60 shrink-0">
          <CheckCircle2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">{title}</h2>
          <p className="text-sm text-emerald-100 mt-0.5">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
