import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa"
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Badge } from './ui/badge'

const Post = ({ post }) => {
  const [text, setText] = useState("")
  const [open, setOpen] = useState(false)
  const { user } = useSelector(store => store.auth)
  const { posts } = useSelector(store => store.post)
  const [liked, setLiked] = useState(post.likes.includes(user?._id))
  const [postLike, setPostLike] = useState(post.likes.length)
  const [comment, setComment] = useState(post.comments)
  const dispatch = useDispatch()

  const changeEventHandler = (e) => {
    const inputText = e.target.value
    setText(inputText.trim() ? inputText : "")
  }

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? 'dislike' : 'like'
      const res = await axios.get(`http://localhost:3000/api/v1/post/${post._id}/${action}`, { withCredentials: true })
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1
        setPostLike(updatedLikes)
        setLiked(!liked)

        const updatedPostData = posts.map(p =>
          p._id === post._id ? {
            ...p,
            likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
          } : p
        )
        dispatch(setPosts(updatedPostData))
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const commentHandler = async () => {
    try {
      const res = await axios.post(`http://localhost:3000/api/v1/post/${post._id}/comment`, { text }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      })
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment]
        setComment(updatedCommentData)

        const updatedPostData = posts.map(p =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        )
        dispatch(setPosts(updatedPostData))
        toast.success(res.data.message)
        setText("")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(`http://localhost:3000/api/v1/post/delete/${post?._id}`, { withCredentials: true })
      if (res.data.success) {
        const updatedPostData = posts.filter(postItem => postItem?._id !== post?._id)
        dispatch(setPosts(updatedPostData))
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/v1/post/${post?._id}/bookmark`, { withCredentials: true })
      if (res.data.success) {
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <div className="my-6 md:my-8 w-full max-w-full sm:max-w-md md:max-w-lg mx-auto border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
      {/* Post Header */}
      <div className="flex items-center justify-between px-3 py-3 md:px-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 md:h-10 md:w-10">
            <AvatarImage src={post.author?.profilePicture} alt={post.author?.username} />
            <AvatarFallback>{post.author?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <h1 className="font-medium text-sm md:text-base truncate max-w-[120px] md:max-w-[180px]">
              {post.author?.username}
            </h1>
            {user?._id === post.author._id && 
              <Badge variant="secondary" className="text-xs">Author</Badge>
            }
          </div>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            {post?.author?._id !== user?._id && 
              <Button variant="ghost" className="cursor-pointer w-fit text-[#ED4956] font-bold">
                Unfollow
              </Button>
            }
            <Button variant="ghost" className="cursor-pointer w-fit">Add to favorites</Button>
            {user && user?._id === post?.author._id && 
              <Button onClick={deletePostHandler} variant="ghost" className="cursor-pointer w-fit text-red-500">
                Delete
              </Button>
            }
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Post Image */}
      <div className="relative w-full aspect-square bg-gray-100">
        <img
          className="w-full h-full object-cover"
          src={post.image}
          alt={`${post.author?.username}'s post`}
          onError={(e) => {
            e.target.onerror = null
            e.target.src = 'https://placehold.co/600x600?text=Image+Not+Found'
          }}
        />
      </div>

      {/* Post Actions */}
      <div className="px-3 md:px-4 pt-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            {liked ? 
              <FaHeart onClick={likeOrDislikeHandler} size={24} className="cursor-pointer text-red-600" /> : 
              <FaRegHeart onClick={likeOrDislikeHandler} size={22} className="cursor-pointer hover:text-gray-600" />
            }
            <MessageCircle 
              onClick={() => {
                dispatch(setSelectedPost(post))
                setOpen(true)
              }} 
              size={22}
              className="cursor-pointer hover:text-gray-600" 
            />
            <Send size={22} className="cursor-pointer hover:text-gray-600" />
          </div>
          <Bookmark onClick={bookmarkHandler} size={22} className="cursor-pointer hover:text-gray-600" />
        </div>
        
        {/* Like Count */}
        <span className="font-medium text-sm md:text-base block mb-1">{postLike} likes</span>
        
        {/* Caption */}
        <div className="mb-1.5 text-sm md:text-base">
          <span className="font-medium mr-2">{post.author?.username}</span>
          <span className="break-words">{post.caption}</span>
        </div>
        
        {/* Comments */}
        {comment.length > 0 && (
          <button 
            onClick={() => {
              dispatch(setSelectedPost(post))
              setOpen(true)
            }} 
            className="text-xs md:text-sm text-gray-500 hover:text-gray-700 mb-2 block"
          >
            View all {comment.length} comments
          </button>
        )}
        
        <CommentDialog open={open} setOpen={setOpen} />
        
        {/* Comment Input */}
        <div className="flex items-center border-t border-gray-100 py-3 mt-1">
          <input
            type="text"
            placeholder="Add a comment..."
            value={text}
            onChange={changeEventHandler}
            className="outline-none text-sm w-full bg-transparent"
          />
          {text && 
            <button 
              onClick={commentHandler} 
              className="text-[#3BADF8] cursor-pointer text-sm md:text-base font-medium"
            >
              Post
            </button>
          }
        </div>
      </div>
    </div>
  )
}

export default Post