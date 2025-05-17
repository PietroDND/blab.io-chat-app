import React, { useEffect, useMemo, useState } from 'react'
import ChatHeader from './common/ChatHeader'
import ChatBody from './common/ChatBody'
import ChatInfo from './common/ChatInfo'
import { useChatStore } from '../stores/chatStore'
import ChatInput from './common/ChatInput'
import { useUserStore } from '../stores/userStore'
import { useAuthStore } from '../stores/authStore'

const ChatContainer = () => {
  const { authUser } = useAuthStore();
  const { selectedChat, chats } = useChatStore();
  const { selectedUser } = useUserStore();

  const chatId = useMemo(() => {
    if (selectedChat) return selectedChat._id;

    if (selectedUser) {
      const chat = chats.find(chat => {
        return (
          !chat.isGroupChat &&
          chat.users.length === 2 &&
          chat.users.some(user => user._id === authUser._id) &&
          chat.users.some(user => user._id === selectedUser._id)
        );
      });
      return chat ? chat._id : null;
    }
    return null;
  }, [selectedChat, selectedUser, chats, authUser._id]);

  //console.log('ChatId from ChatContainer: ', chatId);

  return (
    <div className='w-full h-full flex flex-col'>
      <ChatHeader />
      <ChatBody chatId={chatId} />
      {(selectedChat || selectedUser) && (
        <ChatInput chatId={chatId} />
      )}
    </div>
  )
}

export default ChatContainer