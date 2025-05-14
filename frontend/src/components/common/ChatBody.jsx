import React, { useEffect } from 'react'
import { useChatStore } from '../../stores/chatStore'
import { useAuthStore } from '../../stores/authStore'
import logo from '../../assets/blab_logo.png';

const ChatBody = () => {
  const {messages, getMessages, isMessagesLoading, selectedUser, selectedChat } = useChatStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (selectedChat) getMessages(selectedChat._id);
    console.log(messages);
  }, [selectedChat, getMessages]);

  if(!selectedChat) {
    return(
      <div className='w-full h-full flex justify-center items-center'>
        <div className='flex flex-col items-center gap-2'>
          <div className="size-9 flex flex-col items-center justify-center">
            <img src={logo} alt="Blab.io Logo" />
          </div>
          <span className='font-bold text-xl text-gray-200'>Welcome to Blab.io!</span>
          <span className='text-gray-200 text-sm'>Select a chat from the sidebar</span>
        </div>
      </div>
    );
  }

  return (
    <div>ChatBody</div>
  )
}

export default ChatBody