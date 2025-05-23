import React, { useRef, useState } from 'react'
import { X, Image, Send } from "lucide-react";
import { useChatStore } from '../stores/chatStore';
import { useUserStore } from '../stores/userStore';
import toast from 'react-hot-toast';

const ChatInput = () => { 
    const [text, setText] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const { createChat, selectedChat, setSelectedChat, sendMessage } = useChatStore();
    const { selectedUser, setSelectedUser } = useUserStore();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file.type.startsWith("image/")) {
          toast.error("Please select an image file");
          return;
        }
    
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      };
    
      const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      };
    
      const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) return;

        const clearInput = () => {
          setText('');
          setImagePreview(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
        };
      
        //Case 1: chat doesn't exist yet
        if (selectedUser && !selectedChat) {
            try {
                const createdChat = await createChat({users: [selectedUser._id]});

                if (!createdChat?._id) {
                  toast.error("Chat creation failed");
                  return;
                }

                setSelectedChat(createdChat);

                await sendMessage(createdChat._id, {
                  text: text.trim(),
                  image: imagePreview,
                });

                clearInput();
                return;
            } catch (error) {
                console.error('Error creating chat and sending first message', error.message);
                toast.error("Something went wrong");
          }
        }
        
        //Case 2: chat already exists
        if (selectedChat) {
          try {
            await sendMessage(selectedChat._id, {
              text: text.trim(),
              image: imagePreview,
            });

            clearInput();

          } catch (error) {
              console.error('Error sending message to existing chat', error.message);
              toast.error("Message not sent");
          }
        }
      };

    return (
        <div className="p-4 border-t border-base-300 w-full">
          {imagePreview && (
            <div className="mb-3 flex items-center gap-2">
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                />
                <button
                  onClick={removeImage}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
                  flex items-center justify-center"
                  type="button"
                >
                  <X className="size-3" />
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                className="w-full input input-bordered rounded-lg input-sm sm:input-md"
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageChange}
              />

              <button
                type="button"
                className={`hidden sm:flex btn btn-circle
                         ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <Image size={20} />
              </button>
            </div>
            <button
              type="submit"
              className="btn btn-sm btn-circle"
              disabled={!text.trim() && !imagePreview}
            >
              <Send size={22} />
            </button>
          </form>
        </div>
    );
}

export default ChatInput