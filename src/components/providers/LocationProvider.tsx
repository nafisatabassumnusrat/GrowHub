'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type LocationState = {
  division: string | null;
  district: string | null;
  upazila: string | null;
};

type LocationContextType = {
  location: LocationState;
  setLocation: (division: string, district: string, upazila: string) => void;
  clearLocation: () => void;
  isLocationSet: boolean;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocationState] = useState<LocationState>({
    division: null,
    district: null,
    upazila: null,
  });
  
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('growhub_location');
    if (saved) {
      try {
        setLocationState(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved location', e);
      }
    }
    setIsLoaded(true);
  }, []);

  const setLocation = (division: string, district: string, upazila: string) => {
    const newLocation = { division, district, upazila };
    setLocationState(newLocation);
    localStorage.setItem('growhub_location', JSON.stringify(newLocation));
  };

  const clearLocation = () => {
    setLocationState({ division: null, district: null, upazila: null });
    localStorage.removeItem('growhub_location');
  };

  const isLocationSet = Boolean(location.division && location.district && location.upazila);

  // Prevent hydration mismatch by not rendering children until loaded, or just passing nulls initially
  if (!isLoaded) return null;

  return (
    <LocationContext.Provider value={{ location, setLocation, clearLocation, isLocationSet }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
