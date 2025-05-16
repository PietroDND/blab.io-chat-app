import { create } from 'zustand';
import User from '../../../backend/src/models/user.model';
import toast from 'react-hot-toast';

export const useOnlineStore = create((set) => ({
    onlineUsers: [],
    lastSeen: {},
    
    setOnlineUsers: (userIds) => set({ onlineUsers: userIds }),

    isUserOnline: (userId) => {
      return useOnlineStore.getState().onlineUsers.includes(userId);
    },

    updateLastSeen: (userId, timestamp) => {
      set((state) => ({
        lastSeen: {
          ...state.lastSeen,
          [userId]: timestamp
        }
      }));
    }
}));
