import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Send } from 'lucide-react'

const MessageInput = ({ 
  value, 
  onChange, 
  onSend, 
  onKeyDown,
  disabled = false
}) => {
  return (
    <div className="p-3 border-t border-gray-200 bg-white">
      <div className="flex items-center bg-gray-100 rounded-full pl-4 pr-2 py-1">
        <Input
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          type="text"
          className="flex-1 border-none focus-visible:ring-0 bg-transparent text-sm"
          placeholder="Type a message..."
          disabled={disabled}
        />
        <Button
          onClick={onSend}
          disabled={!value.trim() || disabled}
          size="sm"
          className="rounded-full h-8 w-8 p-0 ml-1"
        >
          <Send size={16} />
        </Button>
      </div>
    </div>
  )
}

export default MessageInput