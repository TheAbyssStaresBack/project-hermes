import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
} from '@/components/control-center/map/map';
import { Card } from '@/components/ui/card';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/types/supabase';

type IncidentMarker = {
  id: string;
  longitude: number;
  latitude: number;
  label?: string | null;
};

type IncidentMapRow = Pick<
  Tables<'incidents'>,
  'id' | 'location_description' | 'severity' | 'status'
> & {
  longitude: number | null;
  latitude: number | null;
};

export default async function Page() {
  let data: IncidentMapRow[] | null = null;
  let error: unknown = null;

  try {
    const admin = createAdminClient();
    const adminResult = await admin
      .from('incidents_with_coords')
      .select(
        'id, location_description, severity, status, longitude, latitude'
      );
    data = adminResult.data;
    error = adminResult.error;
  } catch (adminError) {
    const supabase = await createClient();
    const userResult = await supabase
      // View returns computed longitude/latitude so we don't need to parse geography client-side.
      .from('incidents_with_coords')
      .select(
        'id, location_description, severity, status, longitude, latitude'
      );
    data = userResult.data;
    error = userResult.error;
    console.warn('Admin client unavailable for map incidents.', adminError);
  }

  if (error) {
    console.error('Failed to load incidents for map:', error);
  }

  const markers: IncidentMarker[] = (data ?? []).flatMap((incident) => {
    const longitude =
      typeof incident.longitude === 'number' ? incident.longitude : null;
    const latitude =
      typeof incident.latitude === 'number' ? incident.latitude : null;

    if (longitude === null || latitude === null) return [];

    const label =
      incident.location_description ??
      `${incident.severity.toUpperCase()} · ${incident.status}`;

    return [{ id: incident.id, longitude, latitude, label }];
  });
  const mapCenter: [number, number] = markers.length
    ? [markers[0].longitude, markers[0].latitude]
    : [121.0533, 14.6512];

  return (
    <Card className="h-[320px] p-0 overflow-hidden">
      <Map center={mapCenter} zoom={markers.length ? 12 : 11}>
        {markers.map((marker) => (
          <MapMarker
            key={marker.id}
            longitude={marker.longitude}
            latitude={marker.latitude}
          >
            <MarkerContent />
            {marker.label ? (
              <MarkerTooltip>{marker.label}</MarkerTooltip>
            ) : null}
          </MapMarker>
        ))}
        <MapControls />
      </Map>
    </Card>
  );
}
