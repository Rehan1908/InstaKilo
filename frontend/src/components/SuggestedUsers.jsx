import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector(store => store.auth)
  const [showAllUsers, setShowAllUsers] = useState(false)
  
  return (
    <>
      <div className="my-8 px-4">
        <div className="flex items-center justify-between text-sm mb-4">
          <h1 className="font-semibold text-gray-600">Suggested for you</h1>
          <span 
            onClick={() => setShowAllUsers(true)}
            className="font-medium text-blue-500 cursor-pointer hover:underline"
          >
            See All
          </span>
        </div>
        <div className="space-y-4">
          {suggestedUsers.map((user) => (
            <div key={user._id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link to={`/profile/${user?._id}`}>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.profilePicture} alt="profile" />
                    <AvatarFallback>{user?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="overflow-hidden">
                  <h1 className="font-semibold text-sm truncate">
                    <Link to={`/profile/${user?._id}`} className="hover:underline">
                      {user?.username}
                    </Link>
                  </h1>
                  <span className="text-gray-600 text-xs truncate">
                    {user?.bio || 'Bio here...'}
                  </span>
                </div>
              </div>
              <span className="text-[#3BADF8]  text-xs font-bold cursor-pointer hover:text-[#3495d6]">
                Follow
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Modal for all suggested users */}
      <Dialog open={showAllUsers} onOpenChange={setShowAllUsers}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Suggested for you</DialogTitle>
          <div className="max-h-[70vh] overflow-y-auto space-y-4 py-4">
            {suggestedUsers.map((user) => (
              <div key={user._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link to={`/profile/${user?._id}`}>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.profilePicture} alt="profile" />
                      <AvatarFallback>{user?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="overflow-hidden">
                    <h1 className="font-semibold text-sm truncate">
                      <Link to={`/profile/${user?._id}`} className="hover:underline">
                        {user?.username}
                      </Link>
                    </h1>
                    <span className="text-gray-600 text-xs truncate">
                      {user?.bio || 'Bio here...'}
                    </span>
                  </div>
                </div>
                <span className="text-[#3BADF8]  text-xs font-bold cursor-pointer hover:text-[#3495d6]">
                  Follow
                </span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SuggestedUsers