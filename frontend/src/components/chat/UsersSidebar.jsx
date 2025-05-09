import React from 'react'
import UserItem from './UserItem'

const UsersSidebar = ({ 
  currentUser, 
  suggestedUsers, 
  onlineUsers, 
  selectedUser,
  onSelectUser
}) => {
  return (
    <section className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 h-full overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="font-bold text-xl flex items-center gap-2">
          {currentUser?.username}
          <span className="text-sm font-normal text-gray-500">Messages</span>
        </h1>
      </div>

      <div className="flex-grow overflow-y-auto">
        {suggestedUsers.length > 0 ? (
          suggestedUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id)
            const isActive = selectedUser?._id === suggestedUser?._id

            return (
              <UserItem 
                key={suggestedUser._id}
                user={suggestedUser}
                isOnline={isOnline}
                isActive={isActive}
                onSelect={onSelectUser}
              />
            )
          })
        ) : (
          <div className="p-4 text-center text-gray-500">No users available</div>
        )}
      </div>
    </section>
  )
}

export default UsersSidebar