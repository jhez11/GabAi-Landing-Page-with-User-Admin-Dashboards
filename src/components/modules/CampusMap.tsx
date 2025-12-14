import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Map as MapIcon, Navigation } from 'lucide-react';
import { Card } from '../ui/Card';
import 'leaflet/dist/leaflet.css';
// Fix for default marker icon in React Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
// @ts-ignore
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow
});
const CENTER_COORDS: [number, number] = [9.0394, 126.2161]; // 9°02'22"N, 126°12'58"E
const locations = [{
  id: 1,
  name: 'Main Administration Building',
  coords: [9.0394, 126.2161],
  type: 'Admin'
}, {
  id: 2,
  name: 'University Library',
  coords: [9.0398, 126.2165],
  type: 'Academic'
}, {
  id: 3,
  name: 'College of Engineering',
  coords: [9.039, 126.2158],
  type: 'Academic'
}, {
  id: 4,
  name: 'Student Center',
  coords: [9.0392, 126.2168],
  type: 'Student Services'
}, {
  id: 5,
  name: 'Science Laboratory',
  coords: [9.04, 126.2155],
  type: 'Academic'
}];
function MapController({
  center
}: {
  center: [number, number];
}) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 17);
  }, [center, map]);
  return null;
}
export function CampusMap() {
  const [activeLocation, setActiveLocation] = useState<[number, number]>(CENTER_COORDS);
  return <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Campus Map</h2>
          <p className="text-muted-foreground">
            Navigate NEMSU campus locations.
          </p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        <Card className="lg:col-span-3 overflow-hidden border-0 shadow-md relative z-0">
          <MapContainer center={CENTER_COORDS} zoom={17} style={{
          height: '100%',
          width: '100%'
        }} scrollWheelZoom={false}>
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapController center={activeLocation} />

            {locations.map(loc => <Marker key={loc.id} position={loc.coords as [number, number]}>
                <Popup>
                  <div className="p-1">
                    <h3 className="font-bold text-sm">{loc.name}</h3>
                    <p className="text-xs text-muted-foreground">{loc.type}</p>
                  </div>
                </Popup>
              </Marker>)}
          </MapContainer>
        </Card>

        <div className="lg:col-span-1 overflow-y-auto space-y-3 pr-2">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">
            Locations
          </h3>
          {locations.map(loc => <button key={loc.id} onClick={() => setActiveLocation(loc.coords as [number, number])} className={`w-full text-left p-3 rounded-lg border transition-all hover:shadow-md ${activeLocation === loc.coords ? 'bg-primary/5 border-primary ring-1 ring-primary' : 'bg-card border-border hover:border-primary/50'}`}>
              <div className="flex items-start gap-3">
                <div className={`mt-1 p-1.5 rounded-full ${activeLocation === loc.coords ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  <MapIcon className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium text-sm">{loc.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {loc.type}
                  </div>
                </div>
              </div>
            </button>)}
        </div>
      </div>
    </div>;
}