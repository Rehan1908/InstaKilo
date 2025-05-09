import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import ProfileStats from './ProfileStats'
import ProfileActionButtons from './ProfileActionButtons'
import { Badge } from '../ui/badge'
import { AtSign } from 'lucide-react'

const ProfileHeader = ({ 
  userProfile, 
  isLoggedInUserProfile, 
  isFollowing,
  followLoading,
  handleFollowToggle,
  handleMessageClick,
  handleShowFollowers,
  handleShowFollowing
}) => {
  return (
    <div className="flex flex-col sm:grid sm:grid-cols-3 gap-8 md:gap-4">
      {/* Avatar Section */}
      <section className="flex items-center justify-center sm:col-span-1">
        <Avatar className="h-24 w-24 md:h-32 md:w-32">
          <AvatarImage 
            src={userProfile?.profilePicture} 
            alt="profile" 
          />
          <AvatarFallback>{userProfile?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
        </Avatar>
      </section>
      
      {/* Profile Info Section */}
      <section className="sm:col-span-2">
        <div className="flex flex-col gap-4 md:gap-5">
          {/* Username and Action Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-2">
            <span className="text-lg font-medium">{userProfile?.username}</span>
            <ProfileActionButtons 
              isLoggedInUserProfile={isLoggedInUserProfile}
              isFollowing={isFollowing}
              followLoading={followLoading}
              handleFollowToggle={handleFollowToggle}
              handleMessageClick={handleMessageClick}
            />
          </div>
          
          {/* Stats */}
          <ProfileStats 
            userProfile={userProfile} 
            handleShowFollowers={handleShowFollowers}
            handleShowFollowing={handleShowFollowing}
          />
          
          {/* Bio */}
          <div className="flex flex-col gap-1 text-sm md:text-base">
            <span className="font-semibold">{userProfile?.bio || 'bio here...'}</span>
            <Badge className="w-fit" variant="secondary">
              <AtSign size={16} /> <span className="pl-1">{userProfile?.username}</span>
            </Badge>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProfileHeader