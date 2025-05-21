import React, { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { Camera, User, Mail, SquarePen, CircleX } from 'lucide-react';
import { formatDate } from '../utils/date';

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(authUser.username);
  const [errorMsg, setErrorMsg] = useState('');

  const handleImageUpload = async (e) => {
    const imageFile = e.target.files[0];
    if (!imageFile) return;

    const reader = new FileReader();

    reader.readAsDataURL(imageFile);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await updateProfile({profilePic: base64Image});
    };
  };

  const handleUsernameChange = async (e) => {
    setNewUsername(e.target.value);
  };

  const handleSaveUsername = async () => {
    if (newUsername === authUser.username) return;
    try {
      await updateProfile({ username: newUsername });
      setIsEditingUsername(false);
      setErrorMsg('');
    } catch (error) {
      const msg = error.response?.data?.msg || 'Failed to update username';
      console.error('Username update failed: ', msg);
      setErrorMsg(msg);
      setNewUsername(authUser.username);
    }
  };

  return (
    <div className='h-screen pt-20'>
      <div className='max-w-2xl mx-auto p-4 py-8'>
        <div className='bg-base-300 rounded-xl p-6 space-y-8'>
          <div className='text-center'>
            <h1 className='text-2xl font-semibold'>Profile Info</h1>
          </div>

          {/* profile image section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImage || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your profile image (Max 1,5Mb)"}
            </p>
          </div>

          <div className="space-y-6">
            <label htmlFor="username" className="label mb-1">
              <span className='label-text font-medium'>Username</span>
            </label>
            <div className={`relative ${errorMsg.length > 0 ? 'mb-0' : ''}`}>
              <input 
                type='text'
                id='username'
                className={`w-full px-4 py-2.5 bg-base-200 rounded-lg border ${isEditingUsername ? 'border-primary' : ''}`}
                value={newUsername}
                onChange={handleUsernameChange}
                disabled={!isEditingUsername}
              />
              {isEditingUsername && (
                <div className='absolute inset-y-0 right-12 flex items-center'>
                  <button 
                    className="btn btn-success h-7" 
                    onClick={handleSaveUsername}
                    disabled={newUsername === authUser.username || isUpdatingProfile}
                  >
                    Save
                  </button>
                </div>
              )}
              <button
                type='button'
                className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer z-10'
                onClick={() => {
                  setIsEditingUsername(!isEditingUsername);
                  setNewUsername(authUser.username);
                  setErrorMsg('');
                }}
              >
                {!isEditingUsername ? (
                  <SquarePen className='size-5' />
                ) : (
                  <CircleX className='size-5 text-red-500' />
                )}
              </button>
            </div>
            {errorMsg && (
              <p className='text-sm text-red-500 mt-1'>{errorMsg}</p>
            )}

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="size-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 text-accent rounded-lg border cursor-not-allowed">{authUser?.fullname}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="size-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 text-accent rounded-lg border cursor-not-allowed">{authUser?.email}</p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{formatDate(authUser.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProfilePage