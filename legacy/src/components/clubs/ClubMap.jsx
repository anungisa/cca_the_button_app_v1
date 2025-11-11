import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Create a custom red icon
const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export default function ClubMap({ clubs, onSelectClub }) {
  // CRITICAL FIX: Ensure clubs is a valid array before filtering.
  const validClubs = Array.isArray(clubs) ? clubs.filter(club => club.location?.latitude && club.location?.longitude) : [];
  const position = [56.1304, -106.3468]; // Center of Canada

  // Handle case where no clubs have valid locations
  if (validClubs.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-brand-charcoal text-brand-text-secondary">
        <p>No clubs with location data to display on the map.</p>
      </div>
    );
  }

  return (
    <MapContainer center={position} zoom={4} style={{ height: '100%', width: '100%' }} className="z-0">
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      {validClubs.map(club => (
        <Marker 
          key={club.id} 
          position={[club.location.latitude, club.location.longitude]} 
          icon={redIcon}
          eventHandlers={{
            click: () => {
              onSelectClub(club);
            },
          }}
        >
          <Popup>
            {club.name}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}