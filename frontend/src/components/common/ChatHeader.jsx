import React from 'react'
import { getChatName, getChatPic, getMessagePreview } from '../../utils/chat'
import { useChatStore } from '../../stores/chatStore'
import { X, Info } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';
import { useOnlineStore } from '../../stores/onlineStore';
import { formatChatTimeStamp } from '../../utils/date';

const ChatHeader = () => {
  const { lastSeen, isUserOnline } = useOnlineStore();
  const { selectedUser, setSelectedUser } = useUserStore();
  const { selectedChat, setSelectedChat } = useChatStore();
  const { authUser } = useAuthStore();

  const setOnlineUserStatus = (user) => {
    if (isUserOnline(user._id)) {
      return (
        <span className='text-success'>Online</span>
      );
    } else {
      return (
        <span>Last seen {formatChatTimeStamp(lastSeen[user._id] || user.lastSeen)}</span>
      );
    }
  };

  const setOnlineChatStatus = (chat) => {
    //console.log(chat, typeof chat);
    if (!chat.isGroupChat) {
      const checkUser = chat.users.find(user => user._id !== authUser._id);
      if(isUserOnline(checkUser._id)) {
        return (
          <span className='text-success'>Online</span>
        );
      } else {
        return (
          <span>Last seen {formatChatTimeStamp(lastSeen[checkUser._id] || checkUser.lastSeen)}</span>
        );
      }
    } else {
      let onlineCount = 0;
      for (const user of chat.users) {
        if (isUserOnline(user._id)) onlineCount++;
      }
      return (
        <span>Members online: {onlineCount}</span>
      );
    }
  };

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
              <h3 className="font-medium">{selectedUser.username}</h3>
              <p className="text-sm text-base-content/70">
                {setOnlineUserStatus(selectedUser)}
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
              <p className="text-sm text-gray-400">
                {setOnlineChatStatus(selectedChat)}
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