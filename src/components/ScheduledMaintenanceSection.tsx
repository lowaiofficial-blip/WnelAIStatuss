import { Wrench } from 'lucide-react';
import { ScheduledMaintenanceRecord } from '../types';

interface ScheduledMaintenanceSectionProps {
  maintenance: ScheduledMaintenanceRecord | null;
}

export function ScheduledMaintenanceSection({
  maintenance,
}: ScheduledMaintenanceSectionProps) {
  // If no maintenance is scheduled, hide section completely
  if (!maintenance) {
    return null;
  }

  return (
    <section id="scheduled-maintenance-section" className="space-y-2.5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 px-1">
        Planlı Bakım
      </h2>

      <div className="rounded-xl border border-sky-200 dark:border-sky-900/50 bg-sky-50/40 dark:bg-sky-950/20 p-5 space-y-2 shadow-xs">
        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
          <span className="font-semibold text-sm text-sky-900 dark:text-sky-200">
            {maintenance.title}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
          {maintenance.description}
        </p>
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-500 dark:text-zinc-400 pt-1">
          <span>Tarih: <strong className="text-zinc-700 dark:text-zinc-300">{maintenance.scheduledFor}</strong></span>
          <span>•</span>
          <span>Tahmini Süre: <strong className="text-zinc-700 dark:text-zinc-300">{maintenance.duration}</strong></span>
        </div>
      </div>
    </section>
  );
}
