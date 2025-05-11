import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/messages.route.js';
import { connectDB } from './lib/db.js';

dotenv.config();
const PORT = process.env.PORT;

const app = express();
const server = http.createServer(app);

//Middlewares
app.use(express.json());
app.use(cookieParser());

//Routes
app.use('/api/auth', authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
    console.log('Server is running on port ', PORT);
    connectDB();
});