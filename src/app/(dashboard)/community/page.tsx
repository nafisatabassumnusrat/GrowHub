import { MOCK_COMMUNITY } from '@/lib/mock-data';
import { MessageSquare, Heart, Share2, MoreHorizontal } from 'lucide-react';

export default function CommunityPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl font-black font-display tracking-tight text-black">Local Community</h1>
        <p className="text-gray-500 font-medium text-lg">Discuss, ask questions, and share updates with people in your Upazila.</p>
      </div>

      {/* New Post Input */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-soft">
        <textarea 
          className="w-full bg-gray-50 border-transparent focus:border-gray-300 focus:bg-white focus:ring-0 rounded-xl p-4 resize-none transition-colors" 
          rows={3} 
          placeholder="What's happening in your area?"
        ></textarea>
        <div className="flex justify-end mt-3">
          <button className="px-6 py-2.5 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">
            Post
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {MOCK_COMMUNITY.map(post => (
          <div key={post.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-soft transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                  {post.user.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-black leading-tight">{post.user}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mt-0.5">
                    <span>{post.time}</span>
                    <span>•</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded-md font-semibold">{post.type}</span>
                  </div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-black transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-gray-800 font-medium leading-relaxed mb-4">
              {post.text}
            </p>

            {post.image && (
              <div className="w-full h-64 rounded-xl overflow-hidden mb-6 border border-gray-100">
                <img src={post.image} alt="Post attachment" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
              <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 font-semibold text-sm transition-colors group">
                <Heart className="w-5 h-5 group-hover:fill-current" /> {post.likes}
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-black font-semibold text-sm transition-colors">
                <MessageSquare className="w-5 h-5" /> {post.comments}
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 font-semibold text-sm transition-colors ml-auto">
                <Share2 className="w-5 h-5" /> Share
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
