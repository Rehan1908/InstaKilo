import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

const ChatHeader = ({ selectedUser, isOnline }) => {
  return (
    <div className="flex gap-3 items-center px-4 py-3 border-b border-gray-200 bg-white">
      <Avatar className="h-10 w-10">
        <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
        <AvatarFallback>{selectedUser?.username?.[0]?.toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="font-medium">{selectedUser?.username}</span>
        <span className="text-xs text-gray-500">
          {isOnline ? 'Active now' : 'Offline'}
        </span>
      </div>
    </div>
  )
}

export default ChatHeader