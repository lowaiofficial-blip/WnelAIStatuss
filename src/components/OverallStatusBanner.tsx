import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface OverallStatusBannerProps {
  overallStatus: 'operational' | 'degraded' | 'outage';
  title: string;
  subtitle: string;
}

export function OverallStatusBanner({
  overallStatus,
  title,
  subtitle,
}: OverallStatusBannerProps) {
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
