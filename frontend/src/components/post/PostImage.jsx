import React from 'react'

const PostImage = ({ image, alt }) => {
  return (
    <div className="relative w-full aspect-square bg-gray-100">
      <img
        className="w-full h-full object-cover"
        src={image}
        alt={alt || 'Post image'}
        onError={(e) => {
          e.target.onerror = null
          e.target.src = 'https://placehold.co/600x600?text=Image+Not+Found'
        }}
      />
    </div>
  )
}

export default PostImage