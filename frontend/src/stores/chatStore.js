import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

export const useChatStore = create((set) => ({
    messages: [],
    users: [],
    chats: [],
    selectedChat: null,
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isChatsLoading: false,

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

    getMessages: async (chatId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${chatId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response.data.msg);
        } finally {
            set({ isMessagesLoading: false })
        }
    },

    getChats: async () => {
        set({ isChatsLoading: true });
        try {
            const res = await axiosInstance.get('/chats');
            set({ chats: res.data });
        } catch (error) {
            toast.error(error.response.data.msg);
        } finally {
            set({ isChatsLoading: false });
        }
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
    setSelectedChat: (selectedChat) => set({ selectedChat }),
}));
