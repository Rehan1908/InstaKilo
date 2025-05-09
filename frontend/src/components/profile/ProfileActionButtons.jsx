import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'

const ProfileActionButtons = ({ 
  isLoggedInUserProfile, 
  isFollowing,
  followLoading,
  handleFollowToggle,
  handleMessageClick
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {isLoggedInUserProfile ? (
        <>
          <Link to="/account/edit">
            <Button variant="secondary" className="hover:bg-gray-200 h-8 text-xs sm:text-sm">
              Edit profile
            </Button>
          </Link>
          <Button variant="secondary" className="hover:bg-gray-200 h-8 text-xs sm:text-sm">
            View archive
          </Button>
          <Button variant="secondary" className="hover:bg-gray-200 h-8 text-xs sm:text-sm">
            Ad tools
          </Button>
        </>
      ) : (
        isFollowing ? (
          <>
            <Button 
              variant="secondary" 
              className="h-8 text-xs sm:text-sm"
              onClick={handleFollowToggle}
              disabled={followLoading}
            >
              {followLoading ? "Processing..." : "Unfollow"}
            </Button>
            <Button 
              variant="secondary" 
              className="h-8 text-xs sm:text-sm"
              onClick={handleMessageClick}
            >
              Message
            </Button>
          </>
        ) : (
          <Button 
            className="bg-[#0095F6] hover:bg-[#3192d2] h-8 text-xs sm:text-sm text-white"
            onClick={handleFollowToggle}
            disabled={followLoading}
          >
            {followLoading ? "Processing..." : "Follow"}
          </Button>
        )
      )}
    </div>
  )
}

export default ProfileActionButtons