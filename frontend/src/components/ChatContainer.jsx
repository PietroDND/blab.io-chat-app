import React from 'react'
import ChatHeader from './ChatHeader'
import { useChatStore } from '../stores/chatStore';
import { useUserStore } from '../stores/userStore';
import ChatInput from './ChatInput';

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedChat } = useChatStore();
  const { selectedUser } = useUserStore();
  return (
    <div className='flex-1'>
      <div className='flex flex-col h-full'>
        <ChatHeader />
        <div className='flex-1'>ChatBox</div>
        <ChatInput />

      </div>
    </div>
  )
}

export default ChatContainer