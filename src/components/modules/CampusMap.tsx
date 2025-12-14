import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import { Icon, DivIcon } from 'leaflet';
import { Map as MapIcon, Navigation, MapPin } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
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
// Custom blue dot icon for user location
const userLocationIcon = new DivIcon({
  className: 'user-location-marker',
  html: `
    <div style="position: relative; width: 20px; height: 20px;">
      <div style="
        position: absolute;
        width: 20px;
        height: 20px;
        background: #3b82f6;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>
      <div style="
        position: absolute;
        width: 20px;
        height: 20px;
        background: #3b82f6;
        border-radius: 50%;
        opacity: 0.3;
        animation: pulse 2s ease-out infinite;
      "></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});
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
function UserLocationMarker() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [accuracy, setAccuracy] = useState<number>(0);
  const map = useMap();
  useEffect(() => {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser');
      return;
    }
    const watchId = navigator.geolocation.watchPosition(pos => {
      const newPosition: [number, number] = [pos.coords.latitude, pos.coords.longitude];
      setPosition(newPosition);
      setAccuracy(pos.coords.accuracy);
    }, error => {
      console.error('Error getting location:', error);
    }, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [map]);
  if (!position) return null;
  return <>
      <Circle center={position} radius={accuracy} pathOptions={{
      color: '#3b82f6',
      fillColor: '#3b82f6',
      fillOpacity: 0.1,
      weight: 1
    }} />
      <Marker position={position} icon={userLocationIcon}>
        <Popup>
          <div className="p-1">
            <h3 className="font-bold text-sm flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Your Location
            </h3>
            <p className="text-xs text-muted-foreground">
              Accuracy: ±{Math.round(accuracy)}m
            </p>
          </div>
        </Popup>
      </Marker>
    </>;
}
export function CampusMap() {
  const [activeLocation, setActiveLocation] = useState<[number, number]>(CENTER_COORDS);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const centerOnUser = () => {
    if (userLocation) {
      setActiveLocation(userLocation);
    } else {
      navigator.geolocation.getCurrentPosition(pos => {
        const newPosition: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(newPosition);
        setActiveLocation(newPosition);
      }, error => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please enable location services.');
      });
    }
  };
  return <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Campus Map</h2>
          <p className="text-muted-foreground">
            Navigate NEMSU campus locations.
          </p>
        </div>
        <Button onClick={centerOnUser} variant="outline" size="sm">
          <Navigation className="h-4 w-4 mr-2" />
          My Location
        </Button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        <Card className="lg:col-span-3 overflow-hidden border-0 shadow-md relative z-0">
          <MapContainer center={CENTER_COORDS} zoom={17} style={{
          height: '100%',
          width: '100%'
        }} scrollWheelZoom={false}>
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapController center={activeLocation} />
            <UserLocationMarker />

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

      <style>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(2);
            opacity: 0;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>;
}