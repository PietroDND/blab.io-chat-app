import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { sendMessage, getMessages, markAsRead } from '../controllers/messages.controller.js';

const router = express.Router();

router.post('/', protectRoute, sendMessage); // Send a message
router.get('/:userId', protectRoute, getMessages); // Get messages with a user
router.patch('/mark-as-read/:messageId', protectRoute, markAsRead); // Mark message as read

export default router;
