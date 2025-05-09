import React from 'react'

const CommentInput = ({ 
  value, 
  onChange, 
  onSubmit 
}) => {
  return (
    <div className="flex items-center border-t border-gray-100 py-3 mt-1">
      <input
        type="text"
        placeholder="Add a comment..."
        value={value}
        onChange={onChange}
        className="outline-none text-sm w-full bg-transparent"
      />
      {value && 
        <button 
          onClick={onSubmit} 
          className="text-[#3BADF8] cursor-pointer text-sm md:text-base font-medium"
        >
          Post
        </button>
      }
    </div>
  )
}

export default CommentInput