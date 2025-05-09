import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import Comment from './Comment'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts } from '@/redux/postSlice'

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("")
  const { selectedPost, posts } = useSelector(store => store.post)
  const [comment, setComment] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost?.comments || [])
    }
  }, [selectedPost])

  const changeEventHandler = (e) => {
    const inputText = e.target.value
    setText(inputText.trim() ? inputText : "")
  }

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/post/${selectedPost?._id}/comment`, { text }, { // CORRECTED
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      })

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment]
        setComment(updatedCommentData)

        const updatedPostData = posts.map(p =>
          p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
        )
        dispatch(setPosts(updatedPostData))
        toast.success(res.data.message)
        setText("")
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to post comment")
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && text.trim()) {
      e.preventDefault()
      sendMessageHandler()
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent 
        onInteractOutside={() => setOpen(false)}
        className="max-w-5xl p-0 flex flex-col sm:max-h-[90vh] max-h-[95vh] rounded-lg overflow-hidden"
      >
        <div className="flex flex-col md:flex-row h-full">
          {/* Image Section */}
          <div className="w-full md:w-1/2 bg-black flex items-center justify-center max-h-[50vh] md:max-h-full">
            <img
              src={selectedPost?.image}
              alt={`Post by ${selectedPost?.author?.username}`}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = 'https://placehold.co/600x600?text=Image+Not+Available'
              }}
            />
          </div>

          {/* Comments Section */}
          <div className="w-full md:w-1/2 flex flex-col h-full max-h-[60vh] md:max-h-full">
            {/* Author Header */}
            <div className="flex items-center justify-between p-3 md:p-4 border-b">
              <div className="flex items-center gap-3">
                <Link to={`/profile/${selectedPost?.author?._id}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedPost?.author?.profilePicture} />
                    <AvatarFallback>{selectedPost?.author?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link to={`/profile/${selectedPost?.author?._id}`} className="font-semibold text-sm hover:underline">
                    {selectedPost?.author?.username}
                  </Link>
                </div>
              </div>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-3 md:p-4 bg-white">
              {selectedPost?.caption && (
                <div className="pb-3 border-b border-gray-100 mb-2">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={selectedPost?.author?.profilePicture} />
                      <AvatarFallback>{selectedPost?.author?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <div className="text-sm break-words">
                        <span className="font-medium mr-2">{selectedPost?.author?.username}</span>
                        <span className="text-gray-900">{selectedPost?.caption}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {comment && comment.length > 0 ? (
                comment.map((c) => <Comment key={c._id} comment={c} />)
              ) : (
                <div className="text-center py-6 text-gray-500 text-sm">
                  No comments yet. Be the first to comment!
                </div>
              )}
            </div>

            {/* Comment Input */}
            <div className="p-3 md:p-4 border-t">
              <div className="flex items-center gap-2 bg-gray-100 rounded-full pl-4 pr-2 py-1">
                <input 
                  type="text"
                  value={text}
                  onChange={changeEventHandler}
                  onKeyDown={handleKeyDown}
                  placeholder="Add a comment..."
                  className="w-full outline-none bg-transparent text-sm"
                />
                <Button 
                  disabled={!text.trim()}
                  onClick={sendMessageHandler}
                  size="sm"
                  className="rounded-full h-8 w-8 p-0"
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CommentDialog