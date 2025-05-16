import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

export const useChatStore = create((set) => ({
    messages: [],
    chats: [],
    latestMessages: {},
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
            for (const chat of res.data) {
                set((state) => ({ 
                    latestMessages: {
                        ...state.latestMessages, 
                        [chat._id]: chat.latestMessage} 
                }));
            }
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

    createChat: async ({users, groupName, groupPic}) => {
        try {
            const payload = {
                users,
                ...(groupName && { groupName }),
                ...(groupPic && { groupPic }),
            };

            const res = await axiosInstance.post('/chats', payload);
            console.log(res.data);
            const createdChat = res.data;
            toast.success(groupName ? 'Group chat created' : 'Chat created');
            return createdChat;
        } catch (error) {
            toast.error('Failed to create chat');
            return null;
        }
    },

    updateLatestMessages: (chatId, message) => {
        set((state) => ({ 
            latestMessages: {
                ...state.latestMessages, 
                [chatId]: message} 
        }));
    },

    setSelectedChat: (selectedChat) => set({ selectedChat }),
}));
