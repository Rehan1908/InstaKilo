import React from 'react'
import { DialogContent } from '../ui/dialog'
import { Button } from '../ui/button'

const PostOptionsMenu = ({ 
  isAuthor, 
  onUnfollow, 
  onAddToFavorites, 
  onDelete 
}) => {
  return (
    <DialogContent className="flex flex-col items-center text-sm text-center">
      {!isAuthor && 
        <Button 
          variant="ghost" 
          onClick={onUnfollow}
          className="cursor-pointer w-fit text-[#ED4956] font-bold"
        >
          Unfollow
        </Button>
      }
      <Button 
        variant="ghost" 
        onClick={onAddToFavorites}
        className="cursor-pointer w-fit"
      >
        Add to favorites
      </Button>
      {isAuthor && 
        <Button 
          onClick={onDelete} 
          variant="ghost" 
          className="cursor-pointer w-fit text-red-500"
        >
          Delete
        </Button>
      }
    </DialogContent>
  )
}

export default PostOptionsMenu