import React from 'react'
import { useChatStore } from '../../stores/chatStore'
import { X, Info } from 'lucide-react';

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  if (!selectedUser) {
    return(
      <div className='hidden'></div>
    )
  }

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">

          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || '/avatar.png'} alt={`${selectedUser.username}'s Avatar`} />
            </div>
          </div>

          <div>
            <h3 className="font-medium">{selectedUser.fullname}</h3>
            <p className="text-sm text-base-content/70">
              Offline
            </p>
          </div>
        </div>

        <div className='flex gap-4'>
          <button className='cursor-pointer' onClick={() => setSelectedUser(null)}>
            <Info />
          </button>
          <button className='cursor-pointer' onClick={() => setSelectedUser(null)}>
            <X />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader