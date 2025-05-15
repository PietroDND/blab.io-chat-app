import React from 'react'
import { getChatName, getChatPic, getMessagePreview } from '../../utils/chat'
import { useChatStore } from '../../stores/chatStore'
import { X, Info } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useUserStore();
  const { selectedChat, setSelectedChat } = useChatStore();
  const { authUser } = useAuthStore();

  if (selectedUser && !selectedChat){
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
                {selectedUser.isOnline ? 'Online' : 'Offline'}
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
  } else if (!selectedUser && selectedChat) {
    return (
      <div className="p-2.5 border-b border-base-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">

            <div className="avatar">
              <div className="size-10 rounded-full relative">
                <img src={getChatPic(selectedChat, authUser)} alt={`${getChatName(selectedChat, authUser)}'s Avatar`} />
              </div>
            </div>

            <div>
              <h3 className="font-medium">{getChatName(selectedChat, authUser)}</h3>
              <p className="text-sm text-base-content/70">
                Offline
              </p>
            </div>
          </div>

          <div className='flex gap-4'>
            <button className='cursor-pointer' onClick={() => setSelectedChat(null)}>
              <Info />
            </button>
            <button className='cursor-pointer' onClick={() => setSelectedChat(null)}>
              <X />
            </button>
          </div>
        </div>
      </div>
    )
  } else {
    return(
      <div className='hidden'></div>
    );
  }
}

export default ChatHeader