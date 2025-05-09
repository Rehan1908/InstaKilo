import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { setMessages } from '@/redux/chatSlice'
import { toast } from 'sonner'

const useGetAllMessage = () => {
  const dispatch = useDispatch()
  const { selectedUser } = useSelector(store => store.auth)
  
  useEffect(() => {
    // Only fetch messages if we have a selected user
    if (!selectedUser?._id) {
      console.log("No selected user, skipping message fetch")
      return
    }

    console.log("Fetching messages for user:", selectedUser._id)
    
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/message/all/${selectedUser._id}`, { // CORRECTED
          withCredentials: true
        })
        
        if (res.data.success) {
          console.log("Messages fetched:", res.data.messages)
          dispatch(setMessages(res.data.messages))
        } else {
          console.log("API returned success: false")
          dispatch(setMessages([]))
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error)
        toast.error("Couldn't load messages")
        dispatch(setMessages([]))
      }
    }
    
    fetchMessages()
  }, [selectedUser, dispatch]) // Re-fetch when selectedUser changes
}

export default useGetAllMessage