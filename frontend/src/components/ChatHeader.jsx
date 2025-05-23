import React from 'react'
import { useChatStore } from '../stores/chatStore';
import { useUserStore } from '../stores/userStore';
import { useAuthStore } from '../stores/authStore';
import { formatChatTimeStamp } from '../utils/date';
import { X, Info } from 'lucide-react';

const ChatHeader = () => {
    const { authUser, isUserOnline, lastSeen } = useAuthStore();
    const { chats, selectedChat, setSelectedChat, toggleInfoBox } = useChatStore();
    const { selectedUser, setSelectedUser } = useUserStore();

    const getHeaderPic = () => {
        if(selectedUser) return selectedUser.profilePic;
        if (selectedChat) {
            if (selectedChat.isGroupChat) {
                const targetChat = chats.find((chat) => chat._id === selectedChat._id);
                return targetChat.groupPic || selectedChat.groupPic;
            }
            return selectedChat.users.find(user => user._id != authUser._id).profilePic;
        }
    };

    const getHeaderName = () => {
        if (selectedUser) return selectedUser.username;
        if (selectedChat && selectedChat.isGroupChat) {
            const targetChat = chats.find((chat) => chat._id === selectedChat._id);
            return targetChat.groupName || selectedChat.groupName
        };
        return selectedChat.users.find(user => user._id != authUser._id).username;
    };

    const getHeaderOnlineStatus = () => {
        if (selectedUser) {
            const status = isUserOnline(selectedUser._id) 
                ? <p className='text-xs text-success'>Online</p> 
                : <p className='text-xs text-accent'>{`Last seen ${formatChatTimeStamp(lastSeen[selectedUser._id] || selectedUser.lastSeen)}`}</p>;
            return status;
        }
        if (selectedChat && selectedChat.isGroupChat) {
            let onlineCounter = 0;
            for(const user of selectedChat.users) {
                if (isUserOnline(user._id)) onlineCounter ++;
            }
            return(<p className='text-xs text-accent'>Online users: {onlineCounter}</p>);
        }
        const userToCheck = selectedChat.users.find(user => user._id != authUser._id);
        const status = isUserOnline(userToCheck._id) 
            ? <p className='text-sm text-success'>Online</p> 
            : <p className='text-xs text-accent'>{`Last seen ${formatChatTimeStamp(lastSeen[userToCheck._id] || userToCheck.lastSeen)}`}</p>;
        return status;
    };

    return (
      <div className='h-[71px] px-3 border-base-300 border-b flex items-center justify-between'>
          <div className='flex items-center gap-2'>
              <div className="avatar">
                  <div className="size-10 rounded-full relative">
                  <img src={getHeaderPic()} alt={`${selectedUser?.username || selectedChat?.groupName}'s Avatar`} />
                  </div>
              </div>
              <div>
                <h3 className="font-medium">{getHeaderName()}</h3>
                {getHeaderOnlineStatus()}
              </div>
          </div>

          <div className='flex gap-4'>
            {selectedChat && (
                <button className='cursor-pointer' onClick={() => toggleInfoBox()}>
                    <Info />
                </button>
            )}
            <button className='cursor-pointer' onClick={() => {setSelectedChat(null); setSelectedUser(null)}}>
              <X />
            </button>
          </div>
      </div>
    )
}

export default ChatHeader