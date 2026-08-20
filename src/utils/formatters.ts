import { ServiceStatus } from '../types';

// Format ISO string to user's local time (HH:mm:ss)
export function formatLocalTime(isoString?: string): string {
  if (!isoString) return '--:--:--';
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } catch {
    return '--:--:--';
  }
}

// Format ISO string to full date & time (e.g. 20 Ağustos 2026, 11:20)
export function formatLocalDateTime(isoString?: string): string {
  if (!isoString) return 'Bilinmiyor';
  try {
    const d = new Date(isoString);
    return d.toLocaleString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch {
    return 'Bilinmiyor';
  }
}

export function getStatusTheme(status: ServiceStatus | 'operational' | 'degraded' | 'outage' | 'unavailable' | 'major_outage') {
  switch (status) {
    case 'operational':
      return {
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
        border: 'border-emerald-500/30',
        text: 'text-emerald-600 dark:text-emerald-400',
        dot: 'bg-emerald-500',
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
        label: 'Operational',
        symbol: '✓',
        iconColor: 'text-emerald-500',
      };
    case 'degraded':
      return {
        bg: 'bg-amber-500/10 dark:bg-amber-500/15',
        border: 'border-amber-500/30',
        text: 'text-amber-600 dark:text-amber-400',
        dot: 'bg-amber-500',
        badgeBg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
        label: 'Degraded Performance',
        symbol: '−',
        iconColor: 'text-amber-500',
      };
    case 'unavailable':
      return {
        bg: 'bg-rose-500/10 dark:bg-rose-500/15',
        border: 'border-rose-500/30',
        text: 'text-rose-600 dark:text-rose-400',
        dot: 'bg-rose-500',
        badgeBg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
        label: 'Unavailable',
        symbol: '!',
        iconColor: 'text-rose-500',
      };
    case 'major_outage':
    case 'outage':
    default:
      return {
        bg: 'bg-rose-500/10 dark:bg-rose-500/15',
        border: 'border-rose-500/30',
        text: 'text-rose-600 dark:text-rose-400',
        dot: 'bg-rose-500',
        badgeBg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
        label: 'Major Outage',
        symbol: '!',
        iconColor: 'text-rose-500',
      };
  }
}
