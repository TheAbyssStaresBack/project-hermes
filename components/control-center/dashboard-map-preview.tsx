'use client';

import Link from 'next/link';

import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
} from '@/components/control-center/map/map';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { DashboardPayload } from '@/lib/control-center-dashboard';
import type { Enums } from '@/types/supabase';

function severityClass(severity: Enums<'incident_severity'> | null) {
  if (severity === 'critical') return 'bg-red-600';
  if (severity === 'high') return 'bg-orange-500';
  if (severity === 'moderate') return 'bg-yellow-400';
  return 'bg-emerald-500';
}

type DashboardMapPreviewProps = {
  mapMarkers: DashboardPayload['mapMarkers'];
};

export function DashboardMapPreview({ mapMarkers }: DashboardMapPreviewProps) {
  const markerCount = mapMarkers.markers.length;
  const center: [number, number] =
    markerCount > 0
      ? [mapMarkers.markers[0].longitude, mapMarkers.markers[0].latitude]
      : [mapMarkers.destination.longitude, mapMarkers.destination.latitude];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Incident Map</CardTitle>
        <CardDescription>
          Spatial triage view using the same incident severity marker visuals.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="h-80 overflow-hidden rounded-md border">
          <Map center={center} zoom={13}>
            {mapMarkers.markers.map((marker) => (
              <MapMarker
                key={marker.id}
                longitude={marker.longitude}
                latitude={marker.latitude}
              >
                <MarkerContent>
                  <div className="rounded-full border-2 border-white/95 shadow-md">
                    <div
                      className={`size-3 rounded-full ${severityClass(marker.severity)}`}
                    />
                  </div>
                </MarkerContent>
              </MapMarker>
            ))}
            <MapControls />
          </Map>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">
            {markerCount.toLocaleString()} active markers
          </Badge>
          <Badge variant="outline">{mapMarkers.destination.label}</Badge>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2">
        <p className="text-muted-foreground text-sm">
          Use the full map page for routing and heatmap details.
        </p>
        <Button asChild size="sm" variant="outline">
          <Link href="/control-center/map">Open full map</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
