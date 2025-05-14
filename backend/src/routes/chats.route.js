import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getChats, getGroupChat } from '../controllers/chats.controller.js';
import { getOrCreateChat } from '../middleware/chat.middleware.js';

const router = express.Router();

router.get('/', protectRoute, getChats); // Get messages with a user
router.post('/', protectRoute, getOrCreateChat, getGroupChat); //Create a new group chat

export default router;
