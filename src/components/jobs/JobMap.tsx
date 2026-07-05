'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default leaflet icons
const initLeafletIcons = () => {
  if (typeof window !== 'undefined') {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }
};

// Custom Marker DivIcons
const createJobCountIcon = (label: string, isSelected: boolean) => {
  const bg = isSelected ? '#38a169' : '#000000';
  const color = '#ffffff';
  const border = isSelected ? '3px solid #ffffff' : '2px solid #ffffff';
  const shadow = isSelected 
    ? '0 4px 12px rgba(56, 161, 105, 0.4), 0 2px 4px rgba(0,0,0,0.2)' 
    : '0 2px 6px rgba(0,0,0,0.3)';
  const scale = isSelected ? 'scale(1.15)' : 'scale(1)';

  return L.divIcon({
    className: 'custom-job-marker-icon',
    html: `
      <div style="
        background: ${bg};
        color: ${color};
        border: ${border};
        box-shadow: ${shadow};
        transform: ${scale};
        padding: 6px 12px;
        border-radius: 9999px;
        font-family: 'Poppins', sans-serif;
        font-weight: 700;
        font-size: 11px;
        white-space: nowrap;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      ">
        ${label}
      </div>
    `,
    iconSize: [65, 30],
    iconAnchor: [32, 15],
    popupAnchor: [0, -15],
  });
};

function ChangeMapView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

interface MarkerItem {
  id: string;
  name: string;
  coords: [number, number];
  type: 'country' | 'city';
}

const COUNTRY_MARKERS: MarkerItem[] = [
  { id: 'USA', name: 'USA', coords: [37.0902, -95.7129], type: 'country' },
  { id: 'UK', name: 'UK', coords: [55.3781, -3.4360], type: 'country' },
  { id: 'Canada', name: 'Canada', coords: [56.1304, -106.3468], type: 'country' },
  { id: 'Germany', name: 'Germany', coords: [51.1657, 10.4515], type: 'country' },
  { id: 'UAE', name: 'UAE', coords: [23.4241, 53.8478], type: 'country' }
];

const CITY_MARKERS: MarkerItem[] = [
  { id: 'Dhaka', name: 'Dhaka', coords: [23.8103, 90.4125], type: 'city' },
  { id: 'Chittagong', name: 'Chittagong', coords: [22.3569, 91.7832], type: 'city' },
  { id: 'Sylhet', name: 'Sylhet', coords: [24.8949, 91.8687], type: 'city' },
  { id: 'Rajshahi', name: 'Rajshahi', coords: [24.3636, 88.6241], type: 'city' },
  { id: 'Khulna', name: 'Khulna', coords: [22.8456, 89.5403], type: 'city' }
];

interface JobMapProps {
  mode: 'remote' | 'offline' | 'hybrid';
  selectedCountry: string;
  selectedCity: string;
  onSelectCountry: (country: string) => void;
  onSelectCity: (city: string) => void;
  jobs: any[];
}

export default function JobMap({
  mode,
  selectedCountry,
  selectedCity,
  onSelectCountry,
  onSelectCity,
  jobs
}: JobMapProps) {

  useEffect(() => {
    initLeafletIcons();
  }, []);

  // Determine active markers based on current mode
  const markers = React.useMemo(() => {
    if (mode === 'remote') return COUNTRY_MARKERS;
    if (mode === 'offline') return CITY_MARKERS;
    return [...COUNTRY_MARKERS, ...CITY_MARKERS]; // Hybrid mode combined
  }, [mode]);

  // Determine center and zoom level based on mode and active selections
  const { center, zoom } = React.useMemo(() => {
    if (mode === 'remote') {
      if (selectedCountry) {
        const match = COUNTRY_MARKERS.find(c => c.id === selectedCountry);
        if (match) return { center: match.coords, zoom: 4 };
      }
      return { center: [35.0, -40.0] as [number, number], zoom: 2 }; // World Center
    }
    
    if (mode === 'offline') {
      if (selectedCity) {
        const match = CITY_MARKERS.find(c => c.id === selectedCity);
        if (match) return { center: match.coords, zoom: 10 };
      }
      return { center: [23.8103, 90.4125] as [number, number], zoom: 7 }; // BD Center
    }

    // Hybrid mode zoom
    if (selectedCountry) {
      const match = COUNTRY_MARKERS.find(c => c.id === selectedCountry);
      if (match) return { center: match.coords, zoom: 4 };
    }
    if (selectedCity) {
      const match = CITY_MARKERS.find(c => c.id === selectedCity);
      if (match) return { center: match.coords, zoom: 10 };
    }
    return { center: [30.0, 30.0] as [number, number], zoom: 2 }; // Zoomed out view
  }, [mode, selectedCountry, selectedCity]);

  // Count jobs per marker location
  const getJobCountText = (marker: MarkerItem) => {
    let count = 0;
    if (marker.type === 'country') {
      count = jobs.filter(j => j.country && j.country.toLowerCase() === marker.id.toLowerCase()).length;
    } else {
      count = jobs.filter(j => j.city && j.city.toLowerCase() === marker.id.toLowerCase()).length;
    }
    return `${marker.name} (${count})`;
  };

  const handleMarkerClick = (marker: MarkerItem) => {
    if (marker.type === 'country') {
      onSelectCountry(marker.id);
    } else {
      onSelectCity(marker.id);
    }
  };

  return (
    <div className="w-full h-full min-h-[350px] lg:h-[400px] rounded-[32px] overflow-hidden border border-gray-200/50 shadow-soft relative">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%', zIndex: 10 }}
        zoomControl={true}
      >
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          attribution="&copy; Google Maps"
        />

        {markers.map((marker) => {
          const isSelected = 
            (marker.type === 'country' && selectedCountry === marker.id) ||
            (marker.type === 'city' && selectedCity === marker.id);

          return (
            <Marker 
              key={marker.id} 
              position={marker.coords}
              icon={createJobCountIcon(getJobCountText(marker), isSelected)}
              eventHandlers={{
                click: () => handleMarkerClick(marker)
              }}
            >
              <Popup>
                <div className="text-center font-sans text-xs text-black p-0.5">
                  <p className="font-bold text-slate-800">{marker.name} Opportunities</p>
                  <p className="text-slate-400 mt-0.5 font-medium">Click to show listings for this area</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <ChangeMapView center={center} zoom={zoom} />
      </MapContainer>
    </div>
  );
}
