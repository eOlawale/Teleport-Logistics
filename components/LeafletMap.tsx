import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
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

interface LeafletMapProps {
  onLocationSelect: (type: 'pickup' | 'dropoff', location: Location) => void;
  pickupLocation: Location | null;
  dropoffLocation: Location | null;
}

const MapEvents: React.FC<{ 
  onMapClick: (e: L.LeafletMouseEvent) => void 
}> = ({ onMapClick }) => {
  useMapEvents({
    click: onMapClick,
  });
  return null;
};

export const LeafletMap: React.FC<LeafletMapProps> = ({ 
  onLocationSelect, 
  pickupLocation, 
  dropoffLocation 
}) => {
  // Center on San Francisco by default
  const [center] = useState<[number, number]>([37.7749, -122.4194]);

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    const address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    const newLocation = { address, lat, lng };

    // Simple logic: If pickup is missing, set pickup. Otherwise set dropoff.
    // If both exist, reset dropoff and set pickup to new location.
    if (!pickupLocation) {
      onLocationSelect('pickup', newLocation);
    } else if (!dropoffLocation) {
      onLocationSelect('dropoff', newLocation);
    } else {
      // Start over
      onLocationSelect('pickup', newLocation);
    }
  };

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapEvents onMapClick={handleMapClick} />

      {pickupLocation && pickupLocation.lat && pickupLocation.lng && (
        <Marker position={[pickupLocation.lat, pickupLocation.lng]} icon={pickupIcon}>
          <Popup>Pickup: {pickupLocation.address}</Popup>
        </Marker>
      )}

      {dropoffLocation && dropoffLocation.lat && dropoffLocation.lng && (
        <Marker position={[dropoffLocation.lat, dropoffLocation.lng]} icon={dropoffIcon}>
          <Popup>Dropoff: {dropoffLocation.address}</Popup>
        </Marker>
      )}

      {pickupLocation?.lat && dropoffLocation?.lat && (
        <Polyline 
          positions={[
            [pickupLocation.lat!, pickupLocation.lng!],
            [dropoffLocation.lat!, dropoffLocation.lng!]
          ]}
          color="blue"
          dashArray="10, 10" 
        />
      )}
    </MapContainer>
  );
};
