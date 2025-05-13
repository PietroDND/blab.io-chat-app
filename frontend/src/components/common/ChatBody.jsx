import React, { useEffect } from 'react'
import { useChatStore } from '../../stores/chatStore'
import { useAuthStore } from '../../stores/authStore'

const ChatBody = () => {
  const {messages, getMessages, isMessagesLoading, selectedUser } = useChatStore();
  const { authUser } = useAuthStore();

  return (
    <div>ChatBody</div>
  )
}

export default ChatBody