'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Home, MapPin, Navigation, Shuffle, ShieldAlert, Phone, Map } from 'lucide-react';
import { toast } from 'sonner';

export interface Property {
  id: number;
  type: string; // 'Rent House' | 'Rent Room' | 'Flat'
  title: string;
  rent: number;
  rentText: string;
  location: string;
  coordinates: [number, number];
  details: string;
  image: string;
  available: boolean;
  dateAdded: string;
  ownerName: string;
  ownerPhone: string;
  distance?: number;
}

const NEIGHBORHOODS = [
  { name: 'Gulshan', coordinates: [23.7925, 90.4078] as [number, number] },
  { name: 'Banani', coordinates: [23.7940, 90.4043] as [number, number] },
  { name: 'Dhanmondi', coordinates: [23.7461, 90.3742] as [number, number] },
  { name: 'Mirpur', coordinates: [23.8041, 90.3686] as [number, number] },
  { name: 'Uttara', coordinates: [23.8759, 90.3795] as [number, number] },
  { name: 'Motijheel', coordinates: [23.7330, 90.4172] as [number, number] },
  { name: 'Mohammadpur', coordinates: [23.7657, 90.3626] as [number, number] },
  { name: 'Badda', coordinates: [23.7805, 90.4267] as [number, number] },
  { name: 'Wari', coordinates: [23.7196, 90.4127] as [number, number] },
  { name: 'Tejgaon', coordinates: [23.7612, 90.3986] as [number, number] },
  { name: 'Khilgaon', coordinates: [23.7487, 90.4234] as [number, number] },
  { name: 'Farmgate', coordinates: [23.7561, 90.3872] as [number, number] },
  { name: 'Lalbagh', coordinates: [23.7189, 90.3882] as [number, number] },
  { name: 'Cantonment', coordinates: [23.8225, 90.3934] as [number, number] },
  { name: 'Bashundhara', coordinates: [23.8193, 90.4282] as [number, number] }
];

const mockProperties: Property[] = [
  {
    id: 1,
    type: 'Rent House',
    title: 'Cozy 2BHK Apartment for Rent',
    rent: 15000,
    rentText: '৳15,000/month',
    location: 'Gulshan',
    coordinates: [23.7925, 90.4078],
    details: '2 Beds, 2 Baths, Kitchen, Balcony',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&q=80',
    available: true,
    dateAdded: '2026-06-25',
    ownerName: 'Abdur Rahim',
    ownerPhone: '+880 1711-223344',
  },
  {
    id: 2,
    type: 'Rent Room',
    title: 'Student Room with Attached Bath',
    rent: 4500,
    rentText: '৳4,500/month',
    location: 'Farmgate',
    coordinates: [23.7561, 90.3872],
    details: '1 Bed, 1 Bath, Common Kitchen',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&q=80',
    available: true,
    dateAdded: '2026-07-01',
    ownerName: 'Kamal Ahmed',
    ownerPhone: '+880 1812-334455',
  },
  {
    id: 3,
    type: 'Flat',
    title: 'Modern 3BHK Family Flat',
    rent: 28000,
    rentText: '৳28,000/month',
    location: 'Banani',
    coordinates: [23.7940, 90.4043],
    details: '3 Beds, 3 Baths, Large Kitchen, 2 Balconies',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&q=80',
    available: true,
    dateAdded: '2026-06-10',
    ownerName: 'Zahirul Islam',
    ownerPhone: '+880 1913-445566',
  },
  {
    id: 4,
    type: 'Rent Room',
    title: 'Sublet Room for Female Student',
    rent: 3500,
    rentText: '৳3,500/month',
    location: 'Dhanmondi',
    coordinates: [23.7461, 90.3742],
    details: '1 Bed, 1 Shared Bath, Wi-Fi included',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=500&q=80',
    available: true,
    dateAdded: '2026-07-03',
    ownerName: 'Tasnim Begum',
    ownerPhone: '+880 1514-556677',
  },
  {
    id: 5,
    type: 'Rent House',
    title: 'Affordable 2BHK House',
    rent: 10000,
    rentText: '৳10,000/month',
    location: 'Mirpur',
    coordinates: [23.8041, 90.3686],
    details: '2 Beds, 1 Bath, Gas & Water included',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&q=80',
    available: true,
    dateAdded: '2026-06-30',
    ownerName: 'Mizanur Rahman',
    ownerPhone: '+880 1615-667788',
  },
  {
    id: 6,
    type: 'Flat',
    title: 'Spacious 2BHK Flat',
    rent: 14000,
    rentText: '৳14,000/month',
    location: 'Uttara',
    coordinates: [23.8759, 90.3795],
    details: '2 Beds, 2 Baths, Near Metro Station',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=500&q=80',
    available: false,
    dateAdded: '2026-06-15',
    ownerName: 'Rafiqul Islam',
    ownerPhone: '+880 1716-778899',
  },
  {
    id: 7,
    type: 'Rent House',
    title: 'Premium Penthouse with Roof Access',
    rent: 45000,
    rentText: '৳45,000/month',
    location: 'Gulshan',
    coordinates: [23.7960, 90.4110],
    details: '3 Beds, 4 Baths, Maid room, Servant bath',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&q=80',
    available: true,
    dateAdded: '2026-07-04',
    ownerName: 'Sajid Chowdhury',
    ownerPhone: '+880 1711-998877',
  },
  {
    id: 8,
    type: 'Flat',
    title: 'Compact 1BHK Apartment',
    rent: 8000,
    rentText: '৳8,000/month',
    location: 'Badda',
    coordinates: [23.7805, 90.4267],
    details: '1 Bed, 1 Bath, Kitchen, drawing-dining combined',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&q=80',
    available: true,
    dateAdded: '2026-06-28',
    ownerName: 'Ali Hossain',
    ownerPhone: '+880 1819-221100',
  },
  {
    id: 9,
    type: 'Rent Room',
    title: 'Bachelor Room near University',
    rent: 3000,
    rentText: '৳3,000/month',
    location: 'Mohammadpur',
    coordinates: [23.7657, 90.3626],
    details: '1 Bed, Shared bath, Dining facilities',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=500&q=80',
    available: true,
    dateAdded: '2026-07-02',
    ownerName: 'Faruk Ahmed',
    ownerPhone: '+880 1918-332211',
  },
  {
    id: 10,
    type: 'Flat',
    title: 'Brand New 3BHK Apartment',
    rent: 22000,
    rentText: '৳22,000/month',
    location: 'Bashundhara',
    coordinates: [23.8193, 90.4282],
    details: '3 Beds, 3 Baths, Elevator, Parking slot',
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=500&q=80',
    available: true,
    dateAdded: '2026-06-20',
    ownerName: 'Mehedi Hasan',
    ownerPhone: '+880 1515-443322',
  },
  {
    id: 11,
    type: 'Rent House',
    title: 'Traditional Duplex Villa',
    rent: 60000,
    rentText: '৳60,000/month',
    location: 'Dhanmondi',
    coordinates: [23.7440, 90.3720],
    details: '4 Beds, 4 Baths, Private lawn, Garage',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80',
    available: true,
    dateAdded: '2026-05-15',
    ownerName: 'Faruq Rahman',
    ownerPhone: '+880 1712-556633',
  },
  {
    id: 12,
    type: 'Flat',
    title: '2BHK Family Flat in Khilgaon',
    rent: 12000,
    rentText: '৳12,000/month',
    location: 'Khilgaon',
    coordinates: [23.7487, 90.4234],
    details: '2 Beds, 2 Baths, 24/7 Water & Security',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&q=80',
    available: true,
    dateAdded: '2026-06-18',
    ownerName: 'Sultan Mahmud',
    ownerPhone: '+880 1814-667788',
  }
];

// Helper to calculate distance using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

// Dynamically import map component so leaflet window object doesn't break SSR
const DynamicMap = dynamic(() => import('@/components/rentals/RentalMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] lg:h-[calc(100vh-220px)] flex items-center justify-center bg-gray-100 rounded-[32px] animate-pulse">
      <div className="flex flex-col items-center gap-2 text-gray-400">
        <MapPin className="w-8 h-8 animate-bounce text-primary" />
        <span className="font-bold text-sm">Loading Google Maps...</span>
      </div>
    </div>
  )
});

export default function RentalsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<[number, number]>([23.8103, 90.4125]); // Dhaka Center
  const [locationName, setLocationName] = useState('Dhaka Center');
  
  const [radius, setRadius] = useState(5); // Default radius 5km
  const [sortOption, setSortOption] = useState<'nearest' | 'cheapest' | 'newest'>('nearest');
  const [searchAsMove, setSearchAsMove] = useState(true);
  
  const [highlightedPropertyId, setHighlightedPropertyId] = useState<number | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Auto-complete suggestion items based on search input
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return NEIGHBORHOODS.filter(n => 
      n.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Filter properties based on current selected center and radius (supporting auto-expansion)
  const { filteredProperties, expandedRadius } = useMemo(() => {
    // Add distance metadata to mock properties
    const withDistance = mockProperties.map(p => {
      const dist = calculateDistance(
        selectedCenter[0],
        selectedCenter[1],
        p.coordinates[0],
        p.coordinates[1]
      );
      return { ...p, distance: dist };
    });

    let currentRadius = radius;
    let filtered = withDistance.filter(p => p.distance <= currentRadius);
    let autoExpanded: number | null = null;

    // Expand search area programmatically if no results are found in the initial radius
    if (filtered.length === 0 && withDistance.length > 0) {
      const sortedByDistance = [...withDistance].sort((a, b) => a.distance - b.distance);
      const closest = sortedByDistance[0];
      autoExpanded = Math.ceil(closest.distance);
      filtered = withDistance.filter(p => p.distance <= autoExpanded!);
    }

    return { filteredProperties: filtered, expandedRadius: autoExpanded };
  }, [selectedCenter, radius]);

  // Sort filtered properties
  const sortedProperties = useMemo(() => {
    const list = [...filteredProperties];
    if (sortOption === 'nearest') {
      return list.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    } else if (sortOption === 'cheapest') {
      return list.sort((a, b) => a.rent - b.rent);
    } else if (sortOption === 'newest') {
      return list.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    }
    return list;
  }, [filteredProperties, sortOption]);

  const handleSearchInputChange = (val: string) => {
    setSearchQuery(val);
    setShowSuggestions(true);
  };

  const handleSelectSuggestion = (s: typeof NEIGHBORHOODS[0]) => {
    setSelectedCenter(s.coordinates);
    setLocationName(s.name);
    setSearchQuery(s.name);
    setShowSuggestions(false);
    toast.success(`Search center set to ${s.name}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const matched = NEIGHBORHOODS.find(n => n.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (matched) {
      handleSelectSuggestion(matched);
    } else {
      toast(`Searching for "${searchQuery}"...`);
      // Fallback geocoding simulator: slightly offset from Dhaka center
      const latOffset = (Math.random() - 0.5) * 0.04;
      const lngOffset = (Math.random() - 0.5) * 0.04;
      const simulatedCoords: [number, number] = [
        23.8103 + latOffset,
        90.4125 + lngOffset
      ];
      setSelectedCenter(simulatedCoords);
      setLocationName(searchQuery);
      toast.success(`Search center updated for "${searchQuery}"`);
    }
    setShowSuggestions(false);
  };

  const handleGetCurrentLocation = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      toast('Fetching your current coordinates...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedCenter([latitude, longitude]);
          setLocationName('My GPS Location');
          setSearchQuery('My GPS Location');
          toast.success('Successfully set to current GPS location!');
        },
        (error) => {
          console.error(error);
          toast.error('Failed to get GPS location. Defaulting to Dhaka Center.');
          setSelectedCenter([23.8103, 90.4125]);
          setLocationName('Dhaka Center');
          setSearchQuery('');
        }
      );
    } else {
      toast.error('GPS is not supported by your browser.');
    }
  };

  const handleGetRandomLocation = () => {
    const randomIndex = Math.floor(Math.random() * NEIGHBORHOODS.length);
    const randomPlace = NEIGHBORHOODS[randomIndex];
    const latOffset = (Math.random() - 0.5) * 0.008;
    const lngOffset = (Math.random() - 0.5) * 0.008;
    const randomCoords: [number, number] = [
      randomPlace.coordinates[0] + latOffset,
      randomPlace.coordinates[1] + lngOffset
    ];

    setSelectedCenter(randomCoords);
    setLocationName(`${randomPlace.name} (Random Area)`);
    setSearchQuery(`${randomPlace.name} (Random)`);
    toast.success(`Set location to random area in ${randomPlace.name}`);
  };

  const handleMapMove = (lat: number, lng: number) => {
    setSelectedCenter([lat, lng]);
    setLocationName('Map Center');
    setSearchQuery('');
  };

  const handleOpenDetails = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleHighlightOnMap = (property: Property) => {
    setSelectedCenter(property.coordinates);
    setHighlightedPropertyId(property.id);
    setSelectedProperty(null);
    toast.success(`Map centered and pin highlighted for "${property.title}"`);
  };

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setShowSuggestions(false);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('click', handleOutsideClick);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('click', handleOutsideClick);
      }
    };
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold font-display text-foreground tracking-tight flex items-center gap-2">
            <Home className="h-8 w-8 text-primary" /> Room Rentals
          </h2>
          <p className="text-muted-foreground font-medium mt-1">Find houses and rooms to rent.</p>
        </div>
      </div>

      {/* Interactive Controls Box */}
      <div className="bg-background shadow-extruded border-none rounded-[32px] p-6 space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6" onClick={(e) => e.stopPropagation()}>
          
          {/* 1. Location Selection Input */}
          <div className="relative">
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Search Location manually</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search neighborhood (e.g. Gulshan...)"
                value={searchQuery}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white rounded-xl text-black border-slate-200 focus:ring-primary focus:border-transparent text-sm w-full font-medium"
              />
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-[9999] top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden py-1 max-h-48 overflow-y-auto no-scrollbar">
                {suggestions.map((s) => (
                  <li key={s.name}>
                    <button
                      type="button"
                      onClick={() => handleSelectSuggestion(s)}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm font-semibold text-black transition-colors"
                    >
                      {s.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 2. Geolocation/Random Actions */}
          <div className="flex flex-col">
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">GPS / Random Bounds</label>
            <div className="grid grid-cols-2 gap-2 flex-1">
              <Button
                type="button"
                onClick={handleGetCurrentLocation}
                variant="outline"
                className="flex items-center justify-center gap-1.5 text-xs font-bold rounded-xl border-slate-200 hover:border-black text-black h-10 shadow-extruded transition-transform hover:-translate-y-[1px]"
              >
                <Navigation className="w-3.5 h-3.5 text-primary" />
                My Location
              </Button>
              <Button
                type="button"
                onClick={handleGetRandomLocation}
                variant="outline"
                className="flex items-center justify-center gap-1.5 text-xs font-bold rounded-xl border-slate-200 hover:border-black text-black h-10 shadow-extruded transition-transform hover:-translate-y-[1px]"
              >
                <Shuffle className="w-3.5 h-3.5 text-slate-500" />
                Random Area
              </Button>
            </div>
          </div>

          {/* 3. Radius & Sort Options */}
          <div className="flex flex-col">
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Sort & Info</label>
            <div className="grid grid-cols-2 gap-2 flex-1">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-black focus:outline-none focus:ring-1 focus:ring-primary shadow-extruded h-10"
              >
                <option value="nearest">Nearest First</option>
                <option value="cheapest">Cheapest First</option>
                <option value="newest">Newly Added</option>
              </select>
              
              <div className="flex items-center justify-between border border-slate-200 rounded-xl px-3 bg-white h-10 shadow-extruded font-display">
                <span className="text-xs font-bold text-slate-500">Radius:</span>
                <span className="text-xs font-black text-primary">{radius} km</span>
              </div>
            </div>
          </div>

        </form>

        {/* Range Slider & Drag checkbox */}
        <div className="pt-2 flex flex-col md:flex-row items-center gap-6 border-t border-slate-100/50">
          <div className="flex-1 w-full flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400">1km</span>
            <input
              type="range"
              min="1"
              max="15"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
            />
            <span className="text-xs font-semibold text-slate-400">15km</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <input
              type="checkbox"
              id="searchAsMoveCheckbox"
              checked={searchAsMove}
              onChange={(e) => setSearchAsMove(e.target.checked)}
              className="rounded text-primary border-slate-300 focus:ring-primary h-4 w-4"
            />
            <label htmlFor="searchAsMoveCheckbox" className="text-xs font-bold text-slate-600 cursor-pointer">
              Search as map moves
            </label>
          </div>
        </div>

      </div>

      {/* Main Content Split Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Listings List */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          
          {/* Expanded radius message */}
          {expandedRadius && (
            <div className="bg-amber-50/70 border border-amber-200/50 rounded-[24px] p-4 flex items-start gap-3 text-amber-800 text-sm animate-in slide-in-from-top-2 duration-300">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold block text-sm">Expanding search area for more rentals…</span>
                <p className="text-xs text-amber-700/90 mt-1 font-semibold leading-relaxed">
                  No properties were found within your chosen {radius}km radius. We've automatically expanded the search to <span className="font-black">{expandedRadius}km</span> to show you the closest available listings.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center px-1">
            <p className="text-sm font-bold text-slate-500">
              Found <span className="text-black font-black">{sortedProperties.length}</span> {sortedProperties.length === 1 ? 'rental' : 'rentals'} near <span className="text-black font-black">{locationName}</span>
            </p>
          </div>

          {sortedProperties.length === 0 ? (
            <div className="bg-white rounded-[32px] p-12 text-center border border-slate-200/50 shadow-soft flex flex-col items-center justify-center min-h-[300px]">
              <Home className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="text-lg font-bold text-slate-700">No properties found</h3>
              <p className="text-sm text-slate-400 max-w-xs mt-1">Try selecting another location, increasing search radius, or clearing search criteria.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {sortedProperties.map(property => {
                const isHighlighted = highlightedPropertyId === property.id;
                return (
                  <Card
                    key={property.id}
                    onMouseEnter={() => setHighlightedPropertyId(property.id)}
                    onMouseLeave={() => setHighlightedPropertyId(null)}
                    onClick={() => handleOpenDetails(property)}
                    className={`bg-background border-none rounded-[32px] overflow-hidden transition-all duration-300 flex flex-col cursor-pointer ${
                      isHighlighted
                        ? 'shadow-extruded-hover translate-y-[-4px] ring-2 ring-primary/30'
                        : 'shadow-extruded hover:-translate-y-1'
                    }`}
                  >
                    <div className="h-48 w-full shrink-0 relative overflow-hidden bg-slate-50">
                      <img 
                        src={property.image} 
                        alt={property.title} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                      />
                      <div className="absolute top-4 right-4">
                        <span className={`text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-md ${
                          property.available 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}>
                          {property.available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </div>
                    <CardHeader className="p-6 pb-2">
                      <span className="text-[10px] font-extrabold text-primary mb-1 block uppercase tracking-wider">{property.type}</span>
                      <h3 className="font-bold text-2xl font-display text-black">{property.rentText}</h3>
                    </CardHeader>
                    <CardContent className="p-6 pt-4 mt-auto flex flex-col flex-grow">
                      <h4 className="font-bold text-base text-slate-800 line-clamp-1 mb-3">{property.title}</h4>
                      <div className="space-y-2 mb-6 text-xs font-semibold text-slate-500 flex-grow">
                        <div className="flex items-center gap-2 text-slate-700">
                          <MapPin className="h-3.5 w-3.5 text-primary" /> {property.location}
                          {property.distance !== undefined && (
                            <span className="text-slate-400 font-medium">({property.distance.toFixed(1)} km away)</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">{property.details}</div>
                      </div>
                      <Button className="w-full shadow-extruded rounded-full py-5 text-xs font-bold transition-all bg-black text-white hover:bg-slate-800">
                        View & Contact
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

        </div>

        {/* Right Column: Sticky Leaflet Map */}
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6 w-full">
          <div className="bg-background p-2 rounded-[36px] shadow-inset-deep">
            <DynamicMap
              properties={filteredProperties}
              center={selectedCenter}
              highlightedPropertyId={highlightedPropertyId}
              onMarkerClick={handleOpenDetails}
              onMapMove={handleMapMove}
              searchAsMove={searchAsMove}
            />
          </div>
        </div>

      </div>

      {/* Property Details Dialog Modal */}
      <Dialog open={!!selectedProperty} onOpenChange={(open) => !open && setSelectedProperty(null)}>
        {selectedProperty && (
          <DialogContent className="max-w-md rounded-[32px] overflow-hidden p-0 border-none bg-white shadow-2xl animate-in zoom-in-95 duration-200" showCloseButton={true}>
            <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
              <img 
                src={selectedProperty.image} 
                alt={selectedProperty.title} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-4 right-4">
                <span className={`text-xs font-extrabold px-3 py-1.5 rounded-full shadow-md ${
                  selectedProperty.available 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {selectedProperty.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
            
            <div className="p-6 space-y-4 text-black">
              <div>
                <span className="text-[10px] font-extrabold text-primary block uppercase tracking-wider mb-1">
                  {selectedProperty.type}
                </span>
                <DialogTitle className="text-xl font-bold font-display text-black leading-snug">
                  {selectedProperty.title}
                </DialogTitle>
                <div className="text-2xl font-black text-black mt-2 font-display">
                  {selectedProperty.rentText}
                </div>
              </div>

              <div className="space-y-2.5 text-xs font-semibold text-slate-600 border-t border-b border-slate-100 py-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-slate-800">{selectedProperty.location}</span>
                  {selectedProperty.distance !== undefined && (
                    <span className="text-slate-400 font-medium">({selectedProperty.distance.toFixed(2)} km away)</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Home className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-slate-700">{selectedProperty.details}</span>
                </div>
              </div>

              {/* Owner details card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Owner Contact Info</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-black text-sm">{selectedProperty.ownerName}</p>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">{selectedProperty.ownerPhone}</p>
                  </div>
                  <a 
                    href={`tel:${selectedProperty.ownerPhone.replace(/\s+/g, '')}`}
                    className="bg-black text-white hover:bg-slate-800 p-2.5 rounded-xl transition-colors shadow-sm"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button 
                  onClick={() => handleHighlightOnMap(selectedProperty)}
                  variant="outline" 
                  className="rounded-full shadow-extruded py-5 border-slate-200 text-black hover:border-black font-extrabold text-xs"
                >
                  <Map className="w-3.5 h-3.5 mr-1 text-primary" />
                  View on Map
                </Button>
                <a 
                  href={`tel:${selectedProperty.ownerPhone.replace(/\s+/g, '')}`}
                  className="bg-primary text-white hover:bg-primary/95 flex items-center justify-center rounded-full shadow-extruded font-extrabold text-xs transition-colors"
                >
                  Contact Owner
                </a>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

    </div>
  );
}
