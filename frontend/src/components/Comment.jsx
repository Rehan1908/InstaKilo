import React from 'react'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { formatDistanceToNow } from 'date-fns'

const Comment = ({ comment }) => {
  // Format the timestamp if available
  const formattedTime = comment?.createdAt 
    ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) 
    : '';

  return (
    <div className="py-2 group">
      <div className="flex gap-3">
        {/* Make avatar clickable and redirect to profile */}
        <Link to={`/profile/${comment?.author?._id}`}>
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={comment?.author?.profilePicture} alt="Profile" />
            <AvatarFallback>
              {comment?.author?.username?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </Link>
        
        <div className="flex-1 overflow-hidden">
          <div className="text-sm break-words">
            {/* Make username clickable and redirect to profile */}
            <Link 
              to={`/profile/${comment?.author?._id}`} 
              className="font-medium mr-2 hover:underline"
            >
              {comment?.author?.username}
            </Link>
            <span className="text-gray-900">{comment?.text}</span>
          </div>
          
          {/* Comment Metadata */}
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
            {formattedTime && <span>{formattedTime}</span>}
            <button className="hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity">
              Reply
            </button>
            <button className="hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity">
              Like
            </button>
          </div>
        </div>
        
        {/* Like Button */}
        <button className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity self-start">
          ♥
        </button>
      </div>
    </div>
  )
}

export default Comment