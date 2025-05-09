import React from 'react'
import { Heart, MessageCircle } from 'lucide-react'

const ProfilePosts = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-500">
        No posts to display
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 md:gap-4 mt-2">
      {posts.map((post) => (
        <div key={post?._id} className="relative group cursor-pointer aspect-square">
          <img 
            src={post?.image} 
            alt="post" 
            className="w-full h-full object-cover rounded-sm"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/600x600?text=Image+Not+Found';
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center text-white space-x-4">
              <button className="flex items-center gap-2 hover:text-gray-300">
                <Heart size={18} />
                <span>{post?.likes?.length || 0}</span>
              </button>
              <button className="flex items-center gap-2 hover:text-gray-300">
                <MessageCircle size={18} />
                <span>{post?.comments?.length || 0}</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProfilePosts