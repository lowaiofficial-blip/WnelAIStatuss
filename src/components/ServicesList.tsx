import { useState } from 'react';
import { HelpCircle, Check, Minus, AlertCircle } from 'lucide-react';
import { ServiceHealth, DayUptime } from '../types';

interface ServicesListProps {
  services: ServiceHealth[];
}

export function ServicesList({ services }: ServicesListProps) {
  const [hoveredDay, setHoveredDay] = useState<{
    serviceId: string;
    day: DayUptime;
    pos: { x: number; y: number };
  } | null>(null);

  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);

  // Status icon (Circle with ✓, −, or !) matching GitHub Status
  const renderStatusBadge = (status: string) => {
    if (status === 'major_outage') {
      return (
        <div
          title="Incident / Kesinti"
          className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0"
        >
          <span className="text-[11px] font-black leading-none">!</span>
        </div>
      );
    }
    if (status === 'degraded') {
      return (
        <div
          title="Degraded / Performans Düşüklüğü"
          className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0"
        >
          <Minus className="w-3 h-3 stroke-[3]" />
        </div>
      );
    }
    return (
      <div
        title="Normal / Operasyonel"
        className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0"
      >
        <Check className="w-3 h-3 stroke-[3]" />
      </div>
    );
  };

  // Get bar color
  const getBarColor = (dayStatus: string) => {
    if (dayStatus === 'major_outage') {
      return 'bg-rose-500 dark:bg-rose-600 hover:bg-rose-600 dark:hover:bg-rose-500';
    }
    if (dayStatus === 'degraded') {
      return 'bg-amber-400 dark:bg-amber-500 hover:bg-amber-500 dark:hover:bg-amber-400';
    }
    return 'bg-emerald-400/90 dark:bg-emerald-500/90 hover:bg-emerald-500 dark:hover:bg-emerald-400';
  };

  // Status text under the graph
  const getStatusTextLabel = (status: string, statusText?: string) => {
    if (status === 'major_outage') return 'Incident';
    if (status === 'degraded') return 'Degraded';
    return statusText || 'Normal';
  };

  return (
    <section id="github-style-services-section" className="space-y-4">
      
      {/* Header bar */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Servis Durumları (30 Günlük Uptime)
        </h2>
      </div>

      {/* GitHub Status Component Cards Stack */}
      <div className="space-y-3.5">
        {services.map((service) => {
          const history = service.uptimeHistory || [];
          const statusLabel = getStatusTextLabel(service.status, service.statusText);

          return (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs transition-colors relative"
            >
              {/* Card Top Row: Name + Help ? + Status Icon */}
              <div className="flex items-start justify-between gap-3 mb-3.5">
                <div className="flex items-center gap-2 relative">
                  <span className="text-base sm:text-lg font-medium text-zinc-900 dark:text-zinc-100">
                    {service.name}
                  </span>
                  {service.subtitle && (
                    <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
                      ({service.subtitle})
                    </span>
                  )}

                  {/* Info Tooltip Icon */}
                  <div className="relative inline-block">
                    <button
                      type="button"
                      onMouseEnter={() => setActiveTooltipId(service.id)}
                      onMouseLeave={() => setActiveTooltipId(null)}
                      onClick={() => setActiveTooltipId(activeTooltipId === service.id ? null : service.id)}
                      className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 p-0.5 rounded-full transition-colors cursor-pointer"
                      title="Servis Bilgisi"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>

                    {/* Popover tooltip */}
                    {activeTooltipId === service.id && (
                      <div className="absolute left-0 bottom-full mb-2 w-64 p-2.5 rounded-lg bg-zinc-900 text-white text-xs shadow-xl z-20 pointer-events-none">
                        <div className="font-semibold mb-0.5">{service.name}</div>
                        <div className="text-zinc-300 text-[11px] leading-relaxed">
                          {service.description || service.targetEndpoint || 'WnelAI çekirdek altyapı servisi.'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Status Badge (Circle with Check / Minus / Exclamation) */}
                <div className="flex items-center gap-2">
                  {typeof service.latencyMs === 'number' && service.latencyMs > 0 && (
                    <span className="text-xs font-mono text-zinc-600 dark:text-zinc-300 hidden sm:inline-block">
                      {service.latencyMs}ms
                    </span>
                  )}
                  {renderStatusBadge(service.status)}
                </div>
              </div>

              {/* Middle Row: 30 Uptime Vertical Pill Bars */}
              <div className="w-full">
                <div className="flex items-center gap-[3px] sm:gap-[4px] w-full py-1">
                  {history.map((day, idx) => (
                    <div
                      key={day.date || idx}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoveredDay({
                          serviceId: service.id,
                          day,
                          pos: { x: rect.left + rect.width / 2, y: rect.top },
                        });
                      }}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`flex-1 h-7 sm:h-8 rounded-full transition-all cursor-pointer ${getBarColor(
                        day.status
                      )}`}
                    />
                  ))}
                </div>
              </div>

              {/* Bottom Row: 30 days ago ─── 99.xx % uptime ─── Today */}
              <div className="mt-2.5 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-normal select-none">
                <span className="shrink-0 text-[11px]">30 days ago</span>
                
                <div className="flex items-center gap-2 px-2 flex-1 justify-center max-w-[240px]">
                  <div className="h-[1px] bg-zinc-200 dark:bg-zinc-800 flex-1"></div>
                  <span className="font-mono text-zinc-600 dark:text-zinc-300 text-[11px] whitespace-nowrap">
                    {(service.uptimePercent30d || 100).toFixed(2)} % uptime
                  </span>
                  <div className="h-[1px] bg-zinc-200 dark:bg-zinc-800 flex-1"></div>
                </div>

                <span className="shrink-0 text-[11px]">Today</span>
              </div>

              {/* Status text under card (Normal, Degraded, Incident) */}
              <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                <span
                  className={`text-xs font-medium ${
                    service.status === 'major_outage'
                      ? 'text-rose-600 dark:text-rose-400'
                      : service.status === 'degraded'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {statusLabel}
                </span>
              </div>

            </div>
          );
        })}
      </div>

      {/* Floating Hover Tooltip for Uptime Bars */}
      {hoveredDay && (
        <div
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 bg-zinc-900 text-white text-xs rounded-lg px-3 py-1.5 shadow-xl border border-zinc-700/50 flex flex-col items-center gap-0.5"
          style={{
            left: `${hoveredDay.pos.x}px`,
            top: `${hoveredDay.pos.y - 8}px`,
          }}
        >
          <div className="font-bold text-[11px] text-zinc-200">
            {hoveredDay.day.dayLabel}
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                hoveredDay.day.status === 'major_outage'
                  ? 'bg-rose-500'
                  : hoveredDay.day.status === 'degraded'
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
              }`}
            />
            <span className="text-zinc-300">
              {hoveredDay.day.status === 'major_outage'
                ? 'Incident (Kesinti)'
                : hoveredDay.day.status === 'degraded'
                ? 'Degraded (Performans Düşüklüğü)'
                : 'Operasyonel (%100)'}
            </span>
          </div>
          {hoveredDay.day.note && (
            <div className="text-[10px] text-zinc-400 max-w-[180px] text-center">
              {hoveredDay.day.note}
            </div>
          )}
        </div>
      )}

    </section>
  );
}
