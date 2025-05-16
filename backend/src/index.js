import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js';
import usersRoutes from './routes/users.route.js';
import chatsRoutes from './routes/chat.route.js';
import { connectDB } from './lib/db.js';
import { app, server } from './lib/socket.js';

dotenv.config();
const PORT = process.env.PORT;

//Middlewares
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
// app.use(morgan('tiny'));

//Routes
app.use('/api/auth', authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/chats", chatsRoutes);
app.use("/api/chats/:chatId/messages", messageRoutes);

server.listen(PORT, () => {
    console.log('Server is running on port ', PORT);
    connectDB();
});