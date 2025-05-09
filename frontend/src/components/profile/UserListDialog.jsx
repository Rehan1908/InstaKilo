import React from 'react'
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog'
import UserListItem from './UserListItem'

const UserListDialog = ({ 
  title, 
  isOpen, 
  onOpenChange, 
  users, 
  isLoading, 
  emptyMessage,
  currentUser,
  isLoggedInUserProfile,
  buttonText
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>{title}</DialogTitle>
        <div className="max-h-[70vh] overflow-y-auto space-y-4 py-4">
          {isLoading ? (
            <div className="flex justify-center py-8">Loading...</div>
          ) : users.length > 0 ? (
            users.map((user) => (
              <UserListItem 
                key={user._id}
                user={user}
                currentUser={currentUser}
                isLoggedInUserProfile={isLoggedInUserProfile}
                onClose={() => onOpenChange(false)}
                buttonText={buttonText}
              />
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">{emptyMessage}</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UserListDialog