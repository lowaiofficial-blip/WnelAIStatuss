export type ServiceStatus = 'operational' | 'degraded' | 'major_outage';

export interface DayUptime {
  date: string; // YYYY-MM-DD
  dayLabel: string; // e.g. "18 Ağu"
  status: 'operational' | 'degraded' | 'major_outage';
  uptimePercent: number;
  incidentCount?: number;
  note?: string;
}

export interface ServiceHealth {
  id: string;
  name: string;
  subtitle?: string;
  description?: string;
  status: ServiceStatus;
  statusText: string;
  lastChecked: string; // ISO string
  latencyMs?: number;
  targetEndpoint?: string;
  uptimePercent30d: number;
  uptimeHistory: DayUptime[];
  manualOverride?: boolean;
}

export interface IncidentRecord {
  id: string;
  serviceId: string;
  serviceName: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  startedAt: string; // ISO string
  resolvedAt?: string; // ISO string
  durationFormatted?: string;
  summary: string;
}

export interface ScheduledMaintenanceRecord {
  id: string;
  title: string;
  scheduledFor: string;
  duration: string;
  affectedServices: string[];
  description: string;
}

export interface SystemStatusResponse {
  overallStatus: 'operational' | 'degraded' | 'outage';
  overallStatusTitle: string;
  overallStatusSubtitle: string;
  lastUpdated: string;
  autoProbeEnabled: boolean;
  services: ServiceHealth[];
  activeIncidents: IncidentRecord[];
  pastIncidents: IncidentRecord[];
  scheduledMaintenance: ScheduledMaintenanceRecord | null;
}

