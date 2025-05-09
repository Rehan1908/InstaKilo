import React from 'react'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'

const UserListItem = ({ 
  user, 
  currentUser, 
  isLoggedInUserProfile,
  onClose,
  buttonText = 'Follow'
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link to={`/profile/${user._id}`} onClick={onClose}>
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.profilePicture} alt={user.username} />
            <AvatarFallback>{user.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="overflow-hidden">
          <Link 
            to={`/profile/${user._id}`} 
            className="font-semibold text-sm hover:underline"
            onClick={onClose}
          >
            {user.username}
          </Link>
          <p className="text-gray-500 text-xs truncate">{user.bio || "Bio here..."}</p>
        </div>
      </div>
      {!isLoggedInUserProfile && user._id !== currentUser?._id && (
        <Button 
          variant="secondary" 
          className="h-8 text-xs"
        >
          {buttonText}
        </Button>
      )}
    </div>
  )
}

export default UserListItem