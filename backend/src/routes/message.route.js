import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { sendMessage, getMessages, markMessagesAsRead, getMessageById, editMessageById, deleteMessageById, getChatImages } from '../controllers/message.controller.js';
import { getOrCreateChat } from '../middleware/chat.middleware.js';

const router = express.Router({ mergeParams: true });

router.get('/', protectRoute, getMessages);
router.get('/images', protectRoute, getChatImages);
router.get('/:messageId', protectRoute, getMessageById);
router.post('/', protectRoute, sendMessage);
router.put('/mark-as-read', protectRoute, markMessagesAsRead);
router.patch('/:messageId', protectRoute, editMessageById);
router.delete('/:messageId', protectRoute, deleteMessageById);

export default router;
