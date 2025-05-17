import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

export const useOnlineStore = create(devtools((set) => ({
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
})));
