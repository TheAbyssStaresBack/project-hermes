'use client';

import { useEffect, useState } from 'react';

import {
  Map,
  MapControls,
  MapHeatmapLayer,
  MapMarker,
  MapRoute,
  MarkerContent,
  MarkerPopup,
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

function formatIncidentTime(incidentTime?: string | null) {
  return incidentTime
    ? new Intl.DateTimeFormat('en-PH', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Manila',
      }).format(new Date(incidentTime))
    : 'No incident time';
}

function IncidentMarkerCard({ marker }: { marker: IncidentMarker }) {
  return (
    <div className="w-[280px] overflow-hidden rounded-2xl border border-border/70 bg-card text-card-foreground shadow-2xl">
      <div className="space-y-4 p-4">
        <div className="space-y-1">
          <p className="text-[11px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
            Incident
          </p>
          <h3 className="text-base font-semibold leading-tight">
            {marker.label ?? 'Selected incident'}
          </h3>
          <p className="text-xs text-muted-foreground">
            {formatIncidentTime(marker.incidentTime)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-border/60 bg-muted/35 px-3 py-2">
            <div className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
              Severity
            </div>
            <div className="mt-1 text-sm font-semibold capitalize">
              {marker.severity ?? 'Unknown'}
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/35 px-3 py-2">
            <div className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
              Status
            </div>
            <div className="mt-1 text-sm font-semibold capitalize">
              {marker.status?.replace('_', ' ') ?? 'Unknown'}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <div className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
              Description
            </div>
            <p className="mt-1 text-sm leading-6 text-foreground">
              {marker.description ?? 'No incident description provided.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const MARKER_VISIBILITY_ZOOM = 13;
const HEATMAP_FADE_END_ZOOM = 14;

function getSeverityWeight(severity?: string | null) {
  switch (severity) {
    case 'critical':
      return 1;
    case 'high':
      return 0.75;
    case 'moderate':
      return 0.5;
    case 'low':
      return 0.25;
    default:
      return 0.35;
  }
}

export function InteractiveMap({ markers, destination }: InteractiveMapProps) {
  const [activeRouteMarkerId, setActiveRouteMarkerId] = useState<string | null>(
    null
  );
  const [openMarkerId, setOpenMarkerId] = useState<string | null>(null);
  const [mapZoom, setMapZoom] = useState<number>(13);
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
    markers.find((marker) => marker.id === activeRouteMarkerId) ?? null;
  const hasMarkers = markers.length > 0;
  const showIncidentMarkers = mapZoom >= MARKER_VISIBILITY_ZOOM;
  const resolvedDestination =
    locationStatus === 'granted' || locationStatus === 'fallback'
      ? activeDestination
      : null;
  const heatmapData: GeoJSON.FeatureCollection<
    GeoJSON.Point,
    { id: string; weight: number; severity?: string | null }
  > = {
    type: 'FeatureCollection',
    features: markers.map((marker) => ({
      type: 'Feature',
      properties: {
        id: marker.id,
        weight: getSeverityWeight(marker.severity),
        severity: marker.severity ?? null,
      },
      geometry: {
        type: 'Point',
        coordinates: [marker.longitude, marker.latitude],
      },
    })),
  };

  const mapCenter: [number, number] =
    showIncidentMarkers && selectedMarker && resolvedDestination
      ? [
          (selectedMarker.longitude + resolvedDestination.longitude) / 2,
          (selectedMarker.latitude + resolvedDestination.latitude) / 2,
        ]
      : showIncidentMarkers && selectedMarker
        ? [selectedMarker.longitude, selectedMarker.latitude]
        : hasMarkers
          ? [markers[0].longitude, markers[0].latitude]
          : resolvedDestination
            ? [resolvedDestination.longitude, resolvedDestination.latitude]
            : [destination.longitude, destination.latitude];

  useEffect(() => {
    if (!activeRouteMarkerId && !openMarkerId) return;

    const markerExists = markers.some(
      (marker) =>
        marker.id === activeRouteMarkerId || marker.id === openMarkerId
    );
    if (!markerExists) {
      setActiveRouteMarkerId(null);
      setOpenMarkerId(null);
    }
  }, [activeRouteMarkerId, markers, openMarkerId]);

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
    if (
      !showIncidentMarkers ||
      locationStatus === 'idle' ||
      locationStatus === 'requesting' ||
      !resolvedDestination
    ) {
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
        const routeOrigin = selectedMarker;
        const routeDestination = resolvedDestination;

        if (!routeOrigin || !routeDestination) {
          setRouteCoordinates([]);
          setRouteStatus('idle');
          return;
        }

        const params = new URLSearchParams({
          startLng: String(routeOrigin.longitude),
          startLat: String(routeOrigin.latitude),
          endLng: String(routeDestination.longitude),
          endLat: String(routeDestination.latitude),
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
    locationStatus,
    resolvedDestination,
    selectedMarker,
    showIncidentMarkers,
  ]);

  return (
    <div className="flex h-full flex-1 flex-col">
      <Card className="relative min-h-[calc(100dvh-var(--header-height))] flex-1 overflow-hidden rounded-none border-0 p-0 shadow-none">
        <Map
          center={mapCenter}
          zoom={
            showIncidentMarkers && selectedMarker && resolvedDestination
              ? 12
              : hasMarkers
                ? 14
                : 13
          }
          onViewportChange={(viewport) => {
            setMapZoom(viewport.zoom);
          }}
        >
          {hasMarkers ? (
            <MapHeatmapLayer
              id="incident-severity-heatmap"
              data={heatmapData}
              fadeStartZoom={MARKER_VISIBILITY_ZOOM}
              maxVisibleZoom={HEATMAP_FADE_END_ZOOM}
            />
          ) : null}

          {routeCoordinates.length >= 2 ? (
            <MapRoute coordinates={routeCoordinates} width={5} opacity={0.9} />
          ) : null}

          {showIncidentMarkers
            ? markers.map((marker) => {
                const isSelected = marker.id === selectedMarker?.id;
                const isOpen = marker.id === openMarkerId;

                return (
                  <MapMarker
                    key={marker.id}
                    longitude={marker.longitude}
                    latitude={marker.latitude}
                    onClick={() => {
                      setActiveRouteMarkerId(marker.id);
                      setOpenMarkerId(marker.id);
                    }}
                  >
                    <MarkerContent
                      className={
                        isSelected
                          ? 'rounded-full ring-4 ring-emerald-300/70'
                          : 'opacity-80'
                      }
                    />
                    {!isOpen ? (
                      <MarkerTooltip
                        className="border-0 bg-transparent p-0 shadow-none"
                        closeOnMove={true}
                      >
                        <IncidentMarkerCard marker={marker} />
                      </MarkerTooltip>
                    ) : null}
                    <MarkerPopup
                      open={isOpen}
                      onOpenChange={(open) => {
                        if (!open && openMarkerId === marker.id) {
                          setOpenMarkerId(null);
                        }
                      }}
                      closeButton
                      closeOnMove={false}
                      className="border-0 bg-transparent p-0 shadow-none"
                    >
                      <IncidentMarkerCard marker={marker} />
                    </MarkerPopup>
                  </MapMarker>
                );
              })
            : null}

          {resolvedDestination ? (
            <MapMarker
              longitude={resolvedDestination.longitude}
              latitude={resolvedDestination.latitude}
            >
              <MarkerContent className="rounded-full ring-4 ring-emerald-300/70">
                {locationStatus === 'granted' ? (
                  <div className="relative h-4 w-4 rounded-full border-2 border-white bg-emerald-500 shadow-lg" />
                ) : (
                  <div className="relative h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-lg" />
                )}
              </MarkerContent>
              <MarkerTooltip>{resolvedDestination.label}</MarkerTooltip>
            </MapMarker>
          ) : null}

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
        ) : !showIncidentMarkers ? (
          <div className="pointer-events-none absolute inset-x-6 top-6 z-10 rounded-md border bg-background/95 px-3 py-2 text-sm text-muted-foreground shadow-sm">
            HeatMap
          </div>
        ) : !selectedMarker ? (
          <div className="pointer-events-none absolute inset-x-6 top-6 z-10 rounded-md border bg-background/95 px-3 py-2 text-sm text-muted-foreground shadow-sm">
            {locationMessage ??
              `Click an incident marker to preview the route to ${resolvedDestination?.label ?? 'the destination'}.`}
          </div>
        ) : routeStatus === 'loading' ? (
          <div className="pointer-events-none absolute inset-x-6 top-6 z-10 rounded-md border bg-background/95 px-3 py-2 text-sm text-muted-foreground shadow-sm">
            Loading road-based route to{' '}
            {resolvedDestination?.label ?? 'the destination'}.
          </div>
        ) : routeStatus === 'error' ? (
          <div className="pointer-events-none absolute inset-x-6 top-6 z-10 rounded-md border bg-background/95 px-3 py-2 text-sm text-muted-foreground shadow-sm">
            {routeErrorMessage ??
              'Could not load a road route for this marker.'}
          </div>
        ) : (
          <div className="pointer-events-none absolute inset-x-6 top-6 z-10 rounded-md border bg-background/95 px-3 py-2 text-sm text-muted-foreground shadow-sm">
            Routing from {selectedMarker.label ?? 'Selected incident'} to{' '}
            {resolvedDestination?.label ?? 'the destination'}.
          </div>
        )}
      </Card>
    </div>
  );
}
