import React from 'react'
import Posts from './Posts'

const Feed = () => {
  return (
    <div className="flex-1 my-8 flex flex-col items-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl">
        <Posts />
      </div>
    </div>
  )
}

export default Feed