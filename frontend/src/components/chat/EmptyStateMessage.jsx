import React from 'react'
import { MessageCircleCode } from 'lucide-react'

const EmptyStateMessage = () => {
  return (
    <section className="flex-1 flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-xs">
        <MessageCircleCode className="w-24 h-24 mx-auto text-gray-300 mb-4" />
        <h2 className="font-medium text-xl mb-2">Your messages</h2>
        <p className="text-gray-500 mb-4">Select a chat or start a new conversation</p>
      </div>
    </section>
  )
}

export default EmptyStateMessage