import React, { useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetAllMessage from '@/hooks/useGetAllMessage'
import useGetRTM from '@/hooks/useGetRTM'

const Messages = ({ selectedUser }) => {
  useGetRTM()
  useGetAllMessage()
  const { messages } = useSelector(store => store.chat)
  const { user } = useSelector(store => store.auth)

  // Add this ref for scrolling to bottom
  const messagesEndRef = useRef(null)
  
  // Add this effect to auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Render empty state if there are no messages
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 px-4">
        No messages yet. Start a conversation!
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Selected User Header */}
      <div className="flex flex-col items-center justify-center p-4 border-b border-gray-200">
        <Avatar className="h-20 w-20">
          <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className="mt-2 text-lg font-semibold">{selectedUser?.username}</span>
        <Link to={`/profile/${selectedUser?._id}`}>
          <Button variant="secondary" className="mt-2 h-8 text-sm">
            View profile
          </Button>
        </Link>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          // Skip undefined messages
          if (!message) return null

          // Check if message is from current user
          const isOwnMessage = message?.senderId === user?._id

          return (
            <div
              key={message?._id || index}
              className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-[80%] break-words shadow-sm 
                  ${isOwnMessage 
                    ? "bg-blue-500 text-white rounded-br-none" 
                    : "bg-gray-200 text-gray-900 rounded-bl-none"}`}
              >
                {message?.message}  {/* Changed from message?.text to message?.message */}
              </div>
            </div>
          )
        })}
        {/* Add this at the end of the messages list */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

export default Messages