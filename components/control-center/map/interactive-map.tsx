'use client';

import { useEffect, useState } from 'react';

import {
  Map,
  MapControls,
  MapMarker,
  MapRoute,
  MarkerContent,
  MarkerTooltip,
} from '@/components/control-center/map/map';
import { Card } from '@/components/ui/card';

export type IncidentMarker = {
  id: string;
  longitude: number;
  latitude: number;
  label?: string | null;
  severity?: string | null;
  status?: string | null;
  description?: string | null;
  incidentTime?: string | null;
};

type DestinationMarker = {
  id: string;
  longitude: number;
  latitude: number;
  label: string;
};

type InteractiveMapProps = {
  markers: IncidentMarker[];
  destination: DestinationMarker;
};

export function InteractiveMap({ markers, destination }: InteractiveMapProps) {
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(
    markers[0]?.id ?? null
  );
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>(
    []
  );
  const [routeStatus, setRouteStatus] = useState<
    'idle' | 'loading' | 'ready' | 'error'
  >('idle');
  const [routeErrorMessage, setRouteErrorMessage] = useState<string | null>(
    null
  );

  const selectedMarker =
    markers.find((marker) => marker.id === selectedMarkerId) ??
    markers[0] ??
    null;
  const hasMarkers = markers.length > 0;

  const markerMapCenter: [number, number] = hasMarkers
    ? [markers[0].longitude, markers[0].latitude]
    : [destination.longitude, destination.latitude];

  const routeMapCenter: [number, number] = selectedMarker
    ? [
        (selectedMarker.longitude + destination.longitude) / 2,
        (selectedMarker.latitude + destination.latitude) / 2,
      ]
    : [destination.longitude, destination.latitude];

  const selectedIncidentTime = selectedMarker?.incidentTime
    ? new Date(selectedMarker.incidentTime).toLocaleString('en-PH', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : null;

  useEffect(() => {
    if (!selectedMarker) {
      setRouteCoordinates([]);
      setRouteStatus('idle');
      setRouteErrorMessage(null);
      return;
    }

    const controller = new AbortController();

    async function loadRoute() {
      setRouteStatus('loading');
      setRouteErrorMessage(null);

      try {
        const params = new URLSearchParams({
          startLng: String(selectedMarker.longitude),
          startLat: String(selectedMarker.latitude),
          endLng: String(destination.longitude),
          endLat: String(destination.latitude),
        });

        const response = await fetch(
          `/api/directions_map?${params.toString()}`,
          {
            signal: controller.signal,
            cache: 'no-store',
          }
        );

        const payload = (await response.json()) as {
          coordinates?: [number, number][];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error ?? 'Failed to fetch route.');
        }

        const coordinates = Array.isArray(payload.coordinates)
          ? payload.coordinates
          : [];

        if (coordinates.length < 2) {
          throw new Error('Route geometry is empty.');
        }

        setRouteCoordinates(coordinates);
        setRouteStatus('ready');
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error('Failed to load road route:', error);
        setRouteCoordinates([]);
        setRouteStatus('error');
        setRouteErrorMessage(
          error instanceof Error ? error.message : 'Could not load route.'
        );
      }
    }

    void loadRoute();

    return () => {
      controller.abort();
    };
  }, [destination.latitude, destination.longitude, selectedMarker]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.4fr]">
        <Card className="relative h-[340px] overflow-hidden p-0 lg:h-[520px]">
          <Map center={markerMapCenter} zoom={hasMarkers ? 14 : 13}>
            {markers.map((marker) => {
              const isSelected = marker.id === selectedMarker?.id;

              return (
                <MapMarker
                  key={marker.id}
                  longitude={marker.longitude}
                  latitude={marker.latitude}
                  onClick={() => setSelectedMarkerId(marker.id)}
                >
                  <MarkerContent
                    className={
                      isSelected
                        ? 'rounded-full ring-4 ring-emerald-300/70'
                        : undefined
                    }
                  />
                  {marker.label ? (
                    <MarkerTooltip>
                      {isSelected
                        ? `${marker.label} · selected`
                        : `${marker.label} · click to route`}
                    </MarkerTooltip>
                  ) : null}
                </MapMarker>
              );
            })}
            <MapControls />
          </Map>
          {!hasMarkers ? (
            <div className="pointer-events-none absolute inset-x-6 top-6 z-10 rounded-md border bg-background/95 px-3 py-2 text-sm text-muted-foreground shadow-sm">
              No SQL-backed incident markers found.
            </div>
          ) : (
            <div className="pointer-events-none absolute inset-x-6 top-6 z-10 rounded-md border bg-background/95 px-3 py-2 text-sm text-muted-foreground shadow-sm">
              Click here to check the routing for the nearest MDDRRMO
            </div>
          )}
        </Card>

        <Card className="relative h-[340px] overflow-hidden p-0 lg:h-[520px]">
          <Map center={routeMapCenter} zoom={selectedMarker ? 12 : 14}>
            {routeCoordinates.length >= 2 ? (
              <MapRoute
                coordinates={routeCoordinates}
                width={5}
                opacity={0.9}
              />
            ) : null}

            {markers.map((marker) => {
              const isSelected = marker.id === selectedMarker?.id;

              return (
                <MapMarker
                  key={`route-${marker.id}`}
                  longitude={marker.longitude}
                  latitude={marker.latitude}
                  onClick={() => setSelectedMarkerId(marker.id)}
                >
                  <MarkerContent
                    className={
                      isSelected
                        ? 'rounded-full ring-4 ring-emerald-300/70'
                        : 'opacity-80'
                    }
                  />
                  {marker.label ? (
                    <MarkerTooltip>
                      {isSelected
                        ? `${marker.label} · selected`
                        : `${marker.label} · click to route`}
                    </MarkerTooltip>
                  ) : null}
                </MapMarker>
              );
            })}

            <MapMarker
              longitude={destination.longitude}
              latitude={destination.latitude}
            >
              <MarkerContent className="rounded-full ring-4 ring-sky-300/70" />
              <MarkerTooltip>{destination.label}</MarkerTooltip>
            </MapMarker>

            <MapControls />
          </Map>
          {!selectedMarker ? (
            <div className="pointer-events-none absolute inset-x-6 top-6 z-10 rounded-md border bg-background/95 px-3 py-2 text-sm text-muted-foreground shadow-sm">
              Route preview is waiting for one real incident marker from SQL.
            </div>
          ) : routeStatus === 'loading' ? (
            <div className="pointer-events-none absolute inset-x-6 top-6 z-10 rounded-md border bg-background/95 px-3 py-2 text-sm text-muted-foreground shadow-sm">
              Loading road-based route to {destination.label}.
            </div>
          ) : routeStatus === 'error' ? (
            <div className="pointer-events-none absolute inset-x-6 top-6 z-10 rounded-md border bg-background/95 px-3 py-2 text-sm text-muted-foreground shadow-sm">
              {routeErrorMessage ??
                'Could not load a road route for this marker.'}
            </div>
          ) : (
            <div className="pointer-events-none absolute inset-x-6 top-6 z-10 rounded-md border bg-background/95 px-3 py-2 text-sm text-muted-foreground shadow-sm">
              Routing from {selectedMarker.label ?? 'Selected incident'} to{' '}
              {destination.label}.
            </div>
          )}
        </Card>
      </div>

      {selectedMarker ? (
        <Card className="gap-3 px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold">
                {selectedMarker.label ?? 'Selected incident'}
              </h3>
              <p className="text-sm text-muted-foreground">INCIDENT RECORDS</p>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              {selectedIncidentTime ?? 'No incident time'}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-lg border px-4 py-3">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Severity
              </div>
              <div className="mt-1 font-medium capitalize">
                {selectedMarker.severity ?? 'Unknown'}
              </div>
            </div>

            <div className="rounded-lg border px-4 py-3">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Status
              </div>
              <div className="mt-1 font-medium capitalize">
                {selectedMarker.status?.replace('_', ' ') ?? 'Unknown'}
              </div>
            </div>

            <div className="rounded-lg border px-4 py-3 md:col-span-2">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Location
              </div>
              <div className="mt-1 font-medium">
                {selectedMarker.label ?? 'No location description'}
              </div>
            </div>

            <div className="rounded-lg border px-4 py-3 md:col-span-2 xl:col-span-4">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Description
              </div>
              <div className="mt-1 text-sm leading-6 text-foreground">
                {selectedMarker.description ??
                  'No incident description provided.'}
              </div>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
