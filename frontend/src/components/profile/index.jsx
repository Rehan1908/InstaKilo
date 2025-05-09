import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setUserProfile } from '@/redux/authSlice'
import useGetUserProfile from '@/hooks/useGetUserProfile'

import MobileSidebar from './MobileSidebar'
import ProfileHeader from './ProfileHeader'
import ProfileTabs from './ProfileTabs'
import ProfilePosts from './ProfilePosts'
import UserListDialog from './UserListDialog'

const Profile = () => {
  const params = useParams()
  const userId = params.id
  useGetUserProfile(userId)
  const [activeTab, setActiveTab] = useState('posts')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)
  const [followersList, setFollowersList] = useState([])
  const [followingList, setFollowingList] = useState([])
  const [loadingUserList, setLoadingUserList] = useState(false)

  const dispatch = useDispatch()
  const { userProfile, user } = useSelector(store => store.auth)
  const isLoggedInUserProfile = user?._id === userProfile?._id
  const navigate = useNavigate()
  
  // Determine if current user follows this profile
  const [isFollowing, setIsFollowing] = useState(false)
  
  // Check follow status when userProfile or user changes
  useEffect(() => {
    if (user && userProfile && userProfile.followers) {
      setIsFollowing(userProfile.followers.includes(user._id))
    }
  }, [user, userProfile])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev)
  }

  const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks

  // Follow/Unfollow functionality
  const handleFollowToggle = async () => {
    if (!user) {
      toast.error("Please login to follow users")
      return
    }
    
    try {
      setFollowLoading(true)
      const res = await axios.post(`http://localhost:3000/api/v1/user/followorunfollow/${userProfile._id}`, {}, {
        withCredentials: true
      })
      
      if (res.data.success) {
        // Update the followers count in the profile
        const updatedProfile = { 
          ...userProfile,
          followers: isFollowing 
            ? userProfile.followers.filter(id => id !== user._id) 
            : [...userProfile.followers, user._id]
        }
        
        dispatch(setUserProfile(updatedProfile))
        setIsFollowing(!isFollowing)
        toast.success(res.data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || "Failed to update follow status")
    } finally {
      setFollowLoading(false)
    }
  }
  
  // Fetch followers data
  const handleShowFollowers = async () => {
    if (!userProfile?.followers?.length) return;
    
    setShowFollowers(true)
    setLoadingUserList(true)
    
    try {
      const res = await axios.get(`http://localhost:3000/api/v1/user/followers/${userProfile._id}`, {
        withCredentials: true
      });
      
      if (res.data.success) {
        setFollowersList(res.data.followers);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load followers");
    } finally {
      setLoadingUserList(false);
    }
  }
  
  // Fetch following data
  const handleShowFollowing = async () => {
    if (!userProfile?.following?.length) return;
    
    setShowFollowing(true)
    setLoadingUserList(true)
    
    try {
      const res = await axios.get(`http://localhost:3000/api/v1/user/following/${userProfile._id}`, {
        withCredentials: true
      });
      
      if (res.data.success) {
        setFollowingList(res.data.following);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load following");
    } finally {
      setLoadingUserList(false);
    }
  }

  const handleMessageClick = () => {
    if (!user) {
      toast.error("Please login to send messages")
      return
    }
    
    // Navigate to the messages page with this user preselected
    navigate(`/messages/${userProfile?._id}`)
  }

  return (
    <div className="relative w-full mx-auto max-w-4xl px-4 md:px-6 lg:px-4">
      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={mobileMenuOpen} 
        toggle={toggleMobileMenu} 
        user={user} 
      />

      <div className="flex flex-col gap-6 md:gap-10 py-6 md:p-8">
        {/* Profile Header */}
        <ProfileHeader 
          userProfile={userProfile}
          isLoggedInUserProfile={isLoggedInUserProfile}
          isFollowing={isFollowing}
          followLoading={followLoading}
          handleFollowToggle={handleFollowToggle}
          handleMessageClick={handleMessageClick}
          handleShowFollowers={handleShowFollowers}
          handleShowFollowing={handleShowFollowing}
        />
        
        {/* Posts Section */}
        <div className="border-t border-gray-200 pt-4">
          {/* Tabs */}
          <ProfileTabs 
            activeTab={activeTab}
            handleTabChange={handleTabChange}
          />
          
          {/* Posts Grid */}
          <ProfilePosts posts={displayedPost} />
        </div>
      </div>
      
      {/* Followers Dialog */}
      <UserListDialog
        title="Followers"
        isOpen={showFollowers}
        onOpenChange={setShowFollowers}
        users={followersList}
        isLoading={loadingUserList}
        emptyMessage="No followers yet"
        currentUser={user}
        isLoggedInUserProfile={isLoggedInUserProfile}
        buttonText="Follow"
      />
      
      {/* Following Dialog */}
      <UserListDialog
        title="Following"
        isOpen={showFollowing}
        onOpenChange={setShowFollowing}
        users={followingList}
        isLoading={loadingUserList}
        emptyMessage="Not following anyone yet"
        currentUser={user}
        isLoggedInUserProfile={isLoggedInUserProfile}
        buttonText="Following"
      />
    </div>
  )
}

export default Profile