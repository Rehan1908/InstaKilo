import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

const Posts = () => {
  const { posts } = useSelector(store => store.post)
  
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
      {posts.map(post => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  )
}

export default Posts