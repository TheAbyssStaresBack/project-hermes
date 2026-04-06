'use client';

import { Badge } from '@/components/ui/badge';
import { type Incident } from '@/lib/supabase/reports';
import { cn } from '@/lib/utils';

interface IncidentButtonProps {
  incident: Incident;
  isSelected?: boolean;
  onClick?: (id: string) => void;
}

function formatLabel(value: string): string {
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatIncidentTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown time';

  return new Intl.DateTimeFormat('en-PH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function getSeverityVariant(
  severity: string
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (severity) {
    case 'critical':
    case 'high':
      return 'destructive';
    case 'moderate':
      return 'secondary';
    case 'low':
      return 'outline';
    default:
      return 'default';
  }
}

function getStatusVariant(
  status: string
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'resolved':
      return 'secondary';
    case 'dismissed':
      return 'outline';
    case 'new':
      return 'default';
    default:
      return 'default';
  }
}

export function IncidentEntry({
  incident,
  isSelected = false,
  onClick,
}: IncidentButtonProps) {
  const incidentType = incident.incident_type_id || 'Unknown Type';
  const reportedBy = incident.reported_by || 'Unknown Reporter';

  return (
    <button
      type="button"
      className={cn(
        'w-full rounded-xl border bg-card p-4 text-left shadow-sm transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none hover:border-primary/40 hover:shadow-md',
        isSelected && 'border-primary bg-accent/30 ring-1 ring-primary/40'
      )}
      onClick={() => onClick?.(incident.id)}
      aria-pressed={isSelected}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-medium text-sm leading-tight">{incidentType}</p>
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          <Badge variant={getSeverityVariant(incident.severity)}>
            {formatLabel(incident.severity)}
          </Badge>
          <Badge variant={getStatusVariant(incident.status)}>
            {formatLabel(incident.status)}
          </Badge>
        </div>
      </div>

      <div className="mt-2 space-y-1.5 text-xs text-muted-foreground">
        <p className="truncate">Reported by: {reportedBy}</p>
        <p>{formatIncidentTime(incident.incident_time)}</p>
        {incident.location_description && (
          <p className="truncate">Location: {incident.location_description}</p>
        )}
      </div>

      {incident.description && (
        <p className="mt-3 truncate text-xs text-foreground/80">
          {incident.description}
        </p>
      )}
    </button>
  );
}

export default IncidentEntry;
