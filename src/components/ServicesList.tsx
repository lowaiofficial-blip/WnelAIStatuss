import { useState } from 'react';
import { HelpCircle, Check, Minus, AlertCircle, X, Zap } from 'lucide-react';
import { ServiceHealth, DayUptime, ServiceStatus } from '../types';

interface ServicesListProps {
  services: ServiceHealth[];
  isChecking?: boolean;
}

export function ServicesList({ services, isChecking }: ServicesListProps) {
  const [hoveredDay, setHoveredDay] = useState<{
    serviceId: string;
    day: DayUptime;
    pos: { x: number; y: number };
  } | null>(null);

  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);

  // Return GitHub status pill color
  const getBarColor = (status: DayUptime['status']) => {
    switch (status) {
      case 'critical':
        return 'bg-purple-600 hover:bg-purple-500 shadow-xs shadow-purple-500/40';
      case 'major_outage':
        return 'bg-rose-600 hover:bg-rose-500';
      case 'degraded':
        return 'bg-amber-400 hover:bg-amber-300';
      case 'operational':
      default:
        return 'bg-emerald-500 hover:bg-emerald-400';
    }
  };

  // GitHub style round status icon (Purple X, Rose Alert, Amber Minus, Emerald Check)
  const renderStatusBadge = (status: ServiceStatus) => {
    if (status === 'critical') {
      return (
        <div
          title="Kritik Acil Durum / Critical Outage"
          className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-purple-400/50 animate-pulse"
        >
          <X className="w-3.5 h-3.5 stroke-[3]" />
        </div>
      );
    }
    if (status === 'major_outage') {
      return (
        <div
          title="Major Outage / Incident"
          className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs shadow-xs"
        >
          <AlertCircle className="w-3 h-3 stroke-[2.5]" />
        </div>
      );
    }
    if (status === 'degraded') {
      return (
        <div
          title="Degraded Performance"
          className="w-5 h-5 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center font-bold text-xs shadow-xs"
        >
          <Minus className="w-3 h-3 stroke-[3]" />
        </div>
      );
    }
    return (
      <div
        title="Operational"
        className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-xs"
      >
        <Check className="w-3 h-3 stroke-[2.5]" />
      </div>
    );
  };

  const getStatusTextLabel = (status: ServiceStatus, customText?: string) => {
    if (customText) return customText;
    switch (status) {
      case 'critical':
        return 'Kritik Acil Durum';
      case 'major_outage':
        return 'Incident';
      case 'degraded':
        return 'Degraded';
      case 'operational':
      default:
        return 'Normal';
    }
  };

  return (
    <section id="services-health-section" className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Servis Durumları (30 Günlük Uptime)
        </h2>
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Normal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Degraded</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            <span>Incident</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
            <span className="text-purple-600 dark:text-purple-400 font-semibold">Kritik (🟣✕)</span>
          </div>
        </div>
      </div>

      {/* GitHub Status Component Cards Stack */}
      <div className="space-y-3.5">
        {services.map((service) => {
          const history = service.uptimeHistory || [];
          const statusLabel = getStatusTextLabel(service.status, service.statusText);
          const latency = service.latencyMs || 45;
          const isCritical = service.status === 'critical';

          return (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              className={`rounded-xl border p-5 shadow-xs transition-all relative ${
                isCritical
                  ? 'border-purple-300 dark:border-purple-800/80 bg-purple-50/20 dark:bg-purple-950/20 ring-1 ring-purple-500/20'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
              }`}
            >
              {/* Card Top Row: Name + Help ? + Live Ping + Status Icon */}
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

                {/* Right Status Badge & Live Latency */}
                <div className="flex items-center gap-2.5">
                  <div
                    title={`Anlık Gecikme: ${latency} ms`}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    <Zap className={`w-3 h-3 ${isCritical ? 'text-purple-500' : latency < 100 ? 'text-emerald-500' : latency < 250 ? 'text-amber-500' : 'text-rose-500'} ${isChecking ? 'animate-pulse' : ''}`} />
                    <span>{latency}ms</span>
                  </div>
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

              {/* Status text under card (Normal, Degraded, Incident, Kritik) */}
              <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between">
                <span
                  className={`text-xs font-semibold flex items-center gap-1 ${
                    service.status === 'critical'
                      ? 'text-purple-600 dark:text-purple-400 font-bold'
                      : service.status === 'major_outage'
                      ? 'text-rose-600 dark:text-rose-400'
                      : service.status === 'degraded'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {service.status === 'critical' && <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-ping" />}
                  {statusLabel}
                </span>

                <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
                  {service.lastChecked
                    ? `Son test: ${new Date(service.lastChecked).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
                    : ''}
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
                hoveredDay.day.status === 'critical'
                  ? 'bg-purple-500 animate-pulse'
                  : hoveredDay.day.status === 'major_outage'
                  ? 'bg-rose-500'
                  : hoveredDay.day.status === 'degraded'
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
              }`}
            />
            <span className="text-zinc-300">
              {hoveredDay.day.status === 'critical'
                ? 'Kritik Acil Durum / Çökme'
                : hoveredDay.day.status === 'major_outage'
                ? 'Incident (Kesinti)'
                : hoveredDay.day.status === 'degraded'
                ? 'Degraded (Performans Düşüklüğü)'
                : 'Operasyonel (%100)'}
            </span>
          </div>
          {hoveredDay.day.note && (
            <div className="text-[10px] text-zinc-400 max-w-[200px] text-center">
              {hoveredDay.day.note}
            </div>
          )}
        </div>
      )}

    </section>
  );
}
