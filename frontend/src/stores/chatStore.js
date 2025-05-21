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
    showInfoBox: false,

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
            get().updateChatsList(res.data);

            const socket = useAuthStore.getState().socket;
            if (!socket || !socket.connected) {
                console.error('Socket not ready or connected.');
                return;
            }
            socket.emit('new-chat', res.data);

            return res.data;
        } catch (error) {
            toast.error('Failed to create chat');
        }
    },

    editGroupChat: async (chatId, {groupName, groupPic}) => {
        try {
            const payload = {
                ...(groupName && { groupName }),
                ...(groupPic && { groupPic }),
            };
            const res = await axiosInstance.patch(`/chats/${chatId}`, payload);
            get().updateChatsList(res.data);
        } catch (error) {
            toast.error(error.response.data.msg);
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
            get().appendMessage(chatId, res.data);

            const socket = useAuthStore.getState().socket;
            if (!socket || !socket.connected) {
                console.error('Socket not ready or connected.');
                return;
            }
            socket.emit('send-message', {
                chatId,
                message: res.data
            });
        } catch (error) {
            toast.error('Error - message not sent');
        }
    },

    updateChatsList: (newChat) => {
        set((state) => {
          const existingChat = state.chats.find(chat => chat._id === newChat._id);
      
          // If chat exists and hasn't changed, do nothing
          if (existingChat) {
            const isSameChat =
              JSON.stringify(existingChat) === JSON.stringify(newChat);
      
            if (isSameChat) return {}; // No update needed
          }
      
          let updatedChats;
      
          if (existingChat) {
            // Replace existing chat with updated one
            updatedChats = state.chats.map(chat =>
              chat._id === newChat._id ? newChat : chat
            );
          } else {
            // Add new chat
            updatedChats = [...state.chats, newChat];
          }

          return {
            chats: updatedChats,
            ...(newChat.latestMessage && {
              latestMessages: {
                ...state.latestMessages,
                [newChat._id]: newChat.latestMessage
              }
            })
          };
        });
    },  

    appendMessage: (chatId, newMessage) => {
        set((state) => {
            const existingMessages = state.messages[chatId] || [];
            const messageExists = existingMessages.some(msg => msg._id === newMessage._id);
    
            if (messageExists) {
                // Message already exists, but still update latestMessages in case it's newer
                return {
                    latestMessages: {
                        ...state.latestMessages,
                        [chatId]: newMessage
                    }
                };
            }
    
            return {
                messages: {
                    ...state.messages,
                    [chatId]: [...existingMessages, newMessage]
                },
                latestMessages: {
                    ...state.latestMessages,
                    [chatId]: newMessage
                }
            };
        });
    },

    markMessagesAsRead: async (chatId) => {
        try {
            await axiosInstance.put(`/chats/${chatId}/messages/mark-as-read`);
        } catch (error) {
            toast.error('Failed to mark messages as read');
        }
    },

    markMessagesAsReadLocally: (chatId, userId) => {
        set((state) => {
          const updated = (state.messages[chatId] || []).map((msg) => {
            if (msg.senderId !== userId && !msg.readBy.includes(userId)) {
              return {
                ...msg,
                readBy: [...msg.readBy, userId]
              };
            }
            return msg;
          });
      
          return {
            messages: {
              ...state.messages,
              [chatId]: updated
            }
          };
        });
    },
    
    getUnreadCount: (chatId) => {
        const userId = useAuthStore.getState().authUser._id;
        const messages = get().messages[chatId] || [];
        return messages.filter((msg) => msg.senderId !== userId && !msg.readBy.includes(userId)).length;
    },
    
    setSelectedChat: (selectedChat) => set({ selectedChat }),

    toggleInfoBox: () => set((state) => ({ showInfoBox: !state.showInfoBox })),

    setShowInfoBox: (value) => set((state) => ({ showInfoBox: value }))
}));