import React, { useEffect } from 'react'
import ChatHeader from './ChatHeader'
import { useChatStore } from '../stores/chatStore';
import { useUserStore } from '../stores/userStore';
import ChatInput from './ChatInput';
import { formatChatTimeStamp } from '../utils/date';
import { useAuthStore } from '../stores/authStore';

const ChatContainer = () => {
  const { authUser } = useAuthStore();
  const { messages, getMessages, isMessagesLoading, selectedChat } = useChatStore();
  const { selectedUser } = useUserStore();

  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      try {
        await getMessages(selectedChat._id);
      } catch (error) {
        console.error('Error while retrieving messages from ChatContainer component: ', error.message);
      }
    };

    fetchMessages();
  }, [selectedChat]);

  return (
    <div className='flex-1'>
      <div className='flex flex-col h-full'>
        <ChatHeader />
        <div className='flex-1 overflow-y-auto p-4 space-y-4'>
          {(messages[selectedChat?._id] || []).map((message) => (
            <div 
              key={message._id}
              className={`chat ${message.senderId._id === authUser._id ? "chat-end" : "chat-start"}`}
              >
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <img 
                      src={
                        message.senderId._id === authUser._id
                        ? authUser.profilePic || '/avatar.png'
                        : message.senderId.profilePic || '/avatar.png'
                      } 
                      alt={`${message.senderId.username}'s avatar`} 
                    />
                  </div>
                </div>
                <div className="chat-header mb-1">
                  <time className="text-xs opacity-50 ml-1">
                    {formatChatTimeStamp(message.createdAt)}
                  </time>
                </div>
                <div className="chat-bubble flex flex-col">
                  {selectedChat.isGroupChat && (
                    <span className='text-sm text-gray-400'>{message.senderId.username}</span>
                  )}
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2"
                    />
                  )}
                  {message.text && <p>{message.text}</p>}
                </div>
              </div>
          ))}
        </div>
        <ChatInput />

      </div>
    </div>
  )
}

export default ChatContainer