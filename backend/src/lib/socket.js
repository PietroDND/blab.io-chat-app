import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import User from '../models/user.model.js';

const app = express();
const server = http.createServer(app);

const onlineUsers = new Map();

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173']
    }
});

export const getReceiverSocketId = (userId) => {
    return onlineUsers[userId];
};

io.on('connection', (socket) => {
    console.log('🔌 User connected: ', socket.id);

    socket.on('join', (userId) => {
        onlineUsers.set(userId, socket.id);
        socket.userId = userId;
        io.emit('online-users', Array.from(onlineUsers.keys())); //Broadcast online users list

        socket.on('join-chats', (chatIds) => {
            chatIds.forEach(chatId => socket.join(chatId));
        });

        socket.on('join-new-chat', (chat) => {
            socket.join(chat._id);
            io.to(chat._id).emit('get-new-chat', (chat));
        });

        socket.on('send-message', ({chatId, message}) => {
            io.to(chatId).emit('new-message', message);
        })
    });

    socket.on('disconnect', async () => {
        console.log('User disconnected: ', socket.id);
        if (socket.userId) {
            onlineUsers.delete(socket.userId);

            const lastSeen = new Date();
            //Save last seen in DB
            try {
                await User.findByIdAndUpdate(socket.userId, { lastSeen });
            } catch (err) {
                console.error(`❌ Failed to update lastSeen for user ${socket.userId}:`, err);
            }
            io.emit('user-went-offline' , {userId: socket.userId, lastSeen})
            io.emit('online-users', Array.from(onlineUsers.keys()));
        }
    });
});

export { io, app, server };