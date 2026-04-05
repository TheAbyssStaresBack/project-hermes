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
  const [activeDestination, setActiveDestination] =
    useState<DestinationMarker>(destination);
  const [locationStatus, setLocationStatus] = useState<
    'idle' | 'requesting' | 'granted' | 'fallback'
  >('idle');
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
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

  const mapCenter: [number, number] = selectedMarker
    ? [
        (selectedMarker.longitude + activeDestination.longitude) / 2,
        (selectedMarker.latitude + activeDestination.latitude) / 2,
      ]
    : hasMarkers
      ? [markers[0].longitude, markers[0].latitude]
      : [activeDestination.longitude, activeDestination.latitude];

  const selectedIncidentTime = selectedMarker?.incidentTime
    ? new Date(selectedMarker.incidentTime).toLocaleString('en-PH', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : null;

  useEffect(() => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setActiveDestination(destination);
      setLocationStatus('fallback');
      setLocationMessage('Location unavailable, using the MDRRMO destination.');
      return;
    }

    setLocationStatus('requesting');
    setLocationMessage('Requesting your location for route guidance.');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setActiveDestination({
          id: 'user-location',
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
          label: 'Your location',
        });
        setLocationStatus('granted');
        setLocationMessage('Using your location as the route destination.');
      },
      () => {
        setActiveDestination(destination);
        setLocationStatus('fallback');
        setLocationMessage(
          'Location permission denied, using the MDRRMO destination.'
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, [destination]);

  useEffect(() => {
    if (locationStatus === 'idle' || locationStatus === 'requesting') {
      setRouteCoordinates([]);
      setRouteStatus('idle');
      setRouteErrorMessage(null);
      return;
    }

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
          endLng: String(activeDestination.longitude),
          endLat: String(activeDestination.latitude),
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
  }, [
    activeDestination.latitude,
    activeDestination.longitude,
    locationStatus,
    selectedMarker,
  ]);

  return (
    <div className="space-y-4">
      <Card className="relative h-[380px] overflow-hidden p-0 lg:h-[560px]">
        <Map
          center={mapCenter}
          zoom={selectedMarker ? 12 : hasMarkers ? 14 : 13}
        >
          {routeCoordinates.length >= 2 ? (
            <MapRoute coordinates={routeCoordinates} width={5} opacity={0.9} />
          ) : null}

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
            longitude={activeDestination.longitude}
            latitude={activeDestination.latitude}
          >
            <MarkerContent className="rounded-full ring-4 ring-emerald-300/70">
              {locationStatus === 'granted' ? (
                <div className="relative h-4 w-4 rounded-full border-2 border-white bg-emerald-500 shadow-lg" />
              ) : (
                <div className="relative h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-lg" />
              )}
            </MarkerContent>
            <MarkerTooltip>{activeDestination.label}</MarkerTooltip>
          </MapMarker>

          <MapControls />
        </Map>
        {!hasMarkers ? (
          <div className="pointer-events-none absolute inset-x-6 top-6 z-10 rounded-md border bg-background/95 px-3 py-2 text-sm text-muted-foreground shadow-sm">
            No SQL-backed incident markers found.
          </div>
        ) : locationStatus === 'requesting' ? (
          <div className="pointer-events-none absolute inset-x-6 top-6 z-10 rounded-md border bg-background/95 px-3 py-2 text-sm text-muted-foreground shadow-sm">
            {locationMessage}
          </div>
        ) : !selectedMarker ? (
          <div className="pointer-events-none absolute inset-x-6 top-6 z-10 rounded-md border bg-background/95 px-3 py-2 text-sm text-muted-foreground shadow-sm">
            {locationMessage ??
              `Click an incident marker to preview the route to ${activeDestination.label}.`}
          </div>
        ) : routeStatus === 'loading' ? (
          <div className="pointer-events-none absolute inset-x-6 top-6 z-10 rounded-md border bg-background/95 px-3 py-2 text-sm text-muted-foreground shadow-sm">
            Loading road-based route to {activeDestination.label}.
          </div>
        ) : routeStatus === 'error' ? (
          <div className="pointer-events-none absolute inset-x-6 top-6 z-10 rounded-md border bg-background/95 px-3 py-2 text-sm text-muted-foreground shadow-sm">
            {routeErrorMessage ??
              'Could not load a road route for this marker.'}
          </div>
        ) : (
          <div className="pointer-events-none absolute inset-x-6 top-6 z-10 rounded-md border bg-background/95 px-3 py-2 text-sm text-muted-foreground shadow-sm">
            Routing from {selectedMarker.label ?? 'Selected incident'} to{' '}
            {activeDestination.label}.
          </div>
        )}
      </Card>

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
