import { UserPlus } from 'lucide-react';
  import React, { useState } from 'react';
import { useUserStore } from '../../stores/userStore';
import toast from 'react-hot-toast';
import { useChatStore } from '../../stores/chatStore';
  
  
  const AddGroupMembers = () => {
    const { users } = useUserStore();
    const { selectedChat, addMembersGroupChat } = useChatStore();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [usersError, setUsersError] = useState(false);

    const toggleUser = (id) => {
      setSelectedUsers((prev) =>
        prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
      );
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const users = selectedUsers;
        try {
            await addMembersGroupChat(selectedChat._id, users);
            //Close modal and clear the form
            const modal = document.getElementById('add-members-modal');
            if (modal) modal.close();
            setSelectedUsers([]);
            toast.success(`${users.length} member(s) added`);

        } catch (error) {
            console.error('Failed to add new members to group chat');
        }
    };

    return (
      <div>
        <button
          className="btn btn-block btn-primary btn-outline my-2"
          onClick={() => document.getElementById('add-members-modal').showModal()}
        >
          <UserPlus className='size-5' />
          <span className="hidden lg:block">Add new members</span>
        </button>
  
        <dialog id="add-members-modal" className="modal">
          <div className="modal-box flex flex-col items-center">
            <h3 className="font-bold text-2xl mb-6">Add members to "{selectedChat?.groupName}"</h3>
            <form onSubmit={handleFormSubmit} className="w-full">
  
              <fieldset className="fieldset mb-4">
                <legend className="fieldset-legend text-sm">
                  Select users to add
                </legend>
  
                <div className="w-full border rounded-lg p-3 bg-base-200">
                  <button
                    type="button"
                    className="flex justify-between items-center w-full font-medium text-sm"
                  >
                    <span>
                      {selectedUsers.length > 0
                        ? `Add ${selectedUsers.length} participant(s)`
                        : 'Choose users'}
                    </span>
                  </button>

                  <div className="max-h-48 overflow-y-auto space-y-2 mt-5">
                    {users
                      .filter((user) =>
                        !selectedChat.users.some((chatUser) => chatUser._id === user._id) 
                      )
                      .map((user) => (
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

                </div>
                <span className={`text-error ${usersError ? 'block' : 'hidden'}`}>Select at least 2 participants</span>
              </fieldset>
  
              {/* Your Submit Button or anything else */}
              <button 
                className="btn btn-primary w-full mt-4" 
                type="submit"
                disabled={selectedUsers.length === 0 ? true : false}
              >
                Add members
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
  
  export default AddGroupMembers;
  