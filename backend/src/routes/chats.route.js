import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getChats } from '../controllers/chats.controller.js';

const router = express.Router();

router.get('/', protectRoute, getChats); // Get messages with a user

export default router;
