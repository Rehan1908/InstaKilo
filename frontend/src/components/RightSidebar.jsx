import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import SuggestedUsers from './SuggestedUsers'

const RightSidebar = () => {
  const { user } = useSelector(store => store.auth)
  
  return (
    <div className="hidden lg:block w-full max-w-xs md:max-w-sm xl:max-w-md my-6 px-4">
      <div className="sticky top-6">
        {/* User Profile Section */}
        <div className="flex items-center gap-3 mb-6">
          <Link to={`/profile/${user?._id}`}>
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.profilePicture} alt={user?.username || "Profile"} />
              <AvatarFallback>{user?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="overflow-hidden">
            <h1 className="font-semibold text-sm">
              <Link to={`/profile/${user?._id}`} className="hover:underline">
                {user?.username}
              </Link>
            </h1>
            <p className="text-gray-500 text-sm truncate max-w-[180px]">
              {user?.bio || 'Bio here...'}
            </p>
          </div>
        </div>

      
        {/* Suggested Users */}
        <SuggestedUsers />

        {/* Footer Links - Instagram-style */}
        <div className="mt-8 text-xs text-gray-400">
          <div className="flex flex-wrap items-center gap-1 mb-3">
            <a href="#" className="hover:underline">About</a>
            <span>•</span>
            <a href="#" className="hover:underline">Help</a>
            <span>•</span>
            <a href="#" className="hover:underline">Press</a>
            <span>•</span>
            <a href="#" className="hover:underline">API</a>
            <span>•</span>
            <a href="#" className="hover:underline">Jobs</a>
          </div>
          <div className="text-center">
            © 2023 Instakilo from Meta
          </div>
        </div>
      </div>
    </div>
  )
}

export default RightSidebar