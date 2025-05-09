import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { setMessages, setOnlineUsers } from '@/redux/chatSlice'
import { setSelectedUser } from '@/redux/authSlice'
import { getSocket } from '@/services/socketService'

// Component imports
import UsersSidebar from './UsersSidebar'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import EmptyStateMessage from './EmptyStateMessage'
import Messages from '../Messages'

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState("")
  const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth)
  const { onlineUsers, messages } = useSelector(store => store.chat)
  const dispatch = useDispatch()
  const { userId } = useParams()

  // Handle user selection from sidebar
  const handleSelectUser = (user) => {
    dispatch(setSelectedUser(user))
  }

  // Send message handler
  const sendMessageHandler = async () => {
    if (!selectedUser || !textMessage.trim()) return;
    
    try {
      const res = await axios.post(`http://localhost:3000/api/v1/message/send/${selectedUser._id}`, 
      { textMessage }, 
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      })
      
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]))
        setTextMessage("")
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to send message")
    }
  }

  // Handle Enter key for sending message
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && selectedUser) {
      e.preventDefault()
      sendMessageHandler()
    }
  }

  // Socket.io for real-time messaging
  useEffect(() => {
    const socket = getSocket()
    if (socket) {
      socket.on('getMessage', (message) => {
        dispatch(setMessages([...messages, message]))
      })

      socket.on('getOnlineUsers', (users) => {
        dispatch(setOnlineUsers(users))
      })
    }

    return () => {
      if (socket) {
        socket.off('getMessage')
        socket.off('getOnlineUsers')
      }
    }
  }, [dispatch, messages])

  // Clear selected user on unmount
  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null))
    }
  }, [dispatch])

  // Load user from URL params
  useEffect(() => {
    const fetchUserFromParams = async () => {
      if (userId && (!selectedUser || selectedUser._id !== userId)) {
        try {
          // Try to find user in suggested users first
          const userFromList = suggestedUsers.find(u => u._id === userId)
          
          if (userFromList) {
            dispatch(setSelectedUser(userFromList))
          } else {
            // Fetch user if not in list
            const res = await axios.get(`http://localhost:3000/api/v1/user/${userId}`, {
              withCredentials: true
            })
            
            if (res.data.success) {
              dispatch(setSelectedUser(res.data.user))
            }
          }
        } catch (error) {
          console.error("Failed to load user:", error)
          toast.error("Couldn't load user information")
        }
      }
    }
    
    fetchUserFromParams()
  }, [userId, dispatch, suggestedUsers, selectedUser])

  return (
    <div className="flex flex-col md:flex-row w-full h-[calc(100vh-64px)]">
      {/* Users Sidebar */}
      <UsersSidebar
        currentUser={user}
        suggestedUsers={suggestedUsers}
        onlineUsers={onlineUsers}
        selectedUser={selectedUser}
        onSelectUser={handleSelectUser}
      />

      {/* Chat Area */}
      {selectedUser ? (
        <section className="flex-1 flex flex-col h-full">
          {/* Chat Header */}
          <ChatHeader 
            selectedUser={selectedUser}
            isOnline={onlineUsers.includes(selectedUser?._id)}
          />

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            <Messages selectedUser={selectedUser} />
          </div>

          {/* Message Input */}
          <MessageInput
            value={textMessage}
            onChange={(e) => setTextMessage(e.target.value)}
            onSend={sendMessageHandler}
            onKeyDown={handleKeyDown}
          />
        </section>
      ) : (
        <EmptyStateMessage />
      )}
    </div>
  )
}

export default ChatPage