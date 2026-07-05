'use client';

import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { toast } from 'sonner';

// Fix Leaflet Default Icons
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

// Custom DivIcons Helper
const createEmergencyIcon = (category: string, priority: string) => {
  let emoji = '⚠️';
  if (category.toLowerCase().includes('blood')) emoji = '🩸';
  else if (category.toLowerCase().includes('ambulance')) emoji = '🚑';
  else if (category.toLowerCase().includes('accident')) emoji = '💥';
  else if (category.toLowerCase().includes('missing')) emoji = '👶';
  else if (category.toLowerCase().includes('fire')) emoji = '🔥';
  else if (category.toLowerCase().includes('disaster')) emoji = '🌪️';
  else if (category.toLowerCase().includes('police')) emoji = '👮';

  let border = '2px solid white';
  let bg = '#ef4444'; // Red for Critical/Life Threatening
  if (priority.toLowerCase().includes('life')) {
    bg = '#dc2626';
    border = '3px solid #fecaca';
  } else if (priority.toLowerCase().includes('urgent')) {
    bg = '#f59e0b'; // Amber
  } else if (priority.toLowerCase().includes('normal')) {
    bg = '#10b981'; // Green
  }

  return L.divIcon({
    className: 'custom-emergency-icon',
    html: `
      <div style="position: relative; width: 36px; height: 36px;">
        <div style="
          position: absolute;
          width: 36px;
          height: 36px;
          background: ${bg};
          border: ${border};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          z-index: 2;
        ">${emoji}</div>
        ${priority.toLowerCase().includes('life') ? `
          <div style="
            position: absolute;
            width: 48px;
            height: 48px;
            background: rgba(220, 38, 38, 0.3);
            border-radius: 50%;
            top: -6px;
            left: -6px;
            animation: pulse-red 1.5s infinite ease-in-out;
            z-index: 1;
          "></div>
        ` : ''}
      </div>
      <style>
        @keyframes pulse-red {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      </style>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

const createHospitalIcon = () => {
  return L.divIcon({
    className: 'custom-hospital-icon',
    html: `
      <div style="
        background: #3b82f6;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 4px 8px rgba(0,0,0,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Poppins', sans-serif;
        font-weight: 800;
        font-size: 14px;
      ">🏥</div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

const createAmbulanceIcon = (status: string) => {
  const bg = status === 'Available' ? '#10b981' : status === 'En Route' ? '#3b82f6' : '#ef4444';
  return L.divIcon({
    className: 'custom-ambulance-icon',
    html: `
      <div style="
        background: ${bg};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 4px 8px rgba(0,0,0,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
      ">🚑</div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

function ChangeMapView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export interface MapEmergency {
  id: string | number;
  title: string;
  category: string;
  priority: string;
  description: string;
  coordinates: [number, number];
  contact: string;
  time?: string;
}

export interface MapHospital {
  id: string | number;
  name: string;
  coordinates: [number, number];
  beds: string;
  icu: string;
  contact: string;
}

export interface MapAmbulance {
  id: string | number;
  name: string;
  coordinates: [number, number];
  status: 'Available' | 'En Route' | 'Busy';
  driver: string;
  contact: string;
}

interface EmergencyMapProps {
  emergencies: MapEmergency[];
  hospitals: MapHospital[];
  ambulances: MapAmbulance[];
  activeAmbulanceId: string | number | null;
  dispatchDestination: [number, number] | null;
  onMarkerClick?: (type: 'emergency' | 'hospital' | 'ambulance', item: any) => void;
  showMissingHotzones?: boolean;
}

export default function EmergencyMap({
  emergencies,
  hospitals,
  ambulances,
  activeAmbulanceId,
  dispatchDestination,
  onMarkerClick,
  showMissingHotzones = false
}: EmergencyMapProps) {
  
  const [animatedRoute, setAnimatedRoute] = useState<[number, number][]>([]);
  const [movingAmbulancePos, setMovingAmbulancePos] = useState<[number, number] | null>(null);
  const [eta, setEta] = useState<number | null>(null);
  const animationTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initLeafletIcons();
  }, []);

  // Handle live ambulance route tracking animation
  useEffect(() => {
    if (activeAmbulanceId && dispatchDestination) {
      const activeAmb = ambulances.find(a => a.id === activeAmbulanceId);
      if (!activeAmb) return;

      const start = activeAmb.coordinates;
      const end = dispatchDestination;
      
      // Interpolate coordinates to create a smooth path (15 steps)
      const steps = 15;
      const path: [number, number][] = [];
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const lat = start[0] + (end[0] - start[0]) * t;
        const lng = start[1] + (end[1] - start[1]) * t;
        path.push([lat, lng]);
      }

      setAnimatedRoute(path);
      setMovingAmbulancePos(start);
      setEta(15); // ETA: 15 seconds simulation

      let currentStep = 0;
      if (animationTimer.current) clearInterval(animationTimer.current);

      animationTimer.current = setInterval(() => {
        currentStep++;
        if (currentStep >= path.length) {
          if (animationTimer.current) clearInterval(animationTimer.current);
          setMovingAmbulancePos(end);
          setEta(0);
          toast.success(`Ambulance ${activeAmb.name} has arrived at the emergency site!`);
        } else {
          setMovingAmbulancePos(path[currentStep]);
          setEta(steps - currentStep);
        }
      }, 1000);

    } else {
      if (animationTimer.current) clearInterval(animationTimer.current);
      setAnimatedRoute([]);
      setMovingAmbulancePos(null);
      setEta(null);
    }

    return () => {
      if (animationTimer.current) clearInterval(animationTimer.current);
    };
  }, [activeAmbulanceId, dispatchDestination, ambulances]);

  // Centered in Savar/Dhaka region
  const center: [number, number] = [23.8582, 90.2662];
  const zoom = 12;

  // Determine hotzone circles for missing child tracking
  const missingEmergencies = emergencies.filter(e => e.category.toLowerCase().includes('missing'));

  return (
    <div className="w-full h-full min-h-[400px] lg:h-[calc(100vh-220px)] rounded-[32px] overflow-hidden border border-red-100 shadow-soft relative">
      
      {eta !== null && eta > 0 && (
        <div className="absolute top-4 left-4 z-[999] bg-red-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg border border-red-500 animate-bounce">
          🚨 Dispatch Tracking: ETA {eta} seconds
        </div>
      )}

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

        {/* 1. Emergencies Markers */}
        {emergencies.map((emergency) => (
          <Marker 
            key={`emerg-${emergency.id}`} 
            position={emergency.coordinates}
            icon={createEmergencyIcon(emergency.category, emergency.priority)}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick('emergency', emergency)
            }}
          >
            <Popup>
              <div className="font-sans text-black w-48 p-0.5">
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full text-white ${
                  emergency.priority.toLowerCase().includes('life') ? 'bg-red-600' :
                  emergency.priority.toLowerCase().includes('urgent') ? 'bg-amber-500' : 'bg-green-500'
                }`}>
                  {emergency.priority}
                </span>
                <h4 className="font-bold text-sm text-slate-800 mt-1.5 leading-snug">{emergency.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal line-clamp-2">{emergency.description}</p>
                <p className="text-[10px] text-red-500 mt-1.5 font-bold">Contact: {emergency.contact}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 2. Hospitals Markers */}
        {hospitals.map((hospital) => (
          <Marker
            key={`hosp-${hospital.id}`}
            position={hospital.coordinates}
            icon={createHospitalIcon()}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick('hospital', hospital)
            }}
          >
            <Popup>
              <div className="font-sans text-black w-48 p-0.5">
                <h4 className="font-bold text-sm text-slate-900 leading-snug">🏥 {hospital.name}</h4>
                <div className="text-[11px] text-slate-600 mt-1 font-semibold space-y-0.5">
                  <p>ICU Beds: <span className="text-primary font-bold">{hospital.icu}</span></p>
                  <p>General Beds: <span className="text-slate-800 font-bold">{hospital.beds}</span></p>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">Contact: {hospital.contact}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 3. Static/Un-dispatched Ambulances Markers */}
        {ambulances.map((ambulance) => {
          // If this ambulance is currently animating, don't draw its original static pin
          if (movingAmbulancePos && activeAmbulanceId === ambulance.id) return null;
          
          return (
            <Marker
              key={`amb-${ambulance.id}`}
              position={ambulance.coordinates}
              icon={createAmbulanceIcon(ambulance.status)}
              eventHandlers={{
                click: () => onMarkerClick && onMarkerClick('ambulance', ambulance)
              }}
            >
              <Popup>
                <div className="font-sans text-black w-48 p-0.5">
                  <h4 className="font-bold text-sm text-slate-900">🚑 {ambulance.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Driver: {ambulance.driver}</p>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 mt-1.5 inline-block rounded-full ${
                    ambulance.status === 'Available' ? 'bg-green-100 text-green-700' :
                    ambulance.status === 'En Route' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {ambulance.status}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">Contact: {ambulance.contact}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* 4. Active/Moving Ambulance Animation Marker */}
        {movingAmbulancePos && activeAmbulanceId && (
          <Marker 
            position={movingAmbulancePos} 
            icon={createAmbulanceIcon('En Route')}
          >
            <Popup>
              <div className="font-sans text-black text-xs">
                <p className="font-bold">🚑 Ambulance In Transit</p>
                <p className="text-slate-400">En route to emergency scene...</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Draw the route polyline */}
        {animatedRoute.length > 0 && (
          <Polyline 
            positions={animatedRoute} 
            color="#ef4444" 
            weight={4} 
            opacity={0.8}
            dashArray="10, 10"
          />
        )}

        {/* Draw hot-zones for missing child alerts (Area Clustering / Hot zones) */}
        {showMissingHotzones && missingEmergencies.map((me, i) => (
          <Marker
            key={`hz-${i}`}
            position={me.coordinates}
            icon={L.divIcon({ className: 'hidden' })}
          >
            <Circle
              center={me.coordinates}
              radius={800} // 800 meters hot-zone
              pathOptions={{
                color: '#ef4444',
                fillColor: '#ef4444',
                fillOpacity: 0.15,
                weight: 1
              }}
            />
          </Marker>
        ))}

        <ChangeMapView center={movingAmbulancePos || center} zoom={movingAmbulancePos ? 14 : zoom} />
      </MapContainer>
    </div>
  );
}
