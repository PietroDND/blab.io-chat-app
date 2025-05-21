import React, { useEffect } from 'react'
import ChatHeader from './ChatHeader'
import ChatInfoBox from './ChatInfoBox'
import { useChatStore } from '../stores/chatStore';
import { useUserStore } from '../stores/userStore';
import ChatInput from './ChatInput';
import { formatChatTimeStamp } from '../utils/date';
import { useAuthStore } from '../stores/authStore';

const ChatContainer = () => {
  const { authUser } = useAuthStore();
  const { messages, getMessages, selectedChat, markMessagesAsRead, markMessagesAsReadLocally, showInfoBox, setShowInfoBox } = useChatStore();
  const { selectedUser } = useUserStore();

  useEffect(() => {
    setShowInfoBox(false);
  }, [selectedChat, selectedUser]);

  useEffect(() => {
    if (!selectedChat) return;

    const loadMessagesAndMarkAsRead = async () => {
      try {
        await getMessages(selectedChat._id); // wait for the fetch to complete
        await markMessagesAsRead(selectedChat._id); // then mark as read in DB
        markMessagesAsReadLocally(selectedChat._id, authUser._id); // then update local store
      } catch (error) {
        console.error('Error loading messages or marking as read: ', error.message);
      }
    };

    loadMessagesAndMarkAsRead();
  }, [selectedChat]);

  return (
    <div className='flex flex-1'>
      <div className='flex flex-col flex-1 h-full w-1/2'>
        <ChatHeader />
        <div className='flex-1 overflow-x-hidden overflow-y-auto p-4 space-y-4'>
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
                    <span className='text-sm text-accent'>{message.senderId.username}</span>
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
      {showInfoBox && <ChatInfoBox />}
    </div>
  )
}

export default ChatContainer