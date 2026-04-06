'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

  const handleClick = () => onClick?.(incident.id);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.(incident.id);
    }
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      className={cn(
        'w-full cursor-pointer gap-3 py-4 text-left transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none hover:border-primary/40 hover:shadow-md',
        isSelected && 'border-primary bg-accent/30 ring-1 ring-primary/40'
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-pressed={isSelected}
    >
      <CardHeader className="px-4">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-sm leading-tight">
            {incidentType}
          </CardTitle>
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            <Badge variant={getSeverityVariant(incident.severity)}>
              {formatLabel(incident.severity)}
            </Badge>
            <Badge variant={getStatusVariant(incident.status)}>
              {formatLabel(incident.status)}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4">
        <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
          <CardDescription className="truncate text-xs">
            Reported by: {reportedBy}
          </CardDescription>
          <CardDescription className="text-xs">
            {formatIncidentTime(incident.incident_time)}
          </CardDescription>
          {incident.location_description && (
            <CardDescription className="truncate text-xs">
              Location: {incident.location_description}
            </CardDescription>
          )}
        </div>
      </CardContent>

      {incident.description && (
        <CardFooter className="px-4 pt-0">
          <p className="truncate text-xs text-foreground/80">
            {incident.description}
          </p>
        </CardFooter>
      )}
    </Card>
  );
}

export default IncidentEntry;
