import React, { useEffect } from 'react'
import { useChatStore } from '../stores/chatStore'
import SidebarPlaceholder from '../components/SidebarPlaceholder'
import { Users, MessageSquareText } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { formatChatTimeStamp } from '../utils/date'
import { getChatName, getChatPic, getMessagePreview } from '../utils/chat'
import { useUserStore } from '../stores/userStore'

const Sidebar = () => {
  const { authUser } = useAuthStore();
  const { chats, selectedChat, setSelectedChat, getChats, latestMessages } = useChatStore();
  const { users, selectedUser, setSelectedUser, isUsersLoading, getUsers } = useUserStore();

  useEffect(() => {
    getUsers();
    getChats();
  }, [getUsers, getChats]);

  //console.log(latestMessages);

  if (isUsersLoading) return <SidebarPlaceholder />

  return (
    <aside className='h-full w-20 lg:w-100 border-r border-base-300 flex flex-col transition-all duration-200'>
      {/* <SidebarHeader /> */}
      <div className="w-full collapse collapse-arrow bg-base-100 border-b border-base-300">
        <input type="radio" name="my-accordion-2" defaultChecked />
        <div className="flex items-center gap-2 collapse-title">
            <Users className="size-5" />
            <span className="hidden lg:block">Contacts</span>
        </div>
        <div className="collapse-content w-full overflow-y-auto">
          {users.map((user) => (
            <button
              key={user._id}
              onClick={() => {setSelectedUser(user); setSelectedChat(null)}}
              className={`w-full py-2 lg:p-3 flex items-center gap-3 hover:bg-base-300 transition-colors mb-1 cursor-pointer ${selectedUser?._id === user._id ? 'bg-base-300 ring-1 ring-base-300' : ''}
            `}
            >
              <div className=''>
                <img 
                  src={user.profilePic || '/avatar.png'} 
                  alt={`${user.username} Avatar`}
                  className='size-12 object-cover rounded-lg'
                />
              </div>
              {/* User Info */}
              <div className='hidden lg:block text-left flex-1 max-h-12 max-w-[73%]'>
                <div className='flex justify-between'>
                  <div className='font-medium truncate'>{user.username}</div>
                </div>
                <div className='text-sm h-6 truncate text-gray-400'>{user.fullname}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full collapse collapse-arrow bg-base-100 border-base-300">
        <input type="radio" name="my-accordion-2" />
        <div className="flex items-center gap-2 collapse-title">
          <MessageSquareText className='size-5' />
          <span className="hidden lg:block">Chats</span>
        </div>
        <div className="collapse-content w-full overflow-y-auto">
          {chats.map((chat) => (
            <button
              key={chat._id}
              onClick={() => {setSelectedChat(chat); setSelectedUser(null)}}
              className={`w-full py-2 lg:p-3 flex items-center gap-3 hover:bg-base-300 transition-colors mb-1 cursor-pointer ${selectedChat?._id === chat._id ? 'bg-base-300 ring-1 ring-base-300' : ''}
            `}
            >
              <div className=''>
                <img 
                  src={getChatPic(chat, authUser)}
                  alt={`${getChatName(chat, authUser)}'s Avatar`}
                  className='size-12 object-cover rounded-lg'
                />
              </div>
              {/* Chat Info */}
              <div className='hidden lg:block text-left flex-1 max-h-12 max-w-[73%]'>
                <div className='flex justify-between items-center'>
                  <div className='font-medium truncate'>
                    {getChatName(chat, authUser)}
                  </div>
                  <div className='text-xs text-gray-400'>{formatChatTimeStamp(latestMessages[chat._id]?.updatedAt)}</div>
                </div>
                <div className='text-sm h-6 truncate text-gray-400'>
                  {getMessagePreview(chat, latestMessages[chat._id])}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

    </aside>
  )
}

export default Sidebar