'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Property } from '@/app/(dashboard)/rentals/page';

// Fix Leaflet marker icon issue
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

// Create a custom pulsing blue marker icon for current/selected location
const createSelectedLocationIcon = () => {
  return L.divIcon({
    className: 'custom-selected-location-icon',
    html: `
      <div style="position: relative; width: 24px; height: 24px;">
        <div style="
          position: absolute;
          width: 14px;
          height: 14px;
          background: #3b82f6;
          border: 2px solid white;
          border-radius: 50%;
          top: 5px;
          left: 5px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          z-index: 2;
        "></div>
        <div style="
          position: absolute;
          width: 24px;
          height: 24px;
          background: rgba(59, 130, 246, 0.4);
          border-radius: 50%;
          animation: pulse 2s infinite ease-in-out;
          z-index: 1;
        "></div>
      </div>
      <style>
        @keyframes pulse {
          0% { transform: scale(0.6); opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      </style>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Create custom Price tag bubble icons (similar to Airbnb)
const createPriceMarkerIcon = (priceText: string, isHighlighted: boolean) => {
  // Format price text (e.g., ৳15,000/month -> ৳15k, ৳4,500/month -> ৳4.5k)
  let displayPrice = priceText.split('/')[0].replace('৳', '').trim();
  const numericPrice = parseInt(displayPrice.replace(/,/g, ''));
  if (!isNaN(numericPrice)) {
    if (numericPrice >= 1000) {
      const val = numericPrice / 1000;
      displayPrice = `৳${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}k`;
    } else {
      displayPrice = `৳${numericPrice}`;
    }
  } else {
    displayPrice = priceText.split('/')[0];
  }

  const bg = isHighlighted ? '#38a169' : '#ffffff';
  const color = isHighlighted ? '#ffffff' : '#09090b';
  const border = isHighlighted ? '2px solid #ffffff' : '1px solid #e4e4e7';
  const shadow = isHighlighted 
    ? '0 6px 16px rgba(56, 161, 105, 0.4), 0 2px 4px rgba(0,0,0,0.1)' 
    : '0 2px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)';
  const scale = isHighlighted ? 'scale(1.15)' : 'scale(1)';
  const zIndex = isHighlighted ? '1000' : '1';

  return L.divIcon({
    className: 'custom-price-marker-icon',
    html: `
      <div style="
        background: ${bg};
        color: ${color};
        border: ${border};
        box-shadow: ${shadow};
        transform: ${scale};
        z-index: ${zIndex};
        padding: 6px 10px;
        border-radius: 9999px;
        font-family: 'Poppins', sans-serif;
        font-weight: 700;
        font-size: 12px;
        white-space: nowrap;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      ">
        ${displayPrice}
      </div>
    `,
    iconSize: [55, 28],
    iconAnchor: [27, 14],
    popupAnchor: [0, -14],
  });
};

// Component to handle map center changes
function ChangeMapView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

// Component to handle map dragging and zoom updates
function MapEvents({ onMapMove }: { onMapMove: (lat: number, lng: number) => void }) {
  useMapEvents({
    dragend: (e) => {
      const center = e.target.getCenter();
      onMapMove(center.lat, center.lng);
    },
    zoomend: (e) => {
      const center = e.target.getCenter();
      onMapMove(center.lat, center.lng);
    }
  });
  return null;
}

interface RentalMapProps {
  properties: Property[];
  center: [number, number];
  highlightedPropertyId: number | null;
  onMarkerClick: (property: Property) => void;
  onMapMove: (lat: number, lng: number) => void;
  searchAsMove: boolean;
}

export default function RentalMap({
  properties,
  center,
  highlightedPropertyId,
  onMarkerClick,
  onMapMove,
  searchAsMove
}: RentalMapProps) {
  
  useEffect(() => {
    initLeafletIcons();
  }, []);

  const handleMapMove = (lat: number, lng: number) => {
    if (searchAsMove) {
      onMapMove(lat, lng);
    }
  };

  return (
    <div className="w-full h-full min-h-[400px] lg:h-[calc(100vh-220px)] rounded-[32px] overflow-hidden border border-gray-200/50 shadow-soft relative">
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '100%', width: '100%', zIndex: 10 }}
        zoomControl={true}
      >
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          attribution="&copy; Google Maps"
        />

        {/* Selected Location Center Pin */}
        <Marker position={center} icon={createSelectedLocationIcon()}>
          <Popup>
            <div className="font-bold text-center font-sans text-xs text-black">
              Current Search Center
            </div>
          </Popup>
        </Marker>

        {/* Nearby Properties Price Pins */}
        {properties.map((property) => {
          const isHighlighted = highlightedPropertyId === property.id;
          return (
            <Marker 
              key={property.id} 
              position={property.coordinates}
              icon={createPriceMarkerIcon(property.rentText, isHighlighted)}
            >
              <Popup>
                <div className="font-sans w-48 text-black flex flex-col gap-2 p-1">
                  <div className="h-24 w-full rounded-xl overflow-hidden bg-gray-100 relative">
                    <img 
                      src={property.image} 
                      alt={property.title} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-2 right-2">
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md ${
                        property.available 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {property.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 mt-1 line-clamp-1">{property.title}</h4>
                    <p className="font-extrabold text-sm text-primary mt-0.5">{property.rentText}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5 font-medium">{property.details}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Distance: {property.distance ? property.distance.toFixed(2) : 0} km</p>
                  </div>
                  <button 
                    onClick={() => onMarkerClick(property)}
                    className="w-full py-2 text-xs font-bold bg-black text-white rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Change map view when center updates */}
        <ChangeMapView center={center} />
        
        {/* Listen for move/drag events */}
        <MapEvents onMapMove={handleMapMove} />
      </MapContainer>
    </div>
  );
}
