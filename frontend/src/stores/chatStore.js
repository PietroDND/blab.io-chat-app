import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

export const useChatStore = create((set) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get('/users');
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response.data.msg);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async () => {
        set({ isMessagesLoading: true });
        try {
            const res = axiosInstance.get();
        } catch (error) {
            
        } finally {
            set({ isMessagesLoading: false })
        }
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
