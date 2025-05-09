import React from 'react'
import { MessageCircle, Send, Bookmark } from 'lucide-react'
import { FaHeart, FaRegHeart } from "react-icons/fa"

const PostActions = ({ 
  liked, 
  onLikeToggle, 
  onCommentClick, 
  onShareClick, 
  onBookmarkClick 
}) => {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-4">
        {liked ? 
          <FaHeart 
            onClick={onLikeToggle} 
            size={24} 
            className="cursor-pointer text-red-600" 
          /> : 
          <FaRegHeart 
            onClick={onLikeToggle} 
            size={22} 
            className="cursor-pointer hover:text-gray-600" 
          />
        }
        <MessageCircle 
          onClick={onCommentClick}
          size={22}
          className="cursor-pointer hover:text-gray-600" 
        />
        <Send 
          onClick={onShareClick}
          size={22} 
          className="cursor-pointer hover:text-gray-600" 
        />
      </div>
      <Bookmark 
        onClick={onBookmarkClick} 
        size={22} 
        className="cursor-pointer hover:text-gray-600" 
      />
    </div>
  )
}

export default PostActions