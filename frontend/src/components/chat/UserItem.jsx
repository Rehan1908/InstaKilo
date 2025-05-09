import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

const UserItem = ({ 
  user, 
  isOnline, 
  isActive, 
  onSelect 
}) => {
  return (
    <div
      onClick={() => onSelect(user)}
      className={`flex gap-3 items-center p-4 cursor-pointer transition-colors
        ${isActive ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
    >
      <div className="relative">
        <Avatar className="w-12 h-12">
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
        )}
      </div>
      <div className="flex flex-col overflow-hidden">
        <span className="font-medium truncate">{user?.username}</span>
        <span className={`text-xs ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
          {isOnline ? 'Active now' : 'Offline'}
        </span>
      </div>
    </div>
  )
}

export default UserItem