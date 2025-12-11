import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Location } from '../types';

// Fix for default Leaflet marker icons in React
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

// Green icon for pickup
const pickupIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Red icon for dropoff
const dropoffIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Gold icon for stops
const stopIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Car icon for driver with custom class for pulsing
const driverIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3097/3097180.png', 
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18],
  className: 'driver-marker-pulse' 
});

interface LeafletMapProps {
  onLocationSelect: (type: 'pickup' | 'dropoff', location: Location) => void;
  pickupLocation: Location | null;
  dropoffLocation: Location | null;
  stops?: Location[]; // New prop for stops
  driverLocation?: Location | null;
}

const MapEvents: React.FC<{ 
  onMapClick: (e: L.LeafletMouseEvent) => void 
}> = ({ onMapClick }) => {
  useMapEvents({
    click: onMapClick,
  });
  return null;
};

// Component to handle auto-fitting bounds
const MapBoundsHandler: React.FC<{
  pickup: Location | null;
  dropoff: Location | null;
  stops?: Location[];
  driver: Location | null | undefined;
}> = ({ pickup, dropoff, stops, driver }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    
    const bounds = L.latLngBounds([]);
    let hasPoints = false;

    if (pickup?.lat && pickup.lng) {
      bounds.extend([pickup.lat, pickup.lng]);
      hasPoints = true;
    }
    if (dropoff?.lat && dropoff.lng) {
      bounds.extend([dropoff.lat, dropoff.lng]);
      hasPoints = true;
    }
    if (driver?.lat && driver.lng) {
      bounds.extend([driver.lat, driver.lng]);
      hasPoints = true;
    }
    if (stops) {
      stops.forEach(stop => {
        if (stop.lat && stop.lng) {
          bounds.extend([stop.lat, stop.lng]);
          hasPoints = true;
        }
      });
    }

    if (hasPoints) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [pickup, dropoff, stops, driver, map]);

  return null;
};

export const LeafletMap: React.FC<LeafletMapProps> = ({ 
  onLocationSelect, 
  pickupLocation, 
  dropoffLocation,
  stops = [],
  driverLocation
}) => {
  // Center on San Francisco by default
  const [center] = useState<[number, number]>([37.7749, -122.4194]);

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    const address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    const newLocation = { address, lat, lng };

    if (!pickupLocation) {
      onLocationSelect('pickup', newLocation);
    } else if (!dropoffLocation) {
      onLocationSelect('dropoff', newLocation);
    } else {
      // If both exist, restart by replacing pickup
      onLocationSelect('pickup', newLocation);
    }
  };

  // Construct polyline path
  const polylinePositions = [];
  if (pickupLocation?.lat && pickupLocation.lng) polylinePositions.push([pickupLocation.lat, pickupLocation.lng] as [number, number]);
  stops.forEach(s => {
    if (s.lat && s.lng) polylinePositions.push([s.lat, s.lng] as [number, number]);
  });
  if (dropoffLocation?.lat && dropoffLocation.lng) polylinePositions.push([dropoffLocation.lat, dropoffLocation.lng] as [number, number]);

  return (
    <>
      <style>
        {`
          .driver-marker-pulse {
            animation: carPulse 1.5s infinite;
          }
          @keyframes carPulse {
            0% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(37, 99, 235, 0.4)); }
            50% { transform: scale(1.1); filter: drop-shadow(0 0 8px rgba(37, 99, 235, 0.6)); }
            100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(37, 99, 235, 0.4)); }
          }
        `}
      </style>
      <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapEvents onMapClick={handleMapClick} />
        <MapBoundsHandler pickup={pickupLocation} dropoff={dropoffLocation} stops={stops} driver={driverLocation} />

        {pickupLocation && pickupLocation.lat && pickupLocation.lng && (
          <Marker position={[pickupLocation.lat, pickupLocation.lng]} icon={pickupIcon}>
            <Popup>Pickup: {pickupLocation.address}</Popup>
          </Marker>
        )}

        {stops.map((stop, idx) => (
          stop.lat && stop.lng && (
            <Marker key={idx} position={[stop.lat, stop.lng]} icon={stopIcon}>
              <Popup>Stop {idx + 1}: {stop.address}</Popup>
            </Marker>
          )
        ))}

        {dropoffLocation && dropoffLocation.lat && dropoffLocation.lng && (
          <Marker position={[dropoffLocation.lat, dropoffLocation.lng]} icon={dropoffIcon}>
            <Popup>Dropoff: {dropoffLocation.address}</Popup>
          </Marker>
        )}

        {driverLocation && driverLocation.lat && driverLocation.lng && (
          <Marker position={[driverLocation.lat, driverLocation.lng]} icon={driverIcon}>
             <Popup>Driver</Popup>
          </Marker>
        )}

        {polylinePositions.length > 1 && (
          <Polyline 
            positions={polylinePositions}
            color="blue"
            dashArray="10, 10" 
          />
        )}
      </MapContainer>
    </>
  );
};
