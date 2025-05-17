import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import { useOnlineStore } from './onlineStore.js';
import { useChatStore } from './chatStore.js';

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigninUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    socket: null,

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

            //Fetch user's chats list
            const res = await axiosInstance.get('/chats');
            const chatIds = res.data.map(chat => chat._id);

            //Join rooms
            socket.emit('join-chats', chatIds);
        });

        socket.on('online-users', (userIds) => {
            useOnlineStore.getState().setOnlineUsers(userIds);
        });

        socket.on('get-new-chat', async (chat) => {
            useChatStore.getState().updateChatsList(chat);
        });

        socket.on('new-message', async (message) => {
            const { getMessages } = useChatStore.getState();
            await getMessages(message.chatId);
            useChatStore.getState().updateLatestMessages(message.chatId, message);
            //console.log('New message: ', message);
        });

        socket.on('disconnect', () => {
            console.log('❌ Socket disconnected');
            useOnlineStore.getState().setOnlineUsers([]); // reset list
        });

        socket.on('user-went-offline', ({ userId, lastSeen }) => {
            useOnlineStore.getState().updateLastSeen(userId, lastSeen);
        });
    },

    disconnectSocket: () => {
        const socket = get().socket;

        if(socket?.connected) {
            socket.disconnect();
            set({ socket: null });
        }
    },
}));