import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { useAuthStore } from './authStore.js';
import { useUserStore } from './userStore.js';

export const useChatStore = create((set, get) => ({
    chats: [],
    chatImages: [],
    messages: {},
    latestMessages: {},
    selectedChat: null,
    isMessagesLoading: false,
    isImagesLoading: false,
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

    getChatById: async (chatId) => {
        try {
            const res = await axiosInstance.get(`/chats/${chatId}`);
            get().updateChatsList(res.data);
        } catch (error) {
            toast.error(error.response.data.msg);
            return null;
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

    getImages: async (chatId) => {
        set({ isImagesLoading: true });
        
        try {
            const res = await axiosInstance.get(`/chats/${chatId}/messages/images`);
            set({ chatImages: res.data });
        } catch (error) {
            toast.error(error?.response?.data?.msg || 'Failed to fetch images');
        } finally {
            set({ isImagesLoading: false });
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

    addMembersGroupChat: async (chatId, usersToAdd) => {
        try {
            const res = await axiosInstance.patch(`/chats/${chatId}/manage-users`, {usersToAdd});
            const addedUsersIds = res.data?.changes?.added;

            if (!addedUsersIds || addedUsersIds.length === 0) return;
            const allUsers = useUserStore.getState().users;
            const addedUsers = addedUsersIds.map((id) => allUsers.find((u) => u._id === id)).filter(Boolean);
            if (addedUsers.length === 0) return;
            get().updateMembersGroupChat(chatId, addedUsers);

            const socket = useAuthStore.getState().socket;
            if (!socket || !socket.connected) {
                console.error('Socket not ready or connected.');
                return;
            }
            const updatedChat = get().chats.find((chat) => chat._id === chatId);
            socket.emit('add-to-chat', updatedChat, addedUsers);
        } catch (error) {
            toast.error(error.response.data.msg || 'Failed to add new members to group chat');
        }
    },

    leaveGroupChat: async (chatId) => {
        try {
            await axiosInstance.patch(`/chats/${chatId}/leave-group`);

            const socket = useAuthStore.getState().socket;
            if (!socket || !socket.connected) {
                console.error('Socket not ready or connected.');
                return;
            }
            socket.emit('leave-group-chat', chatId);
            get().removeChatFromList(chatId);
        } catch (error) {
            toast.error(error.response.data.msg || 'Failed to leave group chat');
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
            toast.error(error.response.data.msg);
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
    
    removeChatFromList: (chatId) => {
        set((state) => {
            const updatedChats = state.chats.filter(chat => chat._id !== chatId);
            const updatedMessages = { ...state.messages };
            delete updatedMessages[chatId];

            return {
                selectedChat: null,
                chats: updatedChats,
                messages: updatedMessages
            };
        });
    },

    updateMembersGroupChat: (chatId, addedUsers) => {
        set((state) => {
            const updatedChats = state.chats.map((chat) => {
              if (chat._id === chatId) {
                const newUsers = addedUsers.filter(
                  (newUser) => !chat.users.some((u) => u._id === newUser._id)
                );

                return {
                  ...chat,
                  users: [...chat.users, ...newUsers],
                };
              }
              return chat;
            });
            return { chats: updatedChats };
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