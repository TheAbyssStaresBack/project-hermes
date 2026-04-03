import { Map, MapControls } from '@/components/control-center/map/map';
import { Card } from '@/components/ui/card';

export default function Page() {
  return (
    <Card className="h-[320px] p-0 overflow-hidden">
      <Map center={[-74.006, 40.7128]} zoom={11}>
        <MapControls />
      </Map>
    </Card>
  );
}
