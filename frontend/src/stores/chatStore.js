import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

export const useChatStore = create((set) => ({
    messages: [],
    chats: [],
    selectedChat: null,
    isMessagesLoading: false,
    isChatsLoading: false,

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

    getChatById: async (chatId) => {
        try {
            const res = await axiosInstance.get(`/chats/${chatId}`);
            return res.data;
        } catch (error) {
            toast.error(error?.response?.data?.msg || `Failed to retrieve chat: ${chatId}`);
        }
    },

    setSelectedChat: (selectedChat) => set({ selectedChat }),
}));
