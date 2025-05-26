import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js';
import usersRoutes from './routes/users.route.js';
import chatsRoutes from './routes/chat.route.js';
import { connectDB } from './lib/db.js';
import { app, server } from './lib/socket.js';
import path from 'path';

dotenv.config();
const PORT = process.env.PORT;
const __dirname = path.resolve();

//Middlewares
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

//Routes
app.use('/api/auth', authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/chats", chatsRoutes);
app.use("/api/chats/:chatId/messages", messageRoutes);

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, '../../frontend/dist')));
    
    app.get('/{*any}', (req, res) => {
        res.sendFile(path.join(__dirname, '../../frontend', 'dist', 'index.html'));
    });
}

server.listen(PORT, () => {
    console.log('Server is running on port ', PORT);
    connectDB();
});