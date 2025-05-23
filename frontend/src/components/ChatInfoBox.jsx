import React, { useEffect, useRef, useState } from 'react'
import { useChatStore } from '../stores/chatStore'
import { ArrowRightToLine, Camera, CircleArrowLeft, CircleArrowRight, ImageUp, LogOut, SquarePen, Trash2 } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { formatDate } from '../utils/date';
import toast from 'react-hot-toast';

const ChatInfoBox = () => {
  const { authUser } = useAuthStore();
  const { chats, selectedChat, setShowInfoBox, editGroupChat, chatImages, leaveGroupChat } = useChatStore();
  const [isEditingGroupName, setIsEditingGroupName] = useState(false);
  const [editedGroupName, setEditedGroupName] = useState(selectedChat?.groupName);
  const editableRef = useRef(null);
  const dropdownRef = useRef(null);
  const leaveGroupModalRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getImageSrc = () => {
    if (selectedChat?.isGroupChat) {
      const targetChat = chats.find((chat) => chat._id === selectedChat._id);
      return targetChat?.groupPic || selectedChat.groupPic;
    } else {
      return selectedChat?.users.find((user) => user._id !== authUser._id).profilePic;
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
      try {
        await editGroupChat(selectedChat._id, {groupPic: base64Image});
        dropdownRef.current?.removeAttribute('open');
        toast.success('Group image updated');
      } catch (error) {
        console.error('Group image update failed: ', error.message);
        toast.error('Group image update failed');
      }
    };
  };

  const handleImageReset = async (e) => {
    try {
      await editGroupChat(selectedChat._id, {groupPic: 'RESET'});
      dropdownRef.current?.removeAttribute('open');
      toast.success('Group image deleted');
    } catch (error) {
      console.error('Group image deletion failed: ', error.message);
      toast.error('Group image deletion failed');
    }
  };

  const closeLeaveGroupModal = () => {
    leaveGroupModalRef.current?.close();
  };

  if (!selectedChat) return null;

  return (
    <div className='w-1/2 border-l border-base-300 flex flex-col'>
      <div id="header" className='h-[71px] flex items-center justify-between p-4 border-b border-base-300'>
        <h3 className='font-medium'>{selectedChat?.isGroupChat ? 'Group info' : 'Contact info'}</h3>
        <button className='btn btn-ghost' onClick={() => setShowInfoBox(false)}>
          <ArrowRightToLine />
        </button>
      </div>
      <div id='container' className='overflow-y-auto'>
        <div id='main-info' className='border-b border-base-300 mb-3'>
          <div className="flex flex-col items-center gap-5 mt-3">
            <div className="relative">
              <img
                src={getImageSrc()}
                alt="Profile"
                className="size-24 rounded-full object-cover border-4"
              />
              {selectedChat?.isGroupChat && (
                <details ref={dropdownRef} className="dropdown dropdown-center absolute -bottom-1 -right-3">
                  <summary className="btn btn-circle btn-secondary">
                    <Camera className='text-base-200' />
                  </summary>
                    <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-39 p-2 shadow-sm">
                      <li>
                        <label htmlFor="group-image-upload">
                          <ImageUp className='size-5'/>
                          Upload image
                          <input
                            type="file"
                            id="group-image-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageEdit}
                          />
                        </label>
                      </li>
                      <li>
                        <button onClick={handleImageReset}>
                          <Trash2 className='size-5'/>
                          Delete image
                        </button>
                      </li>
                    </ul>
                </details>
              )}
            </div>
            <div className='flex flex-col items-center mb-5'>
              <div className='flex items-center gap-1'>

                {!selectedChat?.isGroupChat && (
                  <span className='font-medium text-lg px-1'>
                    {selectedChat?.users.find((user) => user._id !== authUser._id).username}
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
              </div>
              {isEditingGroupName && (
                <div className='flex my-2 gap-2'>
                  <button onClick={handleSaveGroupName} className='btn btn-xs btn-success w-1/2'>
                    Save
                  </button>
                  <button onClick={handleCancelEdit} className='btn btn-xs btn-error w-1/2'>
                    Cancel
                  </button>
                </div>
              )}
              <span className='text-accent'>
                {selectedChat && selectedChat?.isGroupChat ?
                'Group - ' + selectedChat?.users?.length + ' members' :
                selectedChat.users.find((user) => user._id !== authUser._id).fullname}
              </span>
              {selectedChat.isGroupChat && (
                <span className='text-primary text-xs'>Group created on {formatDate(selectedChat?.createdAt)}</span>
              )}
            </div>
          </div>
        </div>
        <div id="media" className='px-4 border-b border-base-300 mb-3'>
          {chatImages.length === 0 ? (
            <p className='text-sm text-accent mb-5'>No media shared yet.</p>
          ) : (
            <div className='mb-5'>
              <span className='text-accent mb-4 text-sm'>Shared pictures</span>
              <div className='relative flex mt-5'>
                <div className='flex h-full absolute -left-3 items-center'>
                  <button
                    className='btn btn-circle'
                    onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
                    disabled={currentIndex === 0}
                  >
                    <CircleArrowLeft className='size-8' />
                  </button>
                </div>

                <div className='flex overflow-hidden gap-2 w-full justify-center'>
                  {chatImages.slice(currentIndex, currentIndex + 3).map((src, index) => (
                    <img
                      key={index} 
                      src={src.image} 
                      alt={`chat-media-${index}`}
                      className='size-24 object-cover rounded-lg border' 
                    />
                  ))}
                </div>

                <div className='flex h-full absolute -right-3 items-center'>
                  <button
                    className='btn btn-circle'
                    onClick={() => setCurrentIndex(prev => Math.min(prev + 1, chatImages.length - 3))}
                    disabled={currentIndex + 3 >= chatImages.length}
                  >
                    <CircleArrowRight className='size-8' />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {selectedChat.isGroupChat && (
          <div id='group-members' className='px-4 border-b border-base-300 mb-3'>
            <span className='text-accent text-sm'>Members</span>
            <div className='mb-5'>
              {selectedChat.users.map((user) => (
                <button
                  key={user._id}
                  className='w-full py-2 lg:p-3 flex items-center gap-3 hover:bg-base-300 transition-colors mb-1 cursor-pointer'
                >
                  <div className='relative'>
                    <img 
                      src={user.profilePic || '/avatar.png'} 
                      alt={`${user.username} Avatar`}
                      className='size-12 object-cover rounded-lg'
                    />
                  </div>
                  {/* User Info */}
                  <div className='flex-1 text-left flex justify-between items-center'>
                    <div>
                      <div className='font-medium truncate'>{user.username}</div>
                      <div className='text-sm h-6 truncate text-accent'>{user.fullname}</div>
                    </div>
                    {selectedChat.groupAdmins.includes(user._id) && (
                      <div className='badge badge-warning text-black'>Admin</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        {selectedChat.isGroupChat && (
          <div id="options" className='px-4'>
            <button 
              className="btn btn-block btn-soft btn-error" 
              onClick={()=>document.getElementById('leave-chat-modal').showModal()}
              >
                <LogOut className='size-5' />
                Leave group chat
            </button>
            <dialog id="leave-chat-modal" className="modal" ref={leaveGroupModalRef}>
              <div className="modal-box px-10 space-y-2">
                <h3 className="font-bold text-lg">
                  Are you sure you want to leave "{selectedChat.groupName}"?
                </h3>
                <div id="modal-info" className='mb-4'>
                  <p className='text-accent text-sm'>You will no longer be able to send or receive messages in this group, and you will lose access to previous conversations.</p>
                  {selectedChat.groupAdmins.includes(authUser._id) && (
                    <p className='text-accent text-sm mt-4'>Your <span className='text-warning'>admin</span> status will also be revoked.</p>
                  )}
                </div>
                <div className='flex justify-end gap-1'>
                  <button className="btn btn-ghost" onClick={closeLeaveGroupModal}>Cancel</button>
                  <button 
                    className="btn btn-soft btn-error" 
                    onClick={async () => {
                      try {
                        await leaveGroupChat(selectedChat._id);
                      } catch (error) {
                        console.error('Error while trying to leave group chat: ', error.message);
                      }
                      closeLeaveGroupModal();
                    }}
                    >
                      Leave group
                    </button>
                </div>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
          </div>
        )}

      </div>
    </div>
  )
}

export default ChatInfoBox