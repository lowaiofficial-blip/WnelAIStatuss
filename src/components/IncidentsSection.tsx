import { CheckCircle2, AlertCircle } from 'lucide-react';
import { IncidentRecord } from '../types';

interface IncidentsSectionProps {
  activeIncidents: IncidentRecord[];
  pastIncidents: IncidentRecord[];
}

export function IncidentsSection({
  activeIncidents,
  pastIncidents,
}: IncidentsSectionProps) {
  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Incidents */}
      <section id="active-incidents-section" className="space-y-2.5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 px-1">
          Aktif Olaylar
        </h2>

        {activeIncidents.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2.5 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>✓ No incidents reported.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {activeIncidents.map((incident) => {
              const isDegraded = incident.summary.includes('Degraded') || incident.summary.includes('sarı') || incident.title.includes('temporarily unavailable');
              return (
                <div
                  key={incident.id}
                  id={`active-incident-${incident.id}`}
                  className={`rounded-xl border p-5 space-y-2 shadow-xs ${
                    isDegraded
                      ? 'border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20'
                      : 'border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle
                        className={`w-4 h-4 shrink-0 ${
                          isDegraded
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      />
                      <span
                        className={`font-semibold text-sm ${
                          isDegraded
                            ? 'text-amber-950 dark:text-amber-200'
                            : 'text-rose-900 dark:text-rose-200'
                        }`}
                      >
                        {incident.title}
                      </span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        isDegraded
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
                      }`}
                    >
                      İnceleniyor
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                    {incident.summary}
                  </p>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400 pt-1">
                    Başlangıç: {formatDate(incident.startedAt)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Incident History */}
      <section id="past-incidents-section" className="space-y-2.5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 px-1">
          Geçmiş Olaylar
        </h2>

        {pastIncidents.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2.5 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>✓ No incidents reported.</span>
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-800 shadow-xs overflow-hidden">
            {pastIncidents.map((incident) => (
              <div
                key={incident.id}
                id={`past-incident-${incident.id}`}
                className="p-5 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                    {incident.title}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                    Çözüldü ✓
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  {incident.summary}
                </p>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {formatDate(incident.startedAt)}
                  {incident.durationFormatted && ` (${incident.durationFormatted} sürdü)`}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
