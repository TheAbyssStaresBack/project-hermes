'use client';

// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
import {
  Map,
  MapMarker,
  MarkerContent,
  type MapRef,
} from '@/components/control-center/map/map';
import { fetchIncidentById } from '@/lib/supabase/reports';
import { hexToCoordinates } from '@/lib/utils';
import * as React from 'react';

interface MapComponentProps {
  incidentID: string | null;
}

// TODO: set up current location to point to report location
// const Location: React.FC<MapComponentProps> = ({
//   center = [51.505, -0.09],
//   zoom = 13,
//   markers = [],
//   onMapReady,
// }, incidentID) => {
//   return <Map />;
// };

export function Location({ incidentID }: MapComponentProps) {
  // Note: need easy way for user to change values
  const defaultLocation: number[] = [122.2333324, 10.6499974];
  const [incidentLocation, setIncidentLocation] = React.useState<
    string[] | undefined
  >(undefined);
  const mapRef = React.useRef<MapRef | null>(null);

  React.useEffect(() => {
    const markIncidentLoc = async () => {
      const incidents = await fetchIncidentById(incidentID);
      if (incidents)
        setIncidentLocation(hexToCoordinates(incidents.location)?.split(' '));
    };
    markIncidentLoc();
  }, [incidentID]);

  React.useEffect(() => {
    const zoomInMarker = () => {
      if (!mapRef || !mapRef.current) return null;

      if (!incidentLocation || incidentLocation.length !== 2)
        mapRef.current.flyTo({
          center: [defaultLocation[0], defaultLocation[1]],
          zoom: 10,
          duration: 1500,
        });
      else
        mapRef.current.flyTo({
          center: [
            parseFloat(incidentLocation[1]),
            parseFloat(incidentLocation[0]),
          ],
          zoom: 15,
          duration: 1500,
        });
    };
    zoomInMarker();
  }, [incidentLocation]);

  if (incidentLocation) {
    return (
      <Map ref={mapRef}>
        <MapMarker
          latitude={parseFloat(incidentLocation[0])}
          longitude={parseFloat(incidentLocation[1])}
        >
          <MarkerContent />
        </MapMarker>
      </Map>
    );
  } else {
    return (
      <Map
        ref={mapRef}
        center={[defaultLocation[0], defaultLocation[1]]}
        zoom={10}
      />
    );
  }
}

export default Location;
