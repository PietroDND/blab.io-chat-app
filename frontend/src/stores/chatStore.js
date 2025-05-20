import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { useAuthStore } from './authStore.js';

export const useChatStore = create((set, get) => ({
    chats: [],
    messages: {},
    latestMessages: {},
    selectedChat: null,
    isMessagesLoading: false,
    isChatsLoading: false,

    getChats: async () => {
        set({ isChatsLoading: true });
        try {
            const res = await axiosInstance.get('/chats');
            
            // Clear existing chats and latestMessages before reloading
            set({ chats: [], latestMessages: {} });

            for(const chat of res.data){
                get().updateChatsList(chat);
            }

            return res.data;
        } catch (error) {
            toast.error(error.response.data.msg);
            return null;
        } finally {
            set({ isChatsLoading: false });
        }
    },

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

    createChat: async ({users, groupName, groupPic}) => {
        try {
            const payload = {
                users,
                ...(groupName && { groupName }),
                ...(groupPic && { groupPic }),
            };

            const res = await axiosInstance.post('/chats', payload);

            const socket = useAuthStore.getState().socket;
            if (!socket || !socket.connected) {
                console.error('Socket not ready or connected.');
                return;
            }
            
            get().updateChatsList(res.data);
            socket.emit('new-chat', res.data);

            return res.data;
        } catch (error) {
            toast.error('Failed to create chat');
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
        } catch (error) {
            
        }
    },

    updateChatsList: (newChat) => {
        set((state) => {
            const chatExist = state.chats.some(chat => chat._id === newChat._id);
            if (chatExist) return {}; //No changes if chat already exist

            return {
                chats: [...state.chats, newChat],
                ...(newChat.latestMessage && {
                    latestMessages: {
                        ...state.latestMessages,
                        [newChat._id]: newChat.latestMessage
                    }
                })
            }
        });
    },

    setSelectedChat: (selectedChat) => set({ selectedChat })
}));