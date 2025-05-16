import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

export const useMessageStore = create((set) => ({
    messages: {},
    isMessagesLoading: false,

    getMessages: async (chatId) => {
        set((state) => {
            if (state.messages[chatId]) return {}; // skip setting loading state
            return { isMessagesLoading: true };
        });

        try {
            const res = await axiosInstance.get(`/chats/${chatId}/messages`);
            set((state) => ({ messages: {...state.messages, [chatId]: res.data.messages} }));
        } catch (error) {
            toast.error(error?.response?.data?.msg || 'Failed to fetch messages');
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (chatId, data) => {
        const { text, image } = data;
        const dataParsed ={
            ...(text && { text }),
            ...(image && { image })
        };
        try {
            const res = await axiosInstance.post(`/chats/${chatId}/messages`, dataParsed);
            set((state) => {
                const prevMessages = state.messages[chatId] || [];
                return {
                    messages: {
                        ...state.messages,
                        [chatId]: [...prevMessages, res.data]
                    }
                };
            });
        } catch (error) {
            toast.error(error?.response?.data?.msg || `Failed to send message in chat: ${chatId}`);
        }
    }
}));