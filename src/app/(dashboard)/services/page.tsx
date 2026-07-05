import { MOCK_SERVICES } from '@/lib/mock-data';
import { Star, MapPin, Wrench, PhoneCall } from 'lucide-react';

export default function ServicesPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black font-display tracking-tight text-black">Local Services</h1>
        <p className="text-gray-500 font-medium text-lg">Find trusted professionals and businesses in your Upazila.</p>
      </div>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_SERVICES.map(service => (
            <div key={service.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-black hover:shadow-soft transition-all flex flex-col cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center shrink-0">
                    <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{service.name}</h3>
                    <p className="text-sm font-semibold text-gray-500">{service.category}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-medium">Rate</span>
                  <span className="font-bold text-black">{service.rate}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-medium">Availability</span>
                  <span className="font-semibold text-green-600">{service.contact}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    {service.rating} <span className="text-gray-400 font-medium">({service.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 font-medium mt-1">
                    <MapPin className="w-3 h-3" /> {service.location}
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors">
                  <PhoneCall className="w-4 h-4" />
                  Call
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
