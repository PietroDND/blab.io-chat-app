import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { sendMessage, getMessages, markAsRead } from '../controllers/messages.controller.js';
import { getOrCreateChat } from '../middleware/chat.middleware.js';

const router = express.Router();

router.post('/', protectRoute, getOrCreateChat, sendMessage); // Send a message
router.get('/:chatId', protectRoute, getMessages); // Get messages with a user
router.patch('/mark-as-read/:messageId', protectRoute, markAsRead); // Mark message as read

export default router;
