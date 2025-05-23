import React from 'react'
import { useAuthStore } from '../stores/authStore'
import { useChatStore } from '../stores/chatStore';
import { useUserStore } from '../stores/userStore';
import { Users, MessageSquareText, Image, MessageSquarePlus } from 'lucide-react'
import { formatChatTimeStamp } from '../utils/date';
import SidebarSkeleton from './skeletons/SidebarSkeleton'
import CreateGroupChatBtn from './shared/CreateGroupChatBtn';

const Sidebar = () => {
  const { authUser, isUserOnline } = useAuthStore();
  const { chats, selectedChat, setSelectedChat, latestMessages, isChatsLoading, getUnreadCount } = useChatStore();
  const { users, selectedUser, setSelectedUser, isUsersLoading } = useUserStore();

  const userSelection = (user) => {
    setSelectedUser(user);
    const existingChat = chats.find((chat) => {
      if (chat.isGroupChat) return false;
      const userIds = chat.users.map(user => user._id);
      return userIds.includes(authUser._id) && userIds.includes(user._id) && userIds.length === 2;
    });

    if (existingChat) {
      setSelectedChat(existingChat);
    } else {
      setSelectedChat(null);
    }
  };

  const getLatestMessage = (chat) => {
    if (!chat || !latestMessages[chat?._id]) return;

    if (latestMessages[chat._id].image) {
      if (latestMessages[chat._id].text) {
        return(
          <div className='flex gap-0.5 items-center'>
            <Image className='size-4.5'/>
            <span>{latestMessages[chat._id].text || chat.latestMessage.text}</span>
          </div>
        );
      } else {
        return(
          <div className='flex gap-0.5 items-center'>
            <Image className='size-4.5'/>
            <span>Picture</span>
          </div>
        );
      }
    } else {
      return latestMessages[chat._id].text || chat.latestMessage.text;
    }
  }

  if(isUsersLoading || isChatsLoading) {
    return(
      <SidebarSkeleton />
    )
  }

  return (
    <aside className='h-full w-20 lg:w-75 border-r border-base-300 flex flex-col transition-all duration-200'>
      <div className="join join-vertical bg-base-100">
        <div className="collapse collapse-arrow join-item border-base-300 border-b">
          <input type="radio" name="my-accordion-4" defaultChecked />
          <div className="collapse-title flex items-center gap-2 h-[70px]">
            <Users className="size-5" />
            <span className="hidden lg:block">Contacts</span>
          </div>
          <div className="collapse-content">
            {users.map((user) => (
              <button
                key={user._id}
                onClick={() => userSelection(user)}
                className={`w-full py-2 lg:p-3 flex items-center gap-3 hover:bg-base-300 transition-colors mb-1 cursor-pointer ${selectedUser?._id === user._id ? 'bg-base-300 ring-1 ring-base-300' : ''}
              `}
              >
                <div className='relative'>
                  <img 
                    src={user.profilePic || '/avatar.png'} 
                    alt={`${user.username} Avatar`}
                    className='size-12 object-cover rounded-lg'
                  />
                  <div aria-label="success" className={`${isUserOnline(user._id) ? 'inline-block' : 'hidden'} bg-green-400 rounded-full size-3 absolute -right-1 -bottom-1`}></div>
                </div>
                {/* User Info */}
                <div className='hidden lg:block text-left flex-1 max-h-12 max-w-[73%]'>
                  <div className='flex justify-between'>
                    <div className='font-medium truncate'>{user.username}</div>
                  </div>
                  <div className='text-sm h-6 truncate text-accent'>{user.fullname}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="collapse collapse-arrow join-item border-base-300 max-h-[90%]">
          <input type="radio" name="my-accordion-4" />
          <div className="collapse-title flex items-center gap-2 h-[70px]">
            <MessageSquareText className="size-5" />
            <span className="hidden lg:block">Chats</span>
          </div>
          <div className="collapse-content">
            <CreateGroupChatBtn />
            {chats.map((chat) => (
              <button
                key={chat._id}
                onClick={() => {setSelectedUser(null); setSelectedChat(chat)}}
                className={`w-full py-2 lg:p-3 flex items-center gap-3 hover:bg-base-300 transition-colors mb-1 cursor-pointer ${selectedChat?._id === chat._id ? 'bg-base-300 ring-1 ring-base-300' : ''}
              `}
              >
                <div className=''>
                  <img 
                    src={chat.isGroupChat 
                      ? chat.groupPic 
                      : chat.users.find(user => user._id !== authUser._id)?.profilePic
                    } 
                    alt={`${chat?.groupName} Avatar`}
                    className='size-12 object-cover rounded-lg'
                  />
                </div>
                {/* Chat Info */}
                <div className='hidden lg:block text-left flex-1 max-h-12 max-w-[73%]'>
                  <div className='flex justify-between'>
                    <div className="flex justify-between items-center w-full">
                      <div className='font-medium truncate'>{
                        chat.isGroupChat
                        ? chat.groupName
                        : chat.users.find(user => user._id !== authUser._id)?.username
                        }</div>
                      <div className='text-xs text-accent'>{formatChatTimeStamp(latestMessages[chat._id]?.updatedAt || chat?.updatedAt)}</div>
                    </div>
                  </div>
                  <div className='flex justify-between items-center'>
                    <div className='flex items-center text-sm h-6 text-accent truncate w-37'>{getLatestMessage(chat)}</div>
                    <div 
                      className={`bg-primary text-white size-5 rounded-full p-3 text-sm justify-center items-center ${getUnreadCount(chat._id) > 0 ? 'flex' : 'hidden'}`}
                    >
                      {getUnreadCount(chat._id)}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar