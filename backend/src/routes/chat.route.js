import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getChats, getChatById, createChat, deleteChat, updateChat, manageChatUsers } from '../controllers/chat.controller.js';

const router = express.Router();

router.get('/', protectRoute, getChats); // Get all chats that includes the logged user
router.get('/:chatId', protectRoute, getChatById) //Get a single chat by specified ID

router.post('/', protectRoute, createChat); //Create a chat (1-on-1 or group chat)

//TO-DO
router.patch('/:chatId', protectRoute, updateChat); //Update info such as chat name, chat avatar,... (for group chats)
router.patch('/:chatId/manage-users', protectRoute, manageChatUsers); //Add/Remove participant, Promote/Demote admins

router.delete('/:chatId', protectRoute, deleteChat); //Delete selected chat by ID

export default router;
