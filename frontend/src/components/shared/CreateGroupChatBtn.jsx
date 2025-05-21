import {
    CircleFadingPlus,
    MessagesSquare,
    ChevronDown,
    ChevronUp,
  } from 'lucide-react';
  import React, { useState } from 'react';
import { useUserStore } from '../../stores/userStore';
import toast from 'react-hot-toast';
import { useChatStore } from '../../stores/chatStore';
  
  
  const CreateGroupChatBtn = () => {
    const { users } = useUserStore();
    const { createChat } = useChatStore();
    const [groupName, setGroupName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [expand, setExpand] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [nameError, setNameError] = useState(false);
    const [usersError, setUsersError] = useState(false);

    const toggleUser = (id) => {
      setSelectedUsers((prev) =>
        prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
      );
    };

    const handleImageUpload = async (e) => {
        const imageFile = e.target.files[0];
        if (!imageFile) return;
    
        const reader = new FileReader();
    
        reader.readAsDataURL(imageFile);
    
        reader.onload = async () => {
          const base64Image = reader.result;
          setSelectedImage(base64Image);
        };
    };

    const validateForm = () => {
        setNameError(false);
        setUsersError(false);

        if (!groupName || groupName === '') {
            setNameError(true);
            return false;
        }

        if (selectedUsers.length < 2) {
            setUsersError(true);
            return false
        }

        return true;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if(!validateForm()) {
          return;
        }

        const users = selectedUsers;
        const groupPic = selectedImage;

        try {
            await createChat({users, groupName, groupPic});

            //Close modal and clear the form
            const modal = document.getElementById('my_modal_2');
            if (modal) modal.close();
            setGroupName('');
            setSelectedUsers([]);
            setSelectedImage(null);
            setExpand(false);
            toast.success('New group chat created');

        } catch (error) {
            console.error('Chat creation failed');
        }
    };

    return (
      <div>
        <button
          className="btn w-full mb-3"
          onClick={() => document.getElementById('my_modal_2').showModal()}
        >
          <CircleFadingPlus />
          <span className="hidden lg:block">Create group chat</span>
        </button>
  
        <dialog id="my_modal_2" className="modal">
          <div className="modal-box flex flex-col items-center">
            <h3 className="font-bold text-2xl mb-6">Create a new group chat</h3>
            <form onSubmit={handleFormSubmit} className="w-full">
              {/* Group Name */}
              <fieldset className="fieldset mb-4">
                <legend className="fieldset-legend text-sm">
                  Insert group chat name
                </legend>
                <label htmlFor="group-chat-name" className="input w-full">
                  <MessagesSquare />
                  <input
                    id="group-chat-name"
                    type="text"
                    className="grow"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                </label>
                <span className={`text-error ${nameError ? 'block' : 'hidden'}`}>Please enter a name for the group chat</span>
              </fieldset>
  
              {/* Inline Multi-Select */}
              <fieldset className="fieldset mb-4">
                <legend className="fieldset-legend text-sm">
                  Select participants
                </legend>
  
                <div className="w-full border rounded-lg p-3 bg-base-200">
                  <button
                    type="button"
                    className="flex justify-between items-center w-full font-medium text-sm cursor-pointer"
                    onClick={() => setExpand((prev) => !prev)}
                  >
                    <span>
                      {selectedUsers.length > 0
                        ? `${selectedUsers.length} participant(s) selected`
                        : 'Choose users'}
                    </span>
                    {expand ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
  
                  {expand && (
                    <div className="max-h-48 overflow-y-auto space-y-2 mt-5">
                      {users.map((user) => (
                        <label
                          key={user._id}
                          className="flex items-center justify-between cursor-pointer px-2 mb-5 last:mb-0"
                        >
                          <div className='text-left flex items-center gap-2'>
                          <img 
                            src={user.profilePic || '/avatar.png'} 
                            alt={`${user.username} Avatar`}
                            className='size-10 object-cover rounded-lg'
                          />
                            <div>
                                <div className='font-medium truncate'>{user.username}</div>
                                <div className='text-sm h-6 truncate text-accent'>{user.fullname}</div>
                            </div> 
                          </div>
                          <input
                            type="checkbox"
                            className="checkbox checkbox-sm"
                            checked={selectedUsers.includes(user._id)}
                            onChange={() => toggleUser(user._id)}
                          />
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <span className={`text-error ${usersError ? 'block' : 'hidden'}`}>Select at least 2 participants</span>
              </fieldset>

              <fieldset className="fieldset mb-5">
                <legend className="fieldset-legend text-sm">
                  Choose a picture for the group chat (Max 1,5Mb)
                </legend>
                <label htmlFor="group-chat-picture">
                <input
                    id='group-chat-picture' 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input file-input-primary w-full" 
                />
                </label>
              </fieldset>
  
              {/* Your Submit Button or anything else */}
              <button className="btn btn-primary w-full mt-4" type="submit">
                Create Chat
              </button>
            </form>
          </div>
  
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    );
  };
  
  export default CreateGroupChatBtn;
  