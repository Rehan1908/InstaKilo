import React from 'react'

const ProfileStats = ({ userProfile, handleShowFollowers, handleShowFollowing }) => {
  return (
    <div className="flex items-center gap-4 text-sm md:text-base">
      <p>
        <span className="font-semibold">{userProfile?.posts?.length || 0}</span> posts
      </p>
      <p 
        onClick={handleShowFollowers}
        className={`cursor-pointer hover:underline ${userProfile?.followers?.length ? "" : "pointer-events-none"}`}
      >
        <span className="font-semibold">{userProfile?.followers?.length || 0}</span> followers
      </p>
      <p 
        onClick={handleShowFollowing}
        className={`cursor-pointer hover:underline ${userProfile?.following?.length ? "" : "pointer-events-none"}`}
      >
        <span className="font-semibold">{userProfile?.following?.length || 0}</span> following
      </p>
    </div>
  )
}

export default ProfileStats