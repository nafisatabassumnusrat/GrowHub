'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from '@/components/providers/LocationProvider';
import { MapPin, ChevronDown, Search, Check, X } from 'lucide-react';
import { allDivision, districtsOf, upazilaNamesOf } from 'bd-geo-address';

type UpazilaSwitcherProps = {
  triggerClassName?: string;
  isCompact?: boolean;
};

export default function UpazilaSwitcher({ triggerClassName = "", isCompact = false }: UpazilaSwitcherProps) {
  const { location, setLocation, isLocationSet } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const [divisions, setDivisions] = useState<string[]>([]);
  const [selectedDiv, setSelectedDiv] = useState<string | null>(location.division);
  
  const [districts, setDistricts] = useState<string[]>([]);
  const [selectedDist, setSelectedDist] = useState<string | null>(location.district);
  
  const [upazilas, setUpazilas] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load divisions on mount
  useEffect(() => {
    try {
      setDivisions(allDivision());
    } catch (e) {
      console.error("Error loading divisions", e);
    }
  }, []);

  // Update districts when division changes
  useEffect(() => {
    if (selectedDiv) {
      try {
        setDistricts(districtsOf(selectedDiv));
      } catch (e) {
        console.error("Error loading districts", e);
        setDistricts([]);
      }
    } else {
      setDistricts([]);
      setUpazilas([]);
    }
  }, [selectedDiv]);

  // Update upazilas when district changes
  useEffect(() => {
    if (selectedDist) {
      try {
        setUpazilas(upazilaNamesOf(selectedDist));
      } catch (e) {
        console.error("Error loading upazilas", e);
        setUpazilas([]);
      }
    } else {
      setUpazilas([]);
    }
  }, [selectedDist]);

  const handleSave = (upazila: string) => {
    if (selectedDiv && selectedDist) {
      setLocation(selectedDiv, selectedDist, upazila);
      setIsOpen(false);
    }
  };

  const filteredUpazilas = upazilas.filter(u => u.toLowerCase().includes(searchQuery.toLowerCase()));

  const displayText = isLocationSet 
    ? `${location.upazila}, ${location.district}` 
    : 'Select Upazila';

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all text-sm font-semibold text-black ${triggerClassName}`}
      >
        <MapPin className="w-4 h-4 text-gray-500" />
        {!isCompact && <span>{displayText}</span>}
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
              <h2 className="text-xl font-bold font-display text-black">Set Your Location</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 overflow-y-auto bg-gray-50">
              
              {/* Step 1: Division */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">1. Select Division</label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {divisions.map(div => (
                    <button
                      key={div}
                      onClick={() => {
                        setSelectedDiv(div);
                        setSelectedDist(null);
                        setSearchQuery('');
                      }}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                        selectedDiv === div 
                          ? 'bg-black text-white border-black' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {div}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: District */}
              {selectedDiv && districts.length > 0 && (
                <div className="mb-6 animate-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-bold text-gray-700 mb-2">2. Select District</label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {districts.map(dist => (
                      <button
                        key={dist}
                        onClick={() => {
                          setSelectedDist(dist);
                          setSearchQuery('');
                        }}
                        className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                          selectedDist === dist 
                            ? 'bg-black text-white border-black' 
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {dist}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Upazila */}
              {selectedDist && upazilas.length > 0 && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-bold text-gray-700 mb-2">3. Select Upazila (Your Hyperlocal Area)</label>
                  
                  {/* Search */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search upazilas..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow text-black"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2 pb-2">
                    {filteredUpazilas.length === 0 ? (
                      <p className="text-sm text-gray-500 col-span-2 py-4 text-center">No upazilas found.</p>
                    ) : (
                      filteredUpazilas.map(upz => (
                        <button
                          key={upz}
                          onClick={() => handleSave(upz)}
                          className={`flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-xl border transition-all ${
                            location.upazila === upz 
                              ? 'bg-black text-white border-black shadow-md' 
                              : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:shadow-sm'
                          }`}
                        >
                          {upz}
                          {location.upazila === upz && <Check className="w-4 h-4" />}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
