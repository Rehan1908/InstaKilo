import React, { useState, useEffect } from 'react'
import { Dialog } from '../ui/dialog'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import CommentDialog from '../CommentDialog'

import PostHeader from './PostHeader'
import PostImage from './PostImage'
import PostActions from './PostActions'
import PostContent from './PostContent'
import CommentInput from './CommentInput'
import PostOptionsMenu from './PostOptionsMenu'

const Post = ({ post }) => {
  const [text, setText] = useState("")
  const [open, setOpen] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [liked, setLiked] = useState(false) // Initialize with default values
  const [postLike, setPostLike] = useState(0) // Initialize with default values  
  const [comment, setComment] = useState([]) // Initialize with default values
  
  const { user } = useSelector(store => store.auth)
  const { posts } = useSelector(store => store.post)
  const dispatch = useDispatch()

  // Early return for undefined post
  if (!post) {
    return <div className="my-6 md:my-8 w-full max-w-full sm:max-w-md md:max-w-lg mx-auto p-4 text-center text-gray-500 border border-gray-200 rounded-md bg-white">
      Post not available
    </div>
  }
  
  // Move the state updates that depend on post data into useEffect
  useEffect(() => {
    if (post) {
      setLiked(post.likes?.includes(user?._id) || false)
      setPostLike(post.likes?.length || 0)
      setComment(post.comments || [])
    }
  }, [post, user?._id])
  
  const isAuthor = user?._id === post?.author?._id

  const changeEventHandler = (e) => {
    const inputText = e.target.value
    setText(inputText.trim() ? inputText : "")
  }

  const likeOrDislikeHandler = async () => {
    if (!post?._id) return; // Add safety check
    
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
      toast.error("Failed to update like status")
    }
  }

  const commentHandler = async () => {
    if (!post?._id) return;
    
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
      toast.error("Failed to add comment")
    }
  }

  const deletePostHandler = async () => {
    if (!post?._id) return;
    
    try {
      const res = await axios.delete(`http://localhost:3000/api/v1/post/delete/${post?._id}`, { withCredentials: true })
      if (res.data.success) {
        const updatedPostData = posts.filter(postItem => postItem?._id !== post?._id)
        dispatch(setPosts(updatedPostData))
        toast.success(res.data.message)
        setShowOptions(false)
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Failed to delete post")
    }
  }

  const bookmarkHandler = async () => {
    if (!post?._id) return;
    
    try {
      const res = await axios.get(`http://localhost:3000/api/v1/post/${post?._id}/bookmark`, { withCredentials: true })
      if (res.data.success) {
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to bookmark post")
    }
  }
  
  const openComments = () => {
    dispatch(setSelectedPost(post))
    setOpen(true)
  }

  const shareHandler = () => {
    toast.info("Sharing coming soon")
  }
  
  return (
    <div className="my-6 md:my-8 w-full max-w-full sm:max-w-md md:max-w-lg mx-auto border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
      <Dialog open={showOptions} onOpenChange={setShowOptions}>
        <PostHeader 
          author={post?.author} 
          isAuthor={isAuthor} 
          onOpenOptions={() => setShowOptions(true)} 
        />
        <PostOptionsMenu 
          isAuthor={isAuthor}
          onUnfollow={() => toast.info("Unfollow coming soon")}
          onAddToFavorites={() => toast.info("Add to favorites coming soon")}
          onDelete={deletePostHandler}
        />
      </Dialog>
      
      <PostImage 
        image={post?.image} 
        alt={`${post?.author?.username}'s post`} 
      />

      <div className="px-3 md:px-4 pt-3">
        <PostActions 
          liked={liked}
          onLikeToggle={likeOrDislikeHandler}
          onCommentClick={openComments}
          onShareClick={shareHandler}
          onBookmarkClick={bookmarkHandler}
        />
        
        <PostContent 
          likesCount={postLike}
          author={post?.author}
          caption={post?.caption}
          commentsCount={comment.length}
          onViewComments={openComments}
        />
        
        <CommentDialog open={open} setOpen={setOpen} />
        
        <CommentInput 
          value={text}
          onChange={changeEventHandler}
          onSubmit={commentHandler}
        />
      </div>
    </div>
  )
}

export default Post