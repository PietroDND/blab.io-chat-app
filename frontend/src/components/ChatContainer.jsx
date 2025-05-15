import React from 'react'
import ChatHeader from './common/ChatHeader'
import ChatBody from './common/ChatBody'
import ChatInfo from './common/ChatInfo'
import { useChatStore } from '../stores/chatStore'
import ChatInput from './common/ChatInput'

const ChatContainer = () => {
  const { selectedChat } = useChatStore();

  return (
    <div className='w-full h-full flex flex-col'>
      <ChatHeader />
      <ChatBody chatId={selectedChat?._id} />
      {selectedChat && (
        <ChatInput chatId={selectedChat._id} />
      )}
    </div>
  )
}

export default ChatContainer