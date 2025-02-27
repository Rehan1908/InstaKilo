import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { MessageCircleCode, Send } from 'lucide-react'
import Messages from './Messages'
import axios from 'axios'
import { setMessages, setOnlineUsers } from '@/redux/chatSlice'
import { setSelectedUser } from '@/redux/authSlice'
import { getSocket } from '../services/socketService'
import { useParams } from 'react-router-dom'

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState("")
  const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth)
  const { onlineUsers, messages } = useSelector(store => store.chat)
  const dispatch = useDispatch()
  const { userId } = useParams()

  const sendMessageHandler = async (receiverId) => {
    if (!textMessage.trim()) return;
    try {
      const res = await axios.post(`http://localhost:3000/api/v1/message/send/${receiverId}`, { textMessage }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]))
        setTextMessage("")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && selectedUser) {
      e.preventDefault()
      sendMessageHandler(selectedUser?._id)
    }
  }

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

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null))
    }
  }, [dispatch])

  useEffect(() => {
    const fetchUserFromParams = async () => {
      // Check if we have a userId in the URL and no selected user yet
      if (userId && (!selectedUser || selectedUser._id !== userId)) {
        console.log("Loading user from URL params:", userId)
        
        try {
          // Try to find user in suggested users first
          const userFromList = suggestedUsers.find(u => u._id === userId)
          
          if (userFromList) {
            console.log("Found user in suggested list:", userFromList.username)
            dispatch(setSelectedUser(userFromList))
          } else {
            // Fetch user if not in list
            const res = await axios.get(`http://localhost:3000/api/v1/user/${userId}`, {
              withCredentials: true
            })
            
            if (res.data.success) {
              console.log("Fetched user:", res.data.user.username)
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
      <section className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 h-full overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="font-bold text-xl flex items-center gap-2">
            {user?.username}
            <span className="text-sm font-normal text-gray-500">Messages</span>
          </h1>
        </div>

        {/* User List */}
        <div className="flex-grow overflow-y-auto">
          {suggestedUsers.length > 0 ? (
            suggestedUsers.map((suggestedUser) => {
              const isOnline = onlineUsers.includes(suggestedUser?._id)
              const isActive = selectedUser?._id === suggestedUser?._id

              return (
                <div
                  key={suggestedUser._id}
                  onClick={() => dispatch(setSelectedUser(suggestedUser))}
                  className={`flex gap-3 items-center p-4 cursor-pointer transition-colors
                    ${isActive ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={suggestedUser?.profilePicture} />
                      <AvatarFallback>{suggestedUser?.username?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-medium truncate">{suggestedUser?.username}</span>
                    <span className={`text-xs ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                      {isOnline ? 'Active now' : 'Offline'}
                    </span>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="p-4 text-center text-gray-500">No users available</div>
          )}
        </div>
      </section>

      {/* Chat Area */}
      {selectedUser ? (
        <section className="flex-1 flex flex-col h-full">
          {/* Chat Header */}
          <div className="flex gap-3 items-center px-4 py-3 border-b border-gray-200 bg-white">
            <Avatar className="h-10 w-10">
              <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
              <AvatarFallback>{selectedUser?.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{selectedUser?.username}</span>
              <span className="text-xs text-gray-500">
                {onlineUsers.includes(selectedUser?._id) ? 'Active now' : 'Offline'}
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            <Messages selectedUser={selectedUser} />
          </div>

          {/* Message Input */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex items-center bg-gray-100 rounded-full pl-4 pr-2 py-1">
              <Input
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                type="text"
                className="flex-1 border-none focus-visible:ring-0 bg-transparent text-sm"
                placeholder="Type a message..."
              />
              <Button
                onClick={() => sendMessageHandler(selectedUser?._id)}
                disabled={!textMessage.trim()}
                size="sm"
                className="rounded-full h-8 w-8 p-0 ml-1"
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        </section>
      ) : (
        <section className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <div className="max-w-xs">
            <MessageCircleCode className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <h2 className="font-medium text-xl mb-2">Your messages</h2>
            <p className="text-gray-500 mb-4">Select a chat or start a new conversation</p>
          </div>
        </section>
      )}
    </div>
  )
}

export default ChatPage