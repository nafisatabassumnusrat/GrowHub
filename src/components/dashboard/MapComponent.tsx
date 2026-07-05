'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Dummy avatars representing local people
const avatars = [
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/46.jpg',
  'https://randomuser.me/api/portraits/women/68.jpg',
  'https://randomuser.me/api/portraits/men/22.jpg',
];

const createCustomIcon = (imageUrl: string, type: string) => {
  const borderColor = type === 'farmer' ? '#38a169' : '#3182ce'; // Green for farmer, Blue for buyer
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div style="
        width: 44px; 
        height: 44px; 
        border-radius: 50%; 
        border: 3px solid ${borderColor}; 
        background-image: url(${imageUrl});
        background-size: cover;
        background-position: center;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
  });
};

export default function MapComponent({ activeFilter }: { activeFilter: string }) {
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  // Centered roughly on Dhaka for the demo
  const center: [number, number] = [23.8103, 90.4125]; 

  const markers = [
    { id: 1, type: 'farmer', name: 'Karim Uddin', role: 'Rice Farmer', pos: [23.8153, 90.4105] as [number, number], img: avatars[0] },
    { id: 2, type: 'buyer', name: 'Rahim Mia', role: 'Local Buyer', pos: [23.8053, 90.4185] as [number, number], img: avatars[2] },
    { id: 3, type: 'farmer', name: 'Jamal Agro', role: 'Vegetable Farmer', pos: [23.8203, 90.4025] as [number, number], img: avatars[4] },
    { id: 4, type: 'buyer', name: 'Sumi Begum', role: 'Wholesaler', pos: [23.8003, 90.4205] as [number, number], img: avatars[1] },
    { id: 5, type: 'farmer', name: 'Mizanur Rahman', role: 'Fish Farmer', pos: [23.8123, 90.4225] as [number, number], img: avatars[2] },
  ];

  const filteredMarkers = activeFilter === 'all' 
    ? markers 
    : markers.filter(m => m.type === activeFilter);

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '32px', overflow: 'hidden' }}>
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%', zIndex: 10 }} zoomControl={false}>
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          attribution="&copy; Google Maps"
        />
        {filteredMarkers.map(marker => (
          <Marker key={marker.id} position={marker.pos} icon={createCustomIcon(marker.img, marker.type)}>
            <Popup>
              <div className="text-center font-sans">
                <p className="font-bold text-sm m-0">{marker.name}</p>
                <p className="text-xs text-gray-500 m-0">{marker.role}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        {/* You marker */}
        <Marker position={center} icon={L.divIcon({
          className: 'custom-you-icon',
          html: `<div style="width:16px;height:16px;background:#3182ce;border:3px solid white;border-radius:50%;box-shadow:0 0 0 2px #3182ce40, 0 4px 6px rgba(0,0,0,0.3);"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        })}>
          <Popup>
            <div className="font-bold text-center font-sans text-sm">You are here</div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
