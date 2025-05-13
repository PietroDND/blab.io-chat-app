import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getUsers } from '../controllers/users.controller.js';

const router = express.Router();

router.get('/', protectRoute, getUsers); // Send a message

export default router;
