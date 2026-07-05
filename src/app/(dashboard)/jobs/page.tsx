'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { MOCK_TUTORS } from '@/lib/mock-data';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Briefcase, Globe, RefreshCw, ArrowUpDown, Clock, Search, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';

// Dynamically import the JobMap component
const DynamicJobMap = dynamic(() => import('@/components/jobs/JobMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[350px] lg:h-[400px] flex items-center justify-center bg-gray-100 rounded-[32px] animate-pulse">
      <div className="flex flex-col items-center gap-2 text-gray-400">
        <MapPin className="w-8 h-8 animate-bounce text-primary" />
        <span className="font-bold text-sm">Loading Google Maps...</span>
      </div>
    </div>
  )
});

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  country?: string;
  city?: string;
  mode: 'remote' | 'offline' | 'hybrid';
  hybridType?: string;
  type: string;
  salary: string;
  url: string;
  dateAdded: string;
  popularity: number;
}

export default function JobsPage() {
  const [activeMode, setActiveMode] = useState<'remote' | 'offline' | 'hybrid' | null>(null);
  
  // Selections
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [hybridType, setHybridType] = useState<string>('');
  
  // Search & Sort & Meta
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<'recency' | 'relevance' | 'popularity'>('recency');
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(180); // 3 minutes refresh timer

  // Debounce search query changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch jobs API handler
  const fetchJobs = useCallback(async (isSilent = false) => {
    if (!activeMode) return;
    if (!isSilent) setLoading(true);
    
    try {
      const url = new URL('/api/jobs', window.location.origin);
      url.searchParams.set('mode', activeMode);
      if (selectedCountry && activeMode === 'remote') {
        url.searchParams.set('country', selectedCountry);
      }
      if (selectedCity && activeMode === 'offline') {
        url.searchParams.set('city', selectedCity);
      }
      if (hybridType && activeMode === 'hybrid') {
        url.searchParams.set('hybridType', hybridType);
      }
      if (debouncedSearchQuery) {
        url.searchParams.set('q', debouncedSearchQuery);
      }

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
        if (isSilent) {
          toast.success('Live job feed auto-refreshed!');
        }
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      toast.error('Failed to connect to job crawler service');
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, [activeMode, selectedCountry, selectedCity, hybridType, debouncedSearchQuery]);

  // Trigger fetch when active settings change
  useEffect(() => {
    fetchJobs();
    setCountdown(180); // reset timer
  }, [activeMode, selectedCountry, selectedCity, hybridType, debouncedSearchQuery, fetchJobs]);

  // Live Auto-Refresh Timer
  useEffect(() => {
    if (!activeMode) return;
    
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          fetchJobs(true); // silent fetch on timer finish
          return 180;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeMode, fetchJobs]);

  // Rank jobs based on Recency, Relevance, or Popularity
  const sortedJobs = useMemo(() => {
    const list = [...jobs];
    if (sortOption === 'recency') {
      return list.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    } else if (sortOption === 'popularity') {
      return list.sort((a, b) => b.popularity - a.popularity);
    } else if (sortOption === 'relevance') {
      if (!debouncedSearchQuery.trim()) return list;
      const q = debouncedSearchQuery.toLowerCase();
      return list.sort((a, b) => {
        const aTitleMatch = a.title.toLowerCase().startsWith(q) ? 2 : a.title.toLowerCase().includes(q) ? 1 : 0;
        const bTitleMatch = b.title.toLowerCase().startsWith(q) ? 2 : b.title.toLowerCase().includes(q) ? 1 : 0;
        return bTitleMatch - aTitleMatch;
      });
    }
    return list;
  }, [jobs, sortOption, debouncedSearchQuery]);

  const handleSelectCountry = (country: string) => {
    setSelectedCountry(country === selectedCountry ? '' : country);
  };

  const handleSelectCity = (city: string) => {
    setSelectedCity(city === selectedCity ? '' : city);
  };

  const formatCountdown = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}m ${remainder < 10 ? '0' : ''}${remainder}s`;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500">
      
      {/* Title Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black font-display tracking-tight text-black">Jobs & Tutors</h1>
        <p className="text-gray-500 font-medium text-lg">Local employment opportunities and private tutors in your area.</p>
      </div>

      {/* Real-Time Job Discovery Panel */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold font-display border-b border-gray-200 pb-2 flex items-center justify-between text-black">
          <span>AI Global Job Discovery</span>
          {activeMode && (
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5 font-sans">
              <RefreshCw className="w-3 h-3 animate-spin text-primary" />
              Auto-refreshing in: <span className="font-extrabold text-primary font-display">{formatCountdown(countdown)}</span>
            </span>
          )}
        </h2>

        {/* 1. Job Type Modes Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              setActiveMode('remote');
              setSelectedCountry('');
              setSelectedCity('');
              setHybridType('');
            }}
            className={`flex flex-col items-center justify-center p-6 rounded-[24px] border-2 transition-all shadow-extruded hover:-translate-y-0.5 ${
              activeMode === 'remote'
                ? 'border-primary bg-primary/5 text-black shadow-inset-deep'
                : 'border-slate-200 bg-white hover:border-black text-slate-700'
            }`}
          >
            <Globe className="w-8 h-8 mb-2 text-primary" />
            <span className="font-bold text-lg font-display">Remote Jobs</span>
            <span className="text-xs text-slate-400 font-medium mt-1">Global remote opportunities</span>
          </button>

          <button
            onClick={() => {
              setActiveMode('offline');
              setSelectedCountry('');
              setSelectedCity('');
              setHybridType('');
            }}
            className={`flex flex-col items-center justify-center p-6 rounded-[24px] border-2 transition-all shadow-extruded hover:-translate-y-0.5 ${
              activeMode === 'offline'
                ? 'border-primary bg-primary/5 text-black shadow-inset-deep'
                : 'border-slate-200 bg-white hover:border-black text-slate-700'
            }`}
          >
            <Briefcase className="w-8 h-8 mb-2 text-blue-500" />
            <span className="font-bold text-lg font-display">Offline Jobs</span>
            <span className="text-xs text-slate-400 font-medium mt-1">On-site local BD listings</span>
          </button>

          <button
            onClick={() => {
              setActiveMode('hybrid');
              setSelectedCountry('');
              setSelectedCity('');
              setHybridType('');
            }}
            className={`flex flex-col items-center justify-center p-6 rounded-[24px] border-2 transition-all shadow-extruded hover:-translate-y-0.5 ${
              activeMode === 'hybrid'
                ? 'border-primary bg-primary/5 text-black shadow-inset-deep'
                : 'border-slate-200 bg-white hover:border-black text-slate-700'
            }`}
          >
            <RefreshCw className="w-8 h-8 mb-2 text-orange-500" />
            <span className="font-bold text-lg font-display">Hybrid Jobs</span>
            <span className="text-xs text-slate-400 font-medium mt-1">Mixed remote + office locations</span>
          </button>
        </div>

        {/* Placeholder if no mode is active */}
        {!activeMode ? (
          <div className="bg-slate-50 border border-slate-200/50 rounded-[32px] p-12 text-center flex flex-col items-center justify-center shadow-inset-deep min-h-[250px]">
            <Briefcase className="w-12 h-12 text-slate-300 mb-3" />
            <h3 className="text-lg font-bold text-slate-700">Explore Opportunities</h3>
            <p className="text-sm text-slate-400 max-w-sm mt-1">Please select one of the job modes above (Remote, Offline, or Hybrid) to begin fetching real-time, location-aware listings.</p>
          </div>
        ) : (
          /* Active Jobs Finder System */
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Filter controls and Search */}
            <div className="bg-background shadow-extruded border-none rounded-[32px] p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                
                {/* Text Search Input */}
                <div className="md:col-span-5 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search by role, company, or tech..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white rounded-xl text-black border-slate-200 focus:ring-primary focus:border-transparent text-sm w-full font-medium"
                  />
                </div>

                {/* Mode Sub-Filters */}
                <div className="md:col-span-4 flex flex-wrap gap-2">
                  {activeMode === 'remote' && (
                    <div className="flex flex-wrap gap-1.5">
                      {['USA', 'UK', 'Canada', 'Germany', 'UAE'].map(c => (
                        <button
                          key={c}
                          onClick={() => handleSelectCountry(c)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                            selectedCountry === c
                              ? 'bg-primary text-white border-primary shadow-sm'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-black'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}

                  {activeMode === 'offline' && (
                    <div className="flex flex-wrap gap-1.5">
                      {['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna'].map(city => (
                        <button
                          key={city}
                          onClick={() => handleSelectCity(city)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                            selectedCity === city
                              ? 'bg-primary text-white border-primary shadow-sm'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-black'
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  )}

                  {activeMode === 'hybrid' && (
                    <div className="flex gap-1.5 w-full">
                      <select
                        value={hybridType}
                        onChange={(e) => setHybridType(e.target.value)}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary w-full"
                      >
                        <option value="">All Hybrid Sub-types</option>
                        <option value="mostly_remote">Mostly Remote</option>
                        <option value="mostly_office">Mostly Office-based</option>
                        <option value="flexible">Flexible Hybrid</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Sort Option Dropdown */}
                <div className="md:col-span-3">
                  <div className="relative flex items-center">
                    <ArrowUpDown className="absolute left-3 w-4 h-4 text-slate-400" />
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value as any)}
                      className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-black focus:outline-none focus:ring-1 focus:ring-primary w-full shadow-extruded h-10"
                    >
                      <option value="recency">Rank by Recency</option>
                      <option value="relevance">Rank by Relevance</option>
                      <option value="popularity">Rank by Popularity</option>
                    </select>
                  </div>
                </div>

              </div>
            </div>

            {/* Split Map + Listings Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Listings List */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-6 order-2 lg:order-1">
                
                {/* Result header */}
                <div className="flex justify-between items-center px-1">
                  <p className="text-sm font-bold text-slate-500">
                    Live crawled: <span className="text-black font-black">{sortedJobs.length}</span> postings found
                  </p>
                </div>

                {loading ? (
                  <div className="space-y-6">
                    {[1, 2].map(n => (
                      <div key={n} className="bg-white border border-slate-100 rounded-2xl p-6 animate-pulse flex flex-col gap-4">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                            <div className="h-3 bg-slate-100 rounded w-1/4"></div>
                          </div>
                        </div>
                        <div className="h-10 bg-slate-50 rounded-[32px] w-full"></div>
                      </div>
                    ))}
                  </div>
                ) : sortedJobs.length === 0 ? (
                  <div className="bg-white rounded-[32px] p-12 text-center border border-slate-200/50 shadow-soft flex flex-col items-center justify-center min-h-[250px]">
                    <Search className="w-10 h-10 text-slate-300 mb-2" />
                    <h4 className="font-bold text-slate-700">No matching jobs</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs">There are no crawled positions matching your filter criteria. Try resetting the filters or modifying your search.</p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {sortedJobs.map((job) => {
                      const isHighUrgency = new Date().getTime() - new Date(job.dateAdded).getTime() < 3600000 * 3; // within 3 hours
                      
                      return (
                        <div 
                          key={job.id} 
                          className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-black hover:shadow-soft transition-all flex flex-col cursor-pointer"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex gap-4 items-start">
                              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center bg-slate-50 text-slate-500 font-extrabold text-sm uppercase">
                                {job.company.charAt(0)}
                              </div>
                              <div>
                                <h3 className="font-bold text-xl leading-tight text-slate-900">{job.title}</h3>
                                <p className="text-gray-600 font-semibold text-sm mt-1">{job.company}</p>
                              </div>
                            </div>
                            <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-md shrink-0 uppercase tracking-wide ${
                              isHighUrgency ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {isHighUrgency ? 'Immediate' : 'Active'}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-500 mb-6 mt-4">
                            <div className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> {job.type}</div>
                            <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.location}</div>
                            <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                              <Clock className="w-3.5 h-3.5" /> {
                                Math.floor((new Date().getTime() - new Date(job.dateAdded).getTime()) / 60000) < 60
                                  ? `${Math.floor((new Date().getTime() - new Date(job.dateAdded).getTime()) / 60000)} mins ago`
                                  : `${Math.floor((new Date().getTime() - new Date(job.dateAdded).getTime()) / 3600000)} hours ago`
                              }
                            </div>
                          </div>

                          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                            <div className="font-black text-lg text-black font-display">{job.salary}</div>
                            <a 
                              href={job.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-5 py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
                            >
                              Apply Now
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>

              {/* Sticky Map Column */}
              <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6 w-full order-1 lg:order-2">
                <div className="bg-background p-2 rounded-[36px] shadow-inset-deep">
                  <DynamicJobMap
                    mode={activeMode}
                    selectedCountry={selectedCountry}
                    selectedCity={selectedCity}
                    onSelectCountry={handleSelectCountry}
                    onSelectCity={handleSelectCity}
                    jobs={jobs}
                  />
                </div>
              </div>

            </div>

          </div>
        )}

      </section>

      {/* Private Tutors Section (KEPT EXACTLY UNCHANGED) */}
      <section>
        <h2 className="text-2xl font-bold font-display mb-6 border-b border-gray-200 pb-2 text-black">Private Tutors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_TUTORS.map(tutor => (
            <div key={tutor.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-black hover:shadow-soft transition-all flex flex-col cursor-pointer text-black">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full overflow-hidden shrink-0 border border-gray-100">
                  <img src={tutor.image} alt={tutor.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">{tutor.name}</h3>
                  <p className="text-sm font-semibold text-gray-500">{tutor.edu}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="text-sm font-bold bg-gray-50 p-2 rounded-lg text-center border border-gray-100">
                  {tutor.subject}
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-black text-black">{tutor.rate}</span>
                  <div className="flex items-center gap-1 text-xs text-gray-500 font-medium mt-1">
                    <MapPin className="w-3 h-3" /> {tutor.location}
                  </div>
                </div>
                <button className="px-4 py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors">
                  Contact
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
