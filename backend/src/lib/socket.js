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

function logRoomStatus(io, roomId) {
    const room = io.sockets.adapter.rooms.get(roomId);
    if (room) {
        const socketIds = Array.from(room);
        console.log(`Room ${roomId} has ${socketIds.length} socket(s):`, socketIds);
    } else {
        console.log(`Room ${roomId} does not exist or is empty.`);
    }
}


io.on('connection', (socket) => {
    console.log('🔌 User connected: ', socket.id);

    socket.on('join', (userId) => {
        onlineUsers.set(userId, socket.id);
        socket.userId = userId;
        io.emit('online-users', Array.from(onlineUsers.keys())); //Broadcast online users list

        socket.on('join-chats', (chatIds) => {
            chatIds.forEach(chatId => socket.join(chatId)); //Join every chat the user is in
        });
    });

    socket.on('send-message', ({ chatId, message }) => {
        // Emit to all users in the room (chatId = room name)
        socket.to(chatId).emit('get-new-message', { chatId, message });
    });

    socket.on('new-chat', (chat) => {
        const chatId = chat._id;
        socket.join(chatId);

        //Make all other users join the new chat room
        chat.users.forEach((user) => {
            const targetSocketId = onlineUsers.get(user._id);
            if (targetSocketId && targetSocketId !== socket.id) {
                io.to(targetSocketId).emit('get-new-chat', chat); // emit full chat info
                io.sockets.sockets.get(targetSocketId)?.join(chatId); // force join to room
            }
        });
    });

    socket.on('leave-group-chat', (chatId) => {
        socket.leave(chatId);
        io.to(chatId).emit('user-left-group-chat', chatId);
    });

    socket.on('add-to-chat', (chat, addedUsers) => {
        //Make all added users join the new chat room
        addedUsers.forEach((user) => {
            const targetSocketId = onlineUsers.get(user._id);
            if (targetSocketId && targetSocketId !== socket.id) {
                io.to(targetSocketId).emit('get-new-chat', chat); // emit full chat info
                io.sockets.sockets.get(targetSocketId)?.join(chat); // force join to room
            }
        });
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