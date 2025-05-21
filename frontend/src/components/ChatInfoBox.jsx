import React, { useRef, useState } from 'react'
import { useChatStore } from '../stores/chatStore'
import { useUserStore } from '../stores/userStore';
import { ArrowRightToLine, Camera, SquarePen } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { formatDate } from '../utils/date';
import toast from 'react-hot-toast';

const ChatInfoBox = () => {
  const { authUser } = useAuthStore();
  const { chats, selectedChat, setShowInfoBox, editGroupChat } = useChatStore();
  const { selectedUser } = useUserStore();
  const [isEditingGroupName, setIsEditingGroupName] = useState(false);
  const [editedGroupName, setEditedGroupName] = useState(selectedChat.groupName);
  const editableRef = useRef(null);

  const getImageSrc = () => {
    if (selectedChat.isGroupChat) {
      const targetChat = chats.find((chat) => chat._id === selectedChat._id);
      return targetChat?.groupPic || selectedChat.groupPic;
    } else {
      return selectedChat.users.find((user) => user._id !== authUser._id).profilePic;
    }
  };

  const handleEditClick = () => {
    setIsEditingGroupName(true);
    setTimeout(() => editableRef.current?.focus(), 0); // Focus after render
  };
  
  const handleCancelEdit = () => {
    setIsEditingGroupName(false);
    setEditedGroupName(selectedChat.groupName); // Reset to original
  };
  
  const handleSaveGroupName = async () => {
    const newName = editableRef.current.innerText.trim();
    if (!newName || newName === selectedChat.groupName) {
      setIsEditingGroupName(false);
      return;
    }
  
    try {
      await editGroupChat(selectedChat._id, {groupName: newName});
      setEditedGroupName(newName);
      toast.success('Group chat name updated');
    } catch (error) {
      console.error("Error updating group name:", error);
    }
  
    setIsEditingGroupName(false);
  };

  const handleImageEdit = async (e) => {
    const imageFile = e.target.files[0];
    if (!imageFile) return;

    const reader = new FileReader();

    reader.readAsDataURL(imageFile);

    reader.onload = async () => {
      const base64Image = reader.result;
      await editGroupChat(selectedChat._id, {groupPic: base64Image});
    };
  };

  return (
    <div className='w-1/2 border-l border-base-300 space-y-4'>
      <div id="header" className='h-[71px] flex items-center justify-between p-4 border-b border-base-300'>
        <h3 className='font-medium'>{selectedChat?.isGroupChat ? 'Group info' : 'Contact info'}</h3>
        <button className='btn btn-ghost' onClick={() => setShowInfoBox(false)}>
          <ArrowRightToLine />
        </button>
      </div>
      <div id='main-info' className='border-b border-base-300'>
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <img
              src={getImageSrc()}
              alt="Profile"
              className="size-24 rounded-full object-cover border-4"
            />
            {selectedChat?.isGroupChat && (
              <label
                htmlFor="group-image-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                `}
              >
                <Camera className="size-4 text-base-200" />
                <input
                  type="file"
                  id="group-image-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageEdit}
                />
              </label>
            )}
          </div>
          <div className='flex flex-col items-center mb-4'>
            <div className='flex items-center gap-1'>

              {!selectedChat?.isGroupChat && (
                <span className='font-medium text-lg px-1'>
                  {selectedChat.users.find((user) => user._id !== authUser._id).username}
                </span>
              )}

              {selectedChat?.isGroupChat && (
                <span
                ref={editableRef} 
                contentEditable={isEditingGroupName}
                suppressContentEditableWarning={true}
                className={`font-medium text-lg px-1 rounded ${isEditingGroupName ? 'border border-accent outline-none' : ''}`}
                >
                  {editedGroupName}
                </span>
              )}

              {selectedChat?.isGroupChat && !isEditingGroupName && (
                <button onClick={handleEditClick} className='btn btn-xs btn-ghost'>
                  <SquarePen className='size-4' />
                </button>
              )}
              {isEditingGroupName && (
                <>
                  <button onClick={handleSaveGroupName} className='btn btn-xs btn-success'>
                    Save
                  </button>
                  <button onClick={handleCancelEdit} className='btn btn-xs btn-ghost'>
                    Cancel
                  </button>
                </>
              )}
            </div>
            <span className='text-accent mb-1'>
              {selectedChat.isGroupChat ?
              'Group - ' + selectedChat.users.length + ' members' :
              selectedChat.users.find((user) => user._id !== authUser._id).fullname}
            </span>
            {selectedChat.isGroupChat && (
              <span className='text-primary text-xs'>Group created on {formatDate(selectedChat?.createdAt)}</span>
            )}
          </div>
        </div>
      </div>
      <div id="info-and-media" className='px-4'>
      </div>
    </div>
  )
}

export default ChatInfoBox