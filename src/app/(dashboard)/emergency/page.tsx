'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, Clock, PhoneCall, ShieldCheck, Heart, User, MapPin, RefreshCw, Send, Settings, UserCheck, CheckCircle, Search, HelpCircle, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { MapEmergency, MapHospital, MapAmbulance } from '@/components/emergency/EmergencyMap';

// Dynamically import Leaflet EmergencyMap to prevent SSR compilation errors
const DynamicEmergencyMap = dynamic(() => import('@/components/emergency/EmergencyMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] lg:h-[calc(100vh-220px)] flex items-center justify-center bg-red-50 rounded-[32px] animate-pulse">
      <div className="flex flex-col items-center gap-2 text-red-400">
        <AlertTriangle className="w-8 h-8 animate-bounce" />
        <span className="font-bold text-sm">Loading Emergency GPS Map...</span>
      </div>
    </div>
  )
});

// Blood Group Compatibility Matrix
const BLOOD_COMPATIBILITY: { [key: string]: string[] } = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  'AB-': ['A-', 'B-', 'AB-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-']
};

// Mock Donors
const MOCK_DONORS = [
  { name: 'Kazi Rayhan', bloodGroup: 'O+', distance: 1.2, available: true, contact: '01711-223344' },
  { name: 'Nishat Jahan', bloodGroup: 'O+', distance: 2.8, available: true, contact: '01812-334455' },
  { name: 'Ariful Islam', bloodGroup: 'O-', distance: 3.5, available: true, contact: '01913-445566' },
  { name: 'Mehedi Hasan', bloodGroup: 'A+', distance: 1.5, available: false, contact: '01514-556677' },
  { name: 'Sadia Sultana', bloodGroup: 'B+', distance: 2.1, available: true, contact: '01615-667788' },
  { name: 'Rakibul Islam', bloodGroup: 'AB+', distance: 4.2, available: true, contact: '01716-778899' },
  { name: 'Fatema Tuz Zohra', bloodGroup: 'O+', distance: 0.9, available: true, contact: '01817-889900' },
  { name: 'Tanvir Rahman', bloodGroup: 'A-', distance: 5.1, available: true, contact: '01918-990011' },
  { name: 'Jannatul Ferdous', bloodGroup: 'O+', distance: 4.8, available: true, contact: '01519-001122' }
];

// NLP AI Triage Severity Classifier
function triageText(text: string) {
  const t = text.toLowerCase();
  if (
    t.includes('accident') || t.includes('stroke') || t.includes('heart attack') ||
    t.includes('unconscious') || t.includes('dying') || t.includes('bleeding out') ||
    t.includes('cardiac') || t.includes('severe chest') || t.includes('choking') ||
    t.includes('fire') || t.includes('natural disaster') || t.includes('explosion')
  ) {
    return { priority: '🟥 Life Threatening', desc: '0–10 min response required' };
  }
  if (
    t.includes('severe') || t.includes('fracture') || t.includes('broken') ||
    t.includes('ambulance') || t.includes('burn') || t.includes('blood required') ||
    t.includes('urgent') || t.includes('hospital') || t.includes('critical')
  ) {
    return { priority: '🟧 Critical', desc: '10–30 min response' };
  }
  if (
    t.includes('fever') || t.includes('missing') || t.includes('pain') ||
    t.includes('police') || t.includes('stolen') || t.includes('lost') ||
    t.includes('assistance')
  ) {
    return { priority: '🟨 Urgent', desc: '30–120 min response' };
  }
  return { priority: '🟩 Normal Assistance', desc: 'Routine community support' };
}

// AI Summarizer Parser
function summarizeEmergencyText(text: string) {
  const t = text.toLowerCase();
  
  let category = 'Medical';
  if (t.includes('blood')) category = 'Blood Request';
  else if (t.includes('ambulance')) category = 'Ambulance';
  else if (t.includes('accident') || t.includes('crash')) category = 'Accident';
  else if (t.includes('missing') || t.includes('child') || t.includes('lost')) category = 'Missing Person';
  else if (t.includes('fire')) category = 'Fire Emergency';
  else if (t.includes('disaster') || t.includes('flood') || t.includes('cyclone')) category = 'Natural Disaster';
  else if (t.includes('police') || t.includes('thief') || t.includes('stolen')) category = 'Police Assistance';
  
  let location = 'Savar, Dhaka';
  const locations = ['savar', 'dhaka', 'chittagong', 'sylhet', 'rajshahi', 'khulna', 'bazar', 'college road', 'mawa', 'dhamrai'];
  for (const loc of locations) {
    if (t.includes(loc)) {
      location = loc.charAt(0).toUpperCase() + loc.slice(1);
      break;
    }
  }
  
  let requirement = 'General Support';
  if (t.includes('blood') && t.includes('ambulance')) {
    const bgMatch = text.match(/\b(A|B|AB|O)[+-]\b/i);
    requirement = `${bgMatch ? bgMatch[0].toUpperCase() : ''} Blood & Ambulance`.trim();
  } else if (t.includes('blood')) {
    const bgMatch = text.match(/\b(A|B|AB|O)[+-]\b/i);
    requirement = `${bgMatch ? bgMatch[0].toUpperCase() : ''} Blood Donor`.trim();
  } else if (t.includes('ambulance')) {
    requirement = 'Emergency Ambulance';
  } else if (t.includes('fire')) {
    requirement = 'Fire Service Dispatch';
  } else if (t.includes('police')) {
    requirement = 'Police Patrol';
  }
  
  const triage = triageText(text);
  
  let suggestedAction = 'Dispatch community volunteer & notify nearest authorities';
  if (triage.priority.includes('Life')) {
    suggestedAction = '🚨 IMMEDIATE: Dispatch ambulance & alert nearest trauma center!';
  } else if (triage.priority.includes('Critical')) {
    suggestedAction = '⚡ URGENT: Dispatch ambulance and coordinate hospital intake.';
  }
  
  return {
    type: category,
    location,
    requirement,
    priority: triage.priority,
    suggestedAction
  };
}

export default function EmergencyPage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'map' | 'blood' | 'ambulance' | 'hospitals' | 'missing' | 'analytics' | 'settings'>('feed');
  
  // Data States
  const [emergencies, setEmergencies] = useState<MapEmergency[]>([
    { id: 1, title: 'O+ Blood Required', category: 'Blood Request', priority: '🟥 Life Threatening', description: 'Urgent: O+ blood needed for an accident patient at Savar Enam Medical.', coordinates: [23.8582, 90.2662], contact: '01711-223344' },
    { id: 2, title: 'Ambulance Needed', category: 'Ambulance', priority: '🟧 Critical', description: 'Need an ambulance to transfer a patient from Dhamrai to Dhaka Med.', coordinates: [23.8322, 90.2211], contact: '01812-334455' },
    { id: 3, title: 'Missing 6-Year-Old Boy', category: 'Missing Person', priority: '🟨 Urgent', description: '6-year-old boy lost near Savar Bazar. Wearing a red shirt, last seen playing near the central market.', coordinates: [23.8612, 90.2711], contact: '01913-445566' }
  ]);

  const [hospitals, setHospitals] = useState<MapHospital[]>([
    { id: 1, name: 'Enam Medical College Hospital', coordinates: [23.8569, 90.2625], beds: '78/150 Available', icu: '4/12 Available', contact: '01711-998877' },
    { id: 2, name: 'Savar Upazila Health Complex', coordinates: [23.8622, 90.2785], beds: '15/50 Available', icu: '0/2 Available', contact: '01812-887766' },
    { id: 3, name: 'Legacy Trauma Center Savar', coordinates: [23.8450, 90.2520], beds: '32/80 Available', icu: '6/10 Available', contact: '01913-776655' }
  ]);

  const [ambulances, setAmbulances] = useState<MapAmbulance[]>([
    { id: 1, name: 'Enam Emergency Care Amb', coordinates: [23.8550, 90.2600], status: 'Available', driver: 'Rahmot Ali', contact: '01711-123456' },
    { id: 2, name: 'Red Crescent Savar Ambulance', coordinates: [23.8650, 90.2750], status: 'Available', driver: 'Shafiqul Islam', contact: '01812-234567' },
    { id: 3, name: 'Al-Madina Cardiac Ambulance', coordinates: [23.8350, 90.2450], status: 'Busy', driver: 'Milon Mia', contact: '01913-345678' }
  ]);

  const [missingPersons, setMissingPersons] = useState([
    { id: 1, name: 'Tanim Ahmed', age: 6, gender: 'Male', lastSeen: 'Savar Bazar Central Mosque', date: '2026-07-04', description: 'Wearing a red t-shirt and blue shorts. Speaks politely, responds to the nickname "Apu".', image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&q=80', contact: '01711-223344' },
    { id: 2, name: 'Sarah Akter', age: 9, gender: 'Female', lastSeen: 'College Road Bus Stand', date: '2026-07-05', description: 'Wearing a pink dress. Hair tied in a ponytail. Has a small mole on her left cheek.', image: 'https://images.unsplash.com/photo-1517677208171-2bc6725a1e60?w=400&q=80', contact: '01812-334455' }
  ]);

  // Broadcast Modal State
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastDesc, setBroadcastDesc] = useState('');
  const [broadcastContact, setBroadcastContact] = useState('');
  const [broadcastCategory, setBroadcastCategory] = useState('Medical');
  const [broadcastRole, setBroadcastRole] = useState<'user' | 'hospital' | 'ngo' | 'volunteer'>('user');

  // AI Moderation Alerts
  const spamWords = ['buy', 'sell', 'spam', 'test', 'advertising', 'promo', 'cash', 'loan'];
  const hasSpamAlert = useMemo(() => {
    const text = (broadcastTitle + ' ' + broadcastDesc).toLowerCase();
    return spamWords.some(word => text.includes(word));
  }, [broadcastTitle, broadcastDesc]);

  // AI Summarizer Preview
  const aiSummary = useMemo(() => {
    if (!broadcastDesc.trim()) return null;
    return summarizeEmergencyText(broadcastDesc);
  }, [broadcastDesc]);

  // Blood Donor Search State
  const [bloodSearchGroup, setBloodSearchGroup] = useState('O+');
  const [bloodSearchRadius, setBloodSearchRadius] = useState(5);
  const [alertedDonors, setAlertedDonors] = useState<number[]>([]);

  // Compatible Donors Filter
  const matchedDonors = useMemo(() => {
    const compatibleGroups = BLOOD_COMPATIBILITY[bloodSearchGroup] || [];
    return MOCK_DONORS.filter(d => 
      compatibleGroups.includes(d.bloodGroup) && 
      d.distance <= bloodSearchRadius
    );
  }, [bloodSearchGroup, bloodSearchRadius]);

  // Ambulance Dispatch State
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState<number | string | null>(null);
  const [activeAmbulanceId, setActiveAmbulanceId] = useState<number | string | null>(null);
  const [dispatchDestination, setDispatchDestination] = useState<[number, number] | null>(null);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);

  // Hospital Alerts Notified State
  const [notifiedHospitals, setNotifiedHospitals] = useState<number[]>([]);

  // Missing Child Poster State
  const [selectedPosterChild, setSelectedPosterChild] = useState<any | null>(null);

  // Map Filter Category
  const [mapCategoryFilter, setMapCategoryFilter] = useState<string>('all');
  const filteredMapEmergencies = useMemo(() => {
    if (mapCategoryFilter === 'all') return emergencies;
    return emergencies.filter(e => e.category.toLowerCase().includes(mapCategoryFilter.toLowerCase()));
  }, [emergencies, mapCategoryFilter]);

  // Smart Notification Prefs
  const [notifRadius, setNotifRadius] = useState(3);
  const [bloodAlertsOn, setBloodAlertsOn] = useState(true);

  // Missing Child Board Form State
  const [isMissingFormOpen, setIsMissingFormOpen] = useState(false);
  const [missingName, setMissingName] = useState('');
  const [missingAge, setMissingAge] = useState('');
  const [missingGender, setMissingGender] = useState('Male');
  const [missingLastSeen, setMissingLastSeen] = useState('');
  const [missingDescription, setMissingDescription] = useState('');
  const [missingContact, setMissingContact] = useState('');

  // Handle Broadcast Submission
  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastDesc || !broadcastContact) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (hasSpamAlert) {
      toast.error('AI Moderation Warning: Post blocked because it resembles spam/advertisement.');
      return;
    }

    const triage = triageText(broadcastDesc);
    
    // Assign random coordinate offsets around Savar center
    const latOffset = (Math.random() - 0.5) * 0.05;
    const lngOffset = (Math.random() - 0.5) * 0.05;
    const coords: [number, number] = [23.8582 + latOffset, 90.2662 + lngOffset];

    const newAlert: MapEmergency = {
      id: Date.now(),
      title: broadcastTitle + (broadcastRole === 'hospital' ? ' ✔ Verified Hospital' : broadcastRole === 'ngo' ? ' ✔ Verified NGO' : broadcastRole === 'volunteer' ? ' ✔ Verified Volunteer' : ''),
      category: broadcastCategory,
      priority: triage.priority,
      description: broadcastDesc,
      coordinates: coords,
      contact: broadcastContact
    };

    setEmergencies([newAlert, ...emergencies]);
    setIsBroadcastOpen(false);
    
    // Clear Form
    setBroadcastTitle('');
    setBroadcastDesc('');
    setBroadcastContact('');

    toast.success(`Priority Triaged: ${triage.priority}! Emergency Broadcasted successfully.`);
  };

  // Handle Blood Alert Dispatch Simulation
  const handleAlertDonors = () => {
    const ids = matchedDonors.map((_, i) => i);
    setAlertedDonors(ids);
    toast.success(`Priority alerts sent to ${matchedDonors.length} compatible donors within ${bloodSearchRadius}km!`);
  };

  // Handle Dispatch Ambulance
  const handleDispatchAmbulance = (ambulanceId: number | string) => {
    setSelectedAmbulanceId(ambulanceId);
    setIsDispatchModalOpen(true);
  };

  const executeDispatch = (emergencyCoords: [number, number], emergencyTitle: string) => {
    if (!selectedAmbulanceId) return;
    
    setAmbulances(prev => prev.map(a => 
      a.id === selectedAmbulanceId ? { ...a, status: 'En Route' as const } : a
    ));

    setActiveAmbulanceId(selectedAmbulanceId);
    setDispatchDestination(emergencyCoords);
    setIsDispatchModalOpen(false);
    setActiveTab('map'); // Switch to map tab to show route polyline

    toast.success(`Ambulance dispatched to scene: "${emergencyTitle}"`);
  };

  // Handle Notify Hospital
  const handleNotifyHospital = (hospitalId: number, hospitalName: string) => {
    setNotifiedHospitals([...notifiedHospitals, hospitalId]);
    toast.success(`Hospital reception at ${hospitalName} auto-notified of current emergencies.`);
  };

  // Handle Download Poster flyer
  const handleDownloadPoster = () => {
    toast.success('Flyer Generated! PDF download started.');
  };

  // Handle Add Missing Child
  const handleAddMissingChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!missingName || !missingAge || !missingLastSeen || !missingContact) {
      toast.error('Please enter name, age, contact, and last seen location.');
      return;
    }

    const child = {
      id: Date.now(),
      name: missingName,
      age: parseInt(missingAge) || 6,
      gender: missingGender,
      lastSeen: missingLastSeen,
      date: new Date().toISOString().split('T')[0],
      description: missingDescription || 'No detailed description provided.',
      image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&q=80',
      contact: missingContact
    };

    setMissingPersons([child, ...missingPersons]);
    
    // Add to maps as missing category emergency
    const latOffset = (Math.random() - 0.5) * 0.03;
    const lngOffset = (Math.random() - 0.5) * 0.03;
    const coords: [number, number] = [23.8582 + latOffset, 90.2662 + lngOffset];

    const emergencyMatch: MapEmergency = {
      id: Date.now(),
      title: `MISSING: ${missingName} (${missingAge} y/o)`,
      category: 'Missing Person',
      priority: '🟨 Urgent',
      description: `Last seen: ${missingLastSeen}. ${missingDescription}`,
      coordinates: coords,
      contact: missingContact
    };

    setEmergencies([emergencyMatch, ...emergencies]);
    setIsMissingFormOpen(false);
    
    // Clear inputs
    setMissingName('');
    setMissingAge('');
    setMissingLastSeen('');
    setMissingDescription('');
    setMissingContact('');

    toast.success(`Missing Child Alert posted! Coordinates cluster mapped.`);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-16">
      
      {/* Title & Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-4xl font-black font-display tracking-tight text-red-600 flex items-center gap-3">
            <AlertTriangle className="w-10 h-10 animate-pulse text-red-600" strokeWidth={3} /> Emergency Alerts
          </h1>
          <p className="text-gray-500 font-medium text-lg mt-1">Urgent response, hospital coordination, and live dispatcher hub.</p>
        </div>

        {/* Global Action Triggers */}
        <div className="flex gap-3">
          <button 
            onClick={() => setIsBroadcastOpen(true)}
            className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-all shadow-soft flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" /> Broadcast Alert
          </button>
          <button 
            onClick={() => {
              setActiveTab('blood');
              setBloodSearchGroup('O+');
            }}
            className="px-5 py-3 bg-white border border-red-200 hover:bg-red-50 text-red-600 font-bold text-sm rounded-xl transition-all flex items-center gap-1.5"
          >
            <Heart className="w-4 h-4 text-red-600 fill-current" /> Request Blood
          </button>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {[
          { id: 'feed', label: '⚠️ Active Alerts' },
          { id: 'map', label: '🗺️ Response Map' },
          { id: 'blood', label: '🩸 Blood Network' },
          { id: 'ambulance', label: '🚑 Ambulance Dispatch' },
          { id: 'hospitals', label: '🏥 Hospital beds' },
          { id: 'missing', label: '👶 Missing Alerts' },
          { id: 'analytics', label: '📊 Admin Dashboard' },
          { id: 'settings', label: '⚙️ Settings' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-extruded hover:shadow-inset ${
              activeTab === tab.id
                ? 'bg-red-600 text-white shadow-inset-deep'
                : 'bg-white text-slate-600 border border-slate-200/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TABS CONTENT PANELS */}
      <div className="space-y-6">

        {/* Tab 1: Emergency Feed List */}
        {activeTab === 'feed' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-red-500" /> Active Emergency Dispatch Feed
            </h3>
            {emergencies.map(emergency => {
              const isLife = emergency.priority.includes('Life');
              const isCritical = emergency.priority.includes('Critical');
              const isUrgent = emergency.priority.includes('Urgent');

              return (
                <div 
                  key={emergency.id} 
                  className={`bg-red-50/50 border-l-4 border-red-500 rounded-r-2xl p-6 shadow-sm hover:shadow-soft transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                    isLife ? 'bg-red-50/80 border-red-600 ring-1 ring-red-200/50' : ''
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2.5">
                      <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider text-white ${
                        isLife ? 'bg-red-700' : isCritical ? 'bg-orange-600' : isUrgent ? 'bg-amber-500' : 'bg-green-500'
                      }`}>
                        {emergency.priority}
                      </span>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {emergency.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                        <Clock className="w-3.5 h-3.5" /> {emergency.time || 'Live Alert'}
                      </span>
                    </div>
                    
                    <h3 className="font-black text-2xl text-black leading-tight mb-2 flex items-center gap-2">
                      {emergency.title}
                    </h3>
                    <p className="text-gray-700 font-semibold text-sm leading-relaxed">{emergency.description}</p>
                  </div>
                  
                  <div className="flex-shrink-0 flex gap-2">
                    <a 
                      href={`tel:${emergency.contact}`}
                      className="flex items-center justify-center gap-2 px-5 py-3 bg-black text-white font-extrabold text-xs rounded-xl hover:bg-gray-800 transition-colors shadow-soft"
                    >
                      <PhoneCall className="w-4 h-4" /> Call: {emergency.contact}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Interactive Response Map */}
        {activeTab === 'map' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold font-display text-slate-800">Coordination & Tracking Map</h3>
                <p className="text-xs text-slate-400 font-medium">Real-time GPS mapping of emergency incidents, hospitals, and ambulances.</p>
              </div>

              {/* Map Category Filter Dropdown */}
              <div className="flex gap-2">
                <select
                  value={mapCategoryFilter}
                  onChange={(e) => setMapCategoryFilter(e.target.value)}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-1 focus:ring-red-500 shadow-soft"
                >
                  <option value="all">All Map Layers</option>
                  <option value="accident">Accidents Only</option>
                  <option value="blood">Blood Requests</option>
                  <option value="ambulance">Ambulances</option>
                  <option value="missing">Missing child alerts</option>
                </select>
              </div>
            </div>

            <div className="bg-background p-2 rounded-[36px] shadow-inset-deep">
              <DynamicEmergencyMap
                emergencies={filteredMapEmergencies}
                hospitals={hospitals}
                ambulances={ambulances}
                activeAmbulanceId={activeAmbulanceId}
                dispatchDestination={dispatchDestination}
                showMissingHotzones={true}
              />
            </div>
          </div>
        )}

        {/* Tab 3: Smart Blood Donation Network */}
        {activeTab === 'blood' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-background shadow-extruded border-none rounded-[32px] p-6 space-y-4">
              <h3 className="text-lg font-black text-slate-800 font-display uppercase tracking-wide">🩸 Smart compatibility matching engine</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Select target Blood Group */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Required Blood Group</label>
                  <select
                    value={bloodSearchGroup}
                    onChange={(e) => setBloodSearchGroup(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-black focus:outline-none focus:ring-1 focus:ring-red-500 shadow-soft"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>

                {/* Select Radius */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Donor Search Radius</label>
                    <span className="text-xs font-black text-red-600 font-display">{bloodSearchRadius} km</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={bloodSearchRadius}
                    onChange={(e) => setBloodSearchRadius(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600 focus:outline-none mt-2.5"
                  />
                </div>
              </div>
            </div>

            {/* Donor Match Results */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <p className="text-sm font-bold text-slate-500">
                  Matches found: <span className="text-black font-black">{matchedDonors.length}</span> compatible donors within {bloodSearchRadius}km
                </p>
                {matchedDonors.length > 0 && (
                  <button 
                    onClick={handleAlertDonors}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-soft transition-colors"
                  >
                    Alert Donors via SMS/Push
                  </button>
                )}
              </div>

              {matchedDonors.length === 0 ? (
                <div className="bg-white rounded-[32px] p-12 text-center border border-slate-200/50 shadow-soft">
                  <Heart className="w-10 h-10 text-slate-200 mb-2 mx-auto" />
                  <h4 className="font-bold text-slate-700">No compatible donors found</h4>
                  <p className="text-xs text-slate-400 mt-1">Try expanding the search radius or selecting a different compatibility target.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {matchedDonors.map((donor, idx) => {
                    const isAlerted = alertedDonors.includes(idx);
                    return (
                      <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-red-500 hover:shadow-soft transition-all flex flex-col justify-between h-full">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-lg text-slate-900 leading-tight flex items-center gap-1">
                              <User className="w-4 h-4 text-slate-400" /> {donor.name}
                            </h4>
                            <span className="bg-red-100 text-red-700 font-extrabold text-sm px-3 py-1 rounded-lg">
                              {donor.bloodGroup}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
                            Distance: {donor.distance} km away
                          </p>
                          <span className={`text-[10px] font-extrabold px-2.5 py-1 mt-3 inline-block rounded-full ${
                            donor.available ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {donor.available ? 'Available' : 'Busy/Away'}
                          </span>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-500">{donor.contact}</span>
                          <button 
                            onClick={() => {
                              if (isAlerted) return;
                              setAlertedDonors([...alertedDonors, idx]);
                              toast.success(`Emergency SMS dispatched to donor ${donor.name}!`);
                            }}
                            disabled={!donor.available}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                              isAlerted 
                                ? 'bg-green-600 text-white hover:bg-green-700' 
                                : donor.available
                                ? 'bg-black text-white hover:bg-gray-800' 
                                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                            }`}
                          >
                            {isAlerted ? '✔ Alerted' : 'Notify Donor'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Ambulance Dispatch & Tracking */}
        {activeTab === 'ambulance' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold font-display text-slate-800">Dispatch Fleet</h3>
                <p className="text-xs text-slate-400 font-medium">Real-time status indicators and instant field coordination.</p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {ambulances.map((ambulance) => {
                const isAnimating = activeAmbulanceId === ambulance.id;
                
                return (
                  <div key={ambulance.id} className="bg-white border border-slate-200 rounded-[24px] p-6 hover:border-red-600 hover:shadow-soft transition-all flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider ${
                          ambulance.status === 'Available' ? 'bg-green-50 text-green-700' :
                          ambulance.status === 'En Route' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {ambulance.status}
                        </span>
                        <span className="text-xs font-bold text-slate-400 uppercase">Amb #{ambulance.id}</span>
                      </div>
                      
                      <h4 className="font-bold text-lg text-slate-900 leading-tight">{ambulance.name}</h4>
                      <div className="space-y-1 mt-3 text-xs font-semibold text-slate-500">
                        <p>Driver: <span className="text-slate-800 font-bold">{ambulance.driver}</span></p>
                        <p>Contact: <span className="text-slate-800 font-bold">{ambulance.contact}</span></p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => handleDispatchAmbulance(ambulance.id)}
                        disabled={ambulance.status !== 'Available'}
                        className={`w-full py-2.5 text-xs font-bold rounded-xl transition-all shadow-soft flex items-center justify-center gap-1.5 ${
                          isAnimating 
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : ambulance.status === 'Available'
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
                        }`}
                      >
                        {isAnimating ? '🚨 Tracking Route...' : 'Dispatch Ambulance'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 5: Hospital Integration Layer */}
        {activeTab === 'hospitals' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="text-xl font-bold font-display text-slate-800">Local Trauma & ICU Registry</h3>
              <p className="text-xs text-slate-400 font-medium">Beds availability coordination and instant emergency hospital alerts.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {hospitals.map((hospital) => {
                const isNotified = notifiedHospitals.includes(hospital.id as number);
                return (
                  <div key={hospital.id} className="bg-white border border-slate-200 rounded-[24px] p-6 hover:border-primary hover:shadow-soft transition-all flex flex-col justify-between h-full">
                    <div>
                      <h4 className="font-bold text-lg text-slate-900 leading-tight mb-4 flex items-center gap-1.5">
                        <span className="text-primary font-bold">🏥</span> {hospital.name}
                      </h4>
                      <div className="space-y-2 text-xs font-semibold text-slate-500">
                        <div className="flex justify-between border-b border-slate-50 pb-1.5">
                          <span>ICU Beds:</span>
                          <span className="text-slate-900 font-bold">{hospital.icu}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-1.5">
                          <span>General Beds:</span>
                          <span className="text-slate-900 font-bold">{hospital.beds}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tel Contact:</span>
                          <span className="text-slate-900 font-bold">{hospital.contact}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => handleNotifyHospital(hospital.id as number, hospital.name)}
                        className={`w-full py-2.5 text-xs font-bold rounded-xl transition-all shadow-soft flex items-center justify-center gap-1 ${
                          isNotified
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-black hover:bg-gray-800 text-white'
                        }`}
                      >
                        {isNotified ? '✔ Reception Notified' : 'Notify Reception'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 6: Missing Child Intelligence & Poster */}
        {activeTab === 'missing' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold font-display text-slate-800">Missing Child Intelligence Feed</h3>
                <p className="text-xs text-slate-400 font-medium">Clustered alert board and automated flyer generation tools.</p>
              </div>
              <button 
                onClick={() => setIsMissingFormOpen(true)}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-soft"
              >
                + Register Alert
              </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {missingPersons.map((child) => (
                <div key={child.id} className="bg-white border border-slate-200 rounded-[28px] overflow-hidden hover:shadow-soft transition-all flex flex-col sm:flex-row h-full">
                  <div className="w-full sm:w-44 h-48 sm:h-full shrink-0 bg-slate-100 relative">
                    <img src={child.image} alt={child.name} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-red-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                      Missing
                    </span>
                  </div>

                  <div className="p-6 flex flex-col justify-between flex-grow text-black">
                    <div>
                      <h4 className="font-bold text-xl text-slate-900 leading-tight">
                        {child.name} ({child.age} yrs, {child.gender})
                      </h4>
                      <p className="text-xs text-red-500 font-bold mt-1">Last seen: {child.lastSeen}</p>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">Date: {child.date}</p>
                      <p className="text-xs text-slate-600 mt-3 font-semibold leading-relaxed line-clamp-3">
                        {child.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">{child.contact}</span>
                      <button
                        onClick={() => setSelectedPosterChild(child)}
                        className="px-4 py-2 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-lg transition-colors"
                      >
                        Generate Poster
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 7: Admin Analytics Dashboard */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Stat Summary Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-white shadow-soft border border-slate-100 rounded-2xl">
                <CardContent className="p-5 flex flex-col items-center justify-center">
                  <span className="text-slate-400 font-bold text-xs uppercase tracking-wider text-center">Emergencies Today</span>
                  <span className="text-3xl font-black text-red-600 font-display mt-2">18</span>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-soft border border-slate-100 rounded-2xl">
                <CardContent className="p-5 flex flex-col items-center justify-center">
                  <span className="text-slate-400 font-bold text-xs uppercase tracking-wider text-center">Avg Response Time</span>
                  <span className="text-3xl font-black text-slate-800 font-display mt-2">12.4m</span>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-soft border border-slate-100 rounded-2xl">
                <CardContent className="p-5 flex flex-col items-center justify-center">
                  <span className="text-slate-400 font-bold text-xs uppercase tracking-wider text-center">Ambulances Dispatched</span>
                  <span className="text-3xl font-black text-primary font-display mt-2">3/5</span>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-soft border border-slate-100 rounded-2xl">
                <CardContent className="p-5 flex flex-col items-center justify-center">
                  <span className="text-slate-400 font-bold text-xs uppercase tracking-wider text-center">Blood Units Filled</span>
                  <span className="text-3xl font-black text-orange-500 font-display mt-2">24</span>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category distribution */}
              <Card className="bg-white shadow-soft border border-slate-100 rounded-[24px]">
                <CardHeader className="p-6 border-b border-slate-50">
                  <CardTitle className="text-base font-bold font-display text-slate-800">Emergency Type Distribution</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {[
                    { label: '💥 Accidents', pct: 45, color: 'bg-red-500' },
                    { label: '🩸 Blood Request', pct: 25, color: 'bg-red-400' },
                    { label: '🚑 Ambulance Required', pct: 15, color: 'bg-blue-500' },
                    { label: '🔥 Fire & Police', pct: 15, color: 'bg-slate-600' }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>{item.label}</span>
                        <span>{item.pct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }}></div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Heatmaps listing */}
              <Card className="bg-white shadow-soft border border-slate-100 rounded-[24px]">
                <CardHeader className="p-6 border-b border-slate-50">
                  <CardTitle className="text-base font-bold font-display text-slate-800">High-Risk Regional Hot Zones</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      { area: 'Savar Bazar Central Market', risk: '🟥 Critical Risk', count: '8 Alerts' },
                      { area: 'College Road Bus Station', risk: '🟧 High Risk', count: '6 Alerts' },
                      { area: 'Dhaka-Aricha Highway Crossing', risk: '🟥 Critical Risk', count: '4 Alerts' }
                    ].map((zone, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs font-semibold pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                        <div>
                          <p className="text-slate-800 font-bold">{zone.area}</p>
                          <p className="text-slate-400 font-medium mt-0.5">{zone.count} total alerts</p>
                        </div>
                        <span className="font-extrabold text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-700">
                          {zone.risk}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Tab 8: Smart Notification preferences */}
        {activeTab === 'settings' && (
          <div className="bg-white border border-slate-200 rounded-[32px] p-6 space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="text-xl font-bold font-display text-slate-800">Triage & Radius Configuration</h3>
              <p className="text-xs text-slate-400 font-medium">Define your emergency dispatch parameters and alert configurations.</p>
            </div>

            <div className="space-y-6 max-w-xl text-black">
              {/* Radius preferences */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-700">Emergency Alert Radius</span>
                  <span className="text-xs font-black text-red-600 font-display">{notifRadius} km</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={notifRadius}
                  onChange={(e) => {
                    setNotifRadius(parseInt(e.target.value));
                    toast.success(`Notifications dispatch radius set to ${e.target.value}km`);
                  }}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600 focus:outline-none"
                />
                <p className="text-[10px] text-slate-400">Receive priority push alerts only for emergency incidents reported within this radius.</p>
              </div>

              {/* Toggles */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-slate-700">Immediate Blood Requests Alerts</span>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Receive real-time notifications for compatible blood requirements.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={bloodAlertsOn}
                    onChange={(e) => {
                      setBloodAlertsOn(e.target.checked);
                      toast.success(`Blood request alerts toggled ${e.target.checked ? 'ON' : 'OFF'}`);
                    }}
                    className="rounded text-red-600 border-slate-300 focus:ring-red-500 h-4.5 w-4.5"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Broadcast Emergency Dialog Modal */}
      <Dialog open={isBroadcastOpen} onOpenChange={setIsBroadcastOpen}>
        <DialogContent className="max-w-lg rounded-[32px] overflow-hidden p-6 border-none bg-white shadow-2xl animate-in zoom-in-95 duration-200 text-black" showCloseButton={true}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-black font-display text-slate-900">Broadcast Priority Alert</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleBroadcastSubmit} className="space-y-4 mt-2">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Alert Heading</label>
              <Input
                type="text"
                placeholder="e.g. O+ Blood Needed immediately"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                className="bg-white rounded-xl text-black border-slate-200 focus:ring-red-500 focus:border-transparent text-sm w-full font-semibold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Emergency Category</label>
                <select
                  value={broadcastCategory}
                  onChange={(e) => setBroadcastCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-black focus:outline-none focus:ring-1 focus:ring-red-500 h-10"
                >
                  <option value="Medical">Medical Emergency</option>
                  <option value="Accident">Accident</option>
                  <option value="Blood Request">Blood Request</option>
                  <option value="Ambulance">Ambulance Need</option>
                  <option value="Missing Person">Missing Person</option>
                  <option value="Fire">Fire Emergency</option>
                  <option value="Disaster">Natural Disaster</option>
                  <option value="Police">Police Assistance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Verification Authority</label>
                <select
                  value={broadcastRole}
                  onChange={(e) => setBroadcastRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-black focus:outline-none focus:ring-1 focus:ring-red-500 h-10"
                >
                  <option value="user">Broadcast as Citizen</option>
                  <option value="hospital">✔ Verified Hospital</option>
                  <option value="ngo">✔ Verified NGO</option>
                  <option value="volunteer">✔ Verified Volunteer</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Incident Details (Triggers AI Triage)</label>
              <textarea
                placeholder="Describe the incident. E.g. My father had accident near Savar, need O+ blood and ambulance urgently"
                value={broadcastDesc}
                onChange={(e) => setBroadcastDesc(e.target.value)}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500 min-h-[80px] font-semibold text-black"
                required
              />
            </div>

            {/* AI Summarizer Structured Output Box */}
            {aiSummary && (
              <div className="bg-red-50/70 border border-red-200/50 rounded-2xl p-4 space-y-2 animate-in slide-in-from-top-2 duration-300">
                <h4 className="text-[10px] font-black text-red-600 uppercase tracking-widest flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> AI Triage & Summary Preview
                </h4>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs font-semibold text-slate-700">
                  <p>Type: <span className="text-black font-extrabold">{aiSummary.type}</span></p>
                  <p>Location: <span className="text-black font-extrabold">{aiSummary.location}</span></p>
                  <p>Requirement: <span className="text-black font-extrabold">{aiSummary.requirement}</span></p>
                  <p>Priority: <span className="text-red-700 font-extrabold">{aiSummary.priority}</span></p>
                  <p className="col-span-2 text-[10px] text-slate-500 mt-1 font-medium italic border-t border-red-100 pt-1">
                    Suggested Action: {aiSummary.suggestedAction}
                  </p>
                </div>
              </div>
            )}

            {/* AI Moderation Warnings */}
            {hasSpamAlert && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2 text-amber-800 text-xs font-semibold animate-in shake duration-300">
                <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                <span>⚠️ AI Safety Warning: Content contains potential spam or commercial keywords. Please verify details.</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Contact Number</label>
              <Input
                type="text"
                placeholder="e.g. 01711-223344"
                value={broadcastContact}
                onChange={(e) => setBroadcastContact(e.target.value)}
                className="bg-white rounded-xl text-black border-slate-200 focus:ring-red-500 focus:border-transparent text-sm w-full font-semibold"
                required
              />
            </div>

            <div className="pt-2 flex gap-3">
              <Button
                type="submit"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-5 rounded-full shadow-soft text-xs"
              >
                Submit Broadcast
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Ambulance Dispatch Scene Picker Dialog */}
      <Dialog open={isDispatchModalOpen} onOpenChange={setIsDispatchModalOpen}>
        <DialogContent className="max-w-md rounded-[32px] p-6 bg-white border-none shadow-2xl text-black" showCloseButton={true}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-display text-slate-900">Select Dispatch Target Location</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 mt-3">
            <p className="text-xs text-slate-400 font-medium">Select which reported emergency scene to dispatch the ambulance to:</p>
            {emergencies.map(e => (
              <button
                key={e.id}
                onClick={() => executeDispatch(e.coordinates, e.title)}
                className="w-full text-left p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-red-600 hover:bg-red-50/20 transition-all font-semibold flex flex-col gap-1"
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-sm font-bold text-slate-900">{e.title}</span>
                  <span className="text-[9px] font-black text-red-600">{e.priority.split(' ')[1]}</span>
                </div>
                <span className="text-xs text-slate-400 leading-normal line-clamp-1">{e.description}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Missing child flyer generator Modal */}
      <Dialog open={!!selectedPosterChild} onOpenChange={(open) => !open && setSelectedPosterChild(null)}>
        {selectedPosterChild && (
          <DialogContent className="max-w-sm rounded-[32px] p-6 bg-white border-none shadow-2xl text-black" showCloseButton={true}>
            {/* Poster Header */}
            <div className="border-4 border-red-600 p-4 space-y-4 text-center rounded-2xl">
              <h2 className="text-3xl font-black text-red-600 tracking-wider font-display uppercase border-b-4 border-red-600 pb-1">
                MISSING CHILD
              </h2>
              
              <div className="h-44 w-36 mx-auto border-2 border-slate-300 rounded-lg overflow-hidden bg-slate-100 shadow-md">
                <img 
                  src={selectedPosterChild.image} 
                  alt={selectedPosterChild.name} 
                  className="w-full h-full object-cover" 
                />
              </div>

              <div className="space-y-1 mt-2 text-black">
                <h3 className="text-2xl font-black font-display tracking-tight leading-tight">{selectedPosterChild.name}</h3>
                <p className="text-sm font-extrabold text-slate-700">Age: {selectedPosterChild.age} | Gender: {selectedPosterChild.gender}</p>
                <p className="text-xs font-black text-red-600 mt-2">LAST SEEN: {selectedPosterChild.lastSeen}</p>
                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-1">{selectedPosterChild.description}</p>
              </div>

              <div className="bg-red-50 border border-red-200/50 rounded-xl py-2 mt-4">
                <p className="text-[10px] font-bold text-red-700 uppercase">If seen, please contact:</p>
                <p className="text-sm font-black text-slate-900 mt-0.5">{selectedPosterChild.contact}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 pt-2">
              <Button 
                onClick={handleDownloadPoster}
                className="w-full py-2.5 bg-red-600 text-white hover:bg-red-700 text-xs font-bold rounded-full shadow-soft flex items-center justify-center gap-1"
              >
                Download Poster
              </Button>
              <Button 
                onClick={() => setSelectedPosterChild(null)}
                variant="outline"
                className="w-full py-2.5 text-xs font-bold rounded-full border-slate-200 hover:border-black text-black"
              >
                Close Flyer
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Register Missing Child Dialog Modal */}
      <Dialog open={isMissingFormOpen} onOpenChange={setIsMissingFormOpen}>
        <DialogContent className="max-w-md rounded-[32px] p-6 bg-white border-none shadow-2xl text-black" showCloseButton={true}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-display text-slate-900">Register Missing Alert</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddMissingChild} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Full Name</label>
                <Input
                  type="text"
                  placeholder="e.g. Tanim Ahmed"
                  value={missingName}
                  onChange={(e) => setMissingName(e.target.value)}
                  className="bg-white rounded-xl text-black border-slate-200 text-sm font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Age</label>
                <Input
                  type="number"
                  placeholder="e.g. 6"
                  value={missingAge}
                  onChange={(e) => setMissingAge(e.target.value)}
                  className="bg-white rounded-xl text-black border-slate-200 text-sm font-semibold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Gender</label>
                <select
                  value={missingGender}
                  onChange={(e) => setMissingGender(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-black h-10"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Contact Number</label>
                <Input
                  type="text"
                  placeholder="e.g. 01711-223344"
                  value={missingContact}
                  onChange={(e) => setMissingContact(e.target.value)}
                  className="bg-white rounded-xl text-black border-slate-200 text-sm font-semibold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Last Seen Location</label>
              <Input
                type="text"
                placeholder="e.g. Savar Bazar Central Mosque"
                value={missingLastSeen}
                onChange={(e) => setMissingLastSeen(e.target.value)}
                className="bg-white rounded-xl text-black border-slate-200 text-sm font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Description / Physical features</label>
              <textarea
                placeholder="Wearing a red t-shirt and blue shorts. Hair tied in ponytail..."
                value={missingDescription}
                onChange={(e) => setMissingDescription(e.target.value)}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs min-h-[60px] font-semibold text-black"
                required
              />
            </div>

            <div className="pt-2 flex gap-3">
              <Button
                type="submit"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-5 rounded-full shadow-soft text-xs"
              >
                Register & Cluster Map
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
