import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import useGetUserProfile from '@/hooks/useGetUserProfile'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'
import { AtSign, Heart, MessageCircle, Menu, X, Home, Search, PlusSquare, Film, User } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { setUserProfile } from '@/redux/authSlice' // Make sure you have this action

const Profile = () => {
  const params = useParams()
  const userId = params.id
  useGetUserProfile(userId)
  const [activeTab, setActiveTab] = useState('posts')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  
  // State for followers/following modals
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
      // You'll need to create this endpoint in your backend
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
      // You'll need to create this endpoint in your backend
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
      {/* Mobile Hamburger Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={toggleMobileMenu}
          className="p-2 rounded-full bg-white shadow-md"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
        <div className="flex flex-col p-5">
          <div className="py-6">
            <h2 className="text-xl font-bold mb-6">Instakilo</h2>
            <nav className="space-y-6">
              <Link to="/" className="flex items-center gap-4 hover:bg-gray-100 p-2 rounded-md">
                <Home size={24} />
                <span>Home</span>
              </Link>
              <Link to="/explore" className="flex items-center gap-4 hover:bg-gray-100 p-2 rounded-md">
                <Search size={24} />
                <span>Search</span>
              </Link>
              <Link to="/create" className="flex items-center gap-4 hover:bg-gray-100 p-2 rounded-md">
                <PlusSquare size={24} />
                <span>Create</span>
              </Link>
              <Link to="/reels" className="flex items-center gap-4 hover:bg-gray-100 p-2 rounded-md">
                <Film size={24} />
                <span>Reels</span>
              </Link>
              <Link to={`/profile/${user?.username}`} className="flex items-center gap-4 hover:bg-gray-100 p-2 rounded-md">
                <User size={24} />
                <span>Profile</span>
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Overlay for Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      <div className="flex flex-col gap-6 md:gap-10 py-6 md:p-8">
        {/* Profile Header */}
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
              {/* Username and Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-2">
                <span className="text-lg font-medium">{userProfile?.username}</span>
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
              </div>
              
              {/* Stats */}
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
        
        {/* Posts Section */}
        <div className="border-t border-gray-200 pt-4">
          {/* Tabs */}
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
          
          {/* Posts Grid */}
          {displayedPost && displayedPost.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 md:gap-4 mt-2">
              {displayedPost.map((post) => (
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
          ) : (
            <div className="flex justify-center items-center h-40 text-gray-500">
              No posts to display
            </div>
          )}
        </div>
      </div>
      
      {/* Followers Dialog */}
      <Dialog open={showFollowers} onOpenChange={setShowFollowers}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Followers</DialogTitle>
          <div className="max-h-[70vh] overflow-y-auto space-y-4 py-4">
            {loadingUserList ? (
              <div className="flex justify-center py-8">Loading...</div>
            ) : followersList.length > 0 ? (
              followersList.map((follower) => (
                <div key={follower._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Link to={`/profile/${follower._id}`} onClick={() => setShowFollowers(false)}>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={follower.profilePicture} alt={follower.username} />
                        <AvatarFallback>{follower.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="overflow-hidden">
                      <Link 
                        to={`/profile/${follower._id}`} 
                        className="font-semibold text-sm hover:underline"
                        onClick={() => setShowFollowers(false)}
                      >
                        {follower.username}
                      </Link>
                      <p className="text-gray-500 text-xs truncate">{follower.bio || "Bio here..."}</p>
                    </div>
                  </div>
                  {!isLoggedInUserProfile && follower._id !== user?._id && (
                    <Button 
                      variant="secondary" 
                      className="h-8 text-xs"
                    >
                      Follow
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">No followers yet</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Following Dialog */}
      <Dialog open={showFollowing} onOpenChange={setShowFollowing}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Following</DialogTitle>
          <div className="max-h-[70vh] overflow-y-auto space-y-4 py-4">
            {loadingUserList ? (
              <div className="flex justify-center py-8">Loading...</div>
            ) : followingList.length > 0 ? (
              followingList.map((following) => (
                <div key={following._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Link to={`/profile/${following._id}`} onClick={() => setShowFollowing(false)}>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={following.profilePicture} alt={following.username} />
                        <AvatarFallback>{following.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="overflow-hidden">
                      <Link 
                        to={`/profile/${following._id}`}
                        className="font-semibold text-sm hover:underline"
                        onClick={() => setShowFollowing(false)}
                      >
                        {following.username}
                      </Link>
                      <p className="text-gray-500 text-xs truncate">{following.bio || "Bio here..."}</p>
                    </div>
                  </div>
                  {following._id !== user?._id && (
                    <Button 
                      variant="secondary"
                      className="h-8 text-xs"
                    >
                      Following
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">Not following anyone yet</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Profile