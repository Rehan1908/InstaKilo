import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { MoreHorizontal } from 'lucide-react'
import { Badge } from '../ui/badge'
import { DialogTrigger } from '../ui/dialog'
import { Link } from 'react-router-dom'

const PostHeader = ({ author, isAuthor, onOpenOptions }) => {
  return (
    <div className="flex items-center justify-between px-3 py-3 md:px-4">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${author?._id}`}>
          <Avatar className="h-8 w-8 md:h-10 md:w-10">
            <AvatarImage src={author?.profilePicture} alt={author?.username} />
            <AvatarFallback>{author?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex items-center gap-2">
          <Link to={`/profile/${author?._id}`} className="hover:underline">
            <h1 className="font-medium text-sm md:text-base truncate max-w-[120px] md:max-w-[180px]">
              {author?.username}
            </h1>
          </Link>
          {isAuthor && 
            <Badge variant="secondary" className="text-xs">Author</Badge>
          }
        </div>
      </div>
      
      <DialogTrigger asChild onClick={onOpenOptions}>
        <MoreHorizontal className="cursor-pointer" />
      </DialogTrigger>
    </div>
  )
}

export default PostHeader