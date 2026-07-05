import { MOCK_FARM_PRODUCTS, MOCK_FISH_PRODUCTS } from '@/lib/mock-data';
import { Star, MapPin } from 'lucide-react';

export default function MarketplacePage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black font-display tracking-tight text-black">Buy & Sell</h1>
        <p className="text-gray-500 font-medium text-lg">Hyperlocal marketplace for fresh produce directly from farmers & fishermen.</p>
      </div>

      <section>
        <h2 className="text-2xl font-bold font-display mb-6 border-b border-gray-200 pb-2">Fresh Farm Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_FARM_PRODUCTS.map(product => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-black hover:shadow-soft transition-all group flex flex-col h-full cursor-pointer overflow-hidden">
              <div className="h-48 mb-4 -mx-5 -mt-5 bg-gray-50 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2">{product.title}</h3>
              <div className="flex items-end justify-between mt-auto pt-4">
                <div>
                  <p className="text-2xl font-black text-black">৳{product.price}</p>
                  <p className="text-xs text-gray-500 font-medium">{product.unit}</p>
                </div>
                <button className="px-4 py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors">
                  Add
                </button>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{product.location}</div>
                <div className="flex items-center gap-1 text-yellow-500"><Star className="w-3 h-3 fill-current" />{product.rating}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold font-display mb-6 border-b border-gray-200 pb-2">Live Fish & Seafood</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_FISH_PRODUCTS.map(product => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-black hover:shadow-soft transition-all group flex flex-col h-full cursor-pointer overflow-hidden">
              <div className="h-48 mb-4 -mx-5 -mt-5 bg-gray-50 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2">{product.title}</h3>
              <div className="flex items-end justify-between mt-auto pt-4">
                <div>
                  <p className="text-2xl font-black text-black">৳{product.price}</p>
                  <p className="text-xs text-gray-500 font-medium">{product.unit}</p>
                </div>
                <button className="px-4 py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors">
                  Add
                </button>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{product.location}</div>
                <div className="flex items-center gap-1 text-yellow-500"><Star className="w-3 h-3 fill-current" />{product.rating}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
