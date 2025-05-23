import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import { devtools } from 'zustand/middleware';
import { useChatStore } from './chatStore.js';
import { useUserStore } from './userStore.js';

const debug = false;

export const useAuthStore = create(devtools((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigninUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    socket: null,
    onlineUsers: [],
    lastSeen: {},

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check');
            set({ authUser: res.data });
            get().connectSocket();
        } catch (error) {
            console.log('Error in useAuthStore.checkAuth(): ', error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigninUp: true });
        try {
            const res = await axiosInstance.post('/auth/signup', data);
            set({ authUser: res.data });
            toast.success('Your account has been created successfully.');
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.msg);
        } finally {
            set({ isSigninUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post('/auth/login', data);
            set({ authUser: res.data });
            toast.success('You are logged in');
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.msg);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout');
            set({ authUser: null });
            toast.success('Logout successful');
            get().disconnectSocket();
        } catch (error) {
            toast.error('Something went wrong - logout failed');
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.patch('/auth/update-profile', data);
            set({ authUser: res.data });
            toast.success('Profile updated');
            return res.data;
        } catch (error) {
            throw error;
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    isUserOnline: (userId) => {
        return get().onlineUsers.includes(userId);
    },

    updateLastSeen: (userId, timestamp) => {
        set((state) => ({
          lastSeen: {
            ...state.lastSeen,
            [userId]: timestamp
          }
        }));
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(import.meta.env.VITE_BASE_URL, {
            query: {
                userId: authUser._id
            }
        });
        socket.connect();
        set({ socket });
        socket.on('connect', async () => {
            console.log('✅ Socket connected: ', socket.id);
            socket.emit('join', authUser._id);

            //Fetch registered users list
            await useUserStore.getState().getUsers();
            //Fetch user's chats list
            const chats = await useChatStore.getState().getChats();
            const chatIds = chats.map(chat => chat._id);

            //Fetch user's messages
            for (const chat of chats) {
                await useChatStore.getState().getMessages(chat._id);
            }

            //Join rooms
            socket.emit('join-chats', chatIds);
        });

        socket.on('online-users', (userIds) => {
            set({ onlineUsers: userIds });
        });

        socket.on('get-new-chat', (chat) => {
            if (debug) console.log('New chat received: ', chat);
            useChatStore.getState().updateChatsList(chat);
        });

        socket.on('get-new-message', async (message) => {
            const isChatOpen = useChatStore.getState().selectedChat?._id === message.chatId;
            //Mark message as read before adding to the messages store, if chat is open
            if (isChatOpen && !message.message.readBy.includes(authUser._id)) {
                message.message.readBy.push(authUser._id);
            }

            // Append to store
            useChatStore.getState().appendMessage(message.chatId, message.message);

            if (isChatOpen) {
                useChatStore.getState().markMessagesAsRead(message.chatId).catch((error) => {
                    console.error('Failed to auto-mark message as read:', error.message);
                });
                useChatStore.getState().markMessagesAsReadLocally(message.chatId, authUser._id);
            }
        });

        socket.on('user-left-group-chat', (chatId) => {
            useChatStore.getState().getChatById(chatId);
        });

        socket.on('disconnect', () => {
            console.log('❌ Socket disconnected');
            set({ onlineUsers: [] }); // reset list
        });

        socket.on('user-went-offline', ({ userId, lastSeen }) => {
            get().updateLastSeen(userId, lastSeen);
        });
    },

    disconnectSocket: () => {
        const socket = get().socket;

        if(socket?.connected) {
            socket.disconnect();
            set({ socket: null });
        }
    },
})));