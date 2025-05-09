import React from 'react'
import { Link } from 'react-router-dom'

const PostContent = ({ 
  likesCount, 
  author, 
  caption, 
  commentsCount, 
  onViewComments 
}) => {
  return (
    <div>
      {/* Like Count */}
      <span className="font-medium text-sm md:text-base block mb-1">
        {likesCount} likes
      </span>
      
      {/* Caption */}
      <div className="mb-1.5 text-sm md:text-base">
        <Link to={`/profile/${author?._id}`} className="hover:underline">
          <span className="font-medium mr-2">{author?.username}</span>
        </Link>
        <span className="break-words">{caption}</span>
      </div>
      
      {/* Comments */}
      {commentsCount > 0 && (
        <button 
          onClick={onViewComments} 
          className="text-xs md:text-sm text-gray-500 hover:text-gray-700 mb-2 block"
        >
          View all {commentsCount} comments
        </button>
      )}
    </div>
  )
}

export default PostContent