import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { devtools } from 'zustand/middleware'
import { useAuthStore } from './authStore';

export const useChatStore = create(devtools((set, get) => ({
    messages: {},
    chats: [],
    latestMessages: {},
    selectedChat: null,
    isMessagesLoading: false,
    isChatsLoading: false,

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
            //console.log(res.data);
            const createdChat = res.data;
            get().updateChatsList(createdChat);
            const { socket } = useAuthStore.getState();
            if (!socket) {
                toast.error('Socket is not connected.');
                return;
            }
            socket.emit('join-new-chat', ({chat: createdChat}));
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

    updateChatsList: (chat) => {
        set((state) => ({
            chats: [chat, ...state.chats]
        }));
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
            const { socket } = useAuthStore.getState();
            if (!socket) {
                toast.error('Socket is not connected.');
                return;
              }
            socket.emit('send-message', {
                chatId,
                message: res.data
            });
        } catch (error) {
            toast.error(error?.response?.data?.msg || error.message || `Failed to send message in chat: ${chatId}`);
        }
    },

    setSelectedChat: (selectedChat) => set({ selectedChat }),
})));
