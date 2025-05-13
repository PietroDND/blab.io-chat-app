import React from 'react'
import ChatHeader from './common/ChatHeader'
import ChatBody from './common/ChatBody'
import ChatInfo from './common/ChatInfo'

const ChatContainer = () => {
  return (
    <div className='w-full'>
      <ChatHeader />
      <div className='flex'>
        <ChatBody />
        <ChatInfo />
      </div>
    </div>
  )
}

export default ChatContainer