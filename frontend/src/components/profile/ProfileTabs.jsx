import React from 'react'

const ProfileTabs = ({ activeTab, handleTabChange }) => {
  return (
    <div className="flex items-center justify-center gap-4 md:gap-10 text-xs md:text-sm overflow-x-auto pb-2">
      <span 
        className={`py-3 px-2 cursor-pointer ${activeTab === 'posts' ? 'font-bold border-t-2 border-black' : ''}`}
        onClick={() => handleTabChange('posts')}
      >
        POSTS
      </span>
      <span 
        className={`py-3 px-2 cursor-pointer ${activeTab === 'saved' ? 'font-bold border-t-2 border-black' : ''}`}
        onClick={() => handleTabChange('saved')}
      >
        SAVED
      </span>
      <span className="py-3 px-2 cursor-pointer">REELS</span>
      <span className="py-3 px-2 cursor-pointer">TAGS</span>
    </div>
  )
}

export default ProfileTabs