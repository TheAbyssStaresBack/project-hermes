'use client';

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

interface ParsedCoordinates {
  lat: number;
  long: number;
}

export function Location({ incidentID }: MapComponentProps) {
  // Note: need easy way for user to change values
  const defaultLocation: number[] = [10.6499974, 122.2333324];
  const [incidentLocation, setIncidentLocation] = React.useState<
    string[] | undefined
  >(undefined);
  const mapRef = React.useRef<MapRef | null>(null);
  const [parsedCoord, setParsedCoord] = React.useState<ParsedCoordinates>({
    lat: defaultLocation[0],
    long: defaultLocation[1],
  });

  React.useEffect(() => {
    const markIncidentLoc = async () => {
      const incidents = await fetchIncidentById(incidentID);
      if (incidents)
        setIncidentLocation(hexToCoordinates(incidents.location)?.split(' '));
      if (incidentLocation) {
        setParsedCoord({
          lat: parseFloat(incidentLocation[0]),
          long: parseFloat(incidentLocation[1]),
        });
      }
    };
    markIncidentLoc();
  }, [incidentID]);

  React.useEffect(() => {
    const zoomInMarker = () => {
      if (!mapRef || !mapRef.current) return null;

      if (!incidentLocation || incidentLocation.length !== 2)
        mapRef.current.flyTo({
          center: [defaultLocation[1], defaultLocation[0]],
          zoom: 10,
          duration: 1500,
        });
      else {
        mapRef.current.flyTo({
          center: [parsedCoord.long, parsedCoord.lat],
          zoom: 15,
          duration: 1500,
        });
      }
    };
    zoomInMarker();
  }, [incidentLocation]);

  function zoomToMarker() {
    if (
      !mapRef ||
      !mapRef.current ||
      !incidentLocation ||
      incidentLocation.length !== 2
    )
      return null;

    mapRef.current.flyTo({
      center: [parsedCoord.long, parsedCoord.lat],
      zoom: 15,
      duration: 1500,
    });
  }

  if (incidentLocation) {
    return (
      <Map ref={mapRef}>
        <MapMarker
          latitude={parsedCoord.lat}
          longitude={parsedCoord.long}
          onClick={zoomToMarker}
        >
          <MarkerContent />
        </MapMarker>
      </Map>
    );
  } else {
    return (
      <Map
        ref={mapRef}
        center={[parsedCoord.long, parsedCoord.lat]}
        zoom={10}
      />
    );
  }
}

export default Location;
