import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

export const useUserStore = create((set) => ({
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    lastSeen: {},

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get('/users');
            set({ users: res.data });
            for(const user of res.data) {
                set((state) => ({
                    lastSeen: {
                        ...state.lastSeen,
                        [user._id]: user.lastSeen
                    }
                }));
            }
            return res.data;
        } catch (error) {
            toast.error(error.response.data.msg);
            return null;
        } finally {
            set({ isUsersLoading: false });
        }
    },

    setSelectedUser: (selectedUser) => set({ selectedUser })
}));