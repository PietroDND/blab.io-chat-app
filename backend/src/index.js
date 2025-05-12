import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
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
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(morgan('tiny'));

//Routes
app.use('/api/auth', authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
    console.log('Server is running on port ', PORT);
    connectDB();
});