import React, { useEffect } from 'react'
import { useChatStore } from '../stores/chatStore'
import SidebarPlaceholder from '../components/SidebarPlaceholder'
import SidebarHeader from './common/SidebarHeader';

const Sidebar = () => {
  const { users, getUsers, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) return <SidebarPlaceholder />

  return (
    <aside className='h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200'>
      <SidebarHeader />

      <div className="overflow-y-auto w-full py-3">
        {users.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors mb-1 cursor-pointer ${selectedUser?._id === user._id ? 'bg-base-300 ring-1 ring-base-300' : ''}
            `}
          >
            <div className='relative mx-auto lg:mx-0'>
              <img 
                src={user.profilePic || '/avatar.png'} 
                alt={`${user.username} Avatar`}
                className='size-12 object-cover rounded-lg' 
                />
            </div>

            {/* User Info */}
            <div className='hidden lg:block text-left min-w-0 max-h-12 flex-1'>
              <div className='flex justify-between'>
                <div className='font-medium truncate'>{user.username}</div>
                <div className='text-sm text-gray-400'>11:45</div>
              </div>
              <div className='w-[80%] text-sm text-gray-400 truncate'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
            </div>
            
          </button>
        ))}
      </div>
    </aside>
  )
}

export default Sidebar