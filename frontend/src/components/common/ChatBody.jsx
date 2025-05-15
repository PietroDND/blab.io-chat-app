import React, { useEffect, useState } from 'react'
import logo from '../../assets/blab_logo.png';
import { useMessageStore } from '../../stores/messageStore';
import { useAuthStore } from '../../stores/authStore';
import { formatChatTimeStamp } from '../../utils/date';
import { useChatStore } from '../../stores/chatStore';
import ChatBodyPlaceholder from './ChatBodyPlaceholder';
import ChatInput from './ChatInput';

const ChatBody = ({ chatId }) => {
  const [activeChat, setActiveChat] = useState(null);

  const { authUser } = useAuthStore();
  const { messages, getMessages, isMessagesLoading } = useMessageStore();
  const { getChatById } = useChatStore();

  useEffect(() => {
    if (!chatId) return;
    
    const fetchActiveChat = async () => {
      const chat = await getChatById(chatId);
      await getMessages(chatId);
      setActiveChat(chat);
    };

    fetchActiveChat();
  }, [chatId, getMessages, getChatById]);

  if (!activeChat || !chatId) {
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

  if (isMessagesLoading) {
    return <ChatBodyPlaceholder />
  }

  return (
    <div className='flex flex-col flex-1 h-full'>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message._id}
          className={`chat ${message.senderId._id === authUser._id ? "chat-end" : "chat-start"}`}
        >
          <div className=" chat-image avatar">
            <div className="size-10 rounded-full border">
              <img
                src={
                  message.senderId._id === authUser._id
                    ? authUser.profilePic || "/avatar.png"
                    : message.senderId.profilePic || "/avatar.png"
                }
                alt="profile pic"
              />
            </div>
          </div>
          <div className="chat-header mb-1">
            <time className="text-xs opacity-50 ml-1">
              {formatChatTimeStamp(message.createdAt)}
            </time>
          </div>
          <div className="chat-bubble flex flex-col">
            {activeChat.isGroupChat && (
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

      <div className="border-t border-gray-900 p-2">
        <ChatInput chatId={chatId} />
      </div>
    </div>
  )
}

export default ChatBody