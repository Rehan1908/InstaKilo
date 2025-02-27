import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import useGetAllPost from '@/hooks/useGetAllPost'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'

const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();
  
  return (
    <div className="max-w-screen-lg mx-auto px-4 md:px-0 flex flex-col md:flex-row gap-4 py-4">
      {/* Main feed area */}
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>
      {/* Rightsidebar hidden on mobile */}
      <div className="hidden md:block">
        <RightSidebar />
      </div>
    </div>
  )
}

export default Home