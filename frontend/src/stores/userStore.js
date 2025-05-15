import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

export const useUserStore = create((set) => ({
    users: [],
    selectedUser: null,
    isUsersLoading: false,

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

    setSelectedUser: (selectedUser) => set({ selectedUser })
}));