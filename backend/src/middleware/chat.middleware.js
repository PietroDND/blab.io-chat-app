import mongoose from 'mongoose';
import Chat from '../models/chat.model.js';

export const getOrCreateChat = async (req, res, next) => {
    try {
        const recipientId = mongoose.Types.ObjectId.createFromHexString(req.body.recipientId);
        const currentUserId = req.user._id;

        console.log('Looking for chat with users:', currentUserId, recipientId);

        if (!recipientId) {
            return res.status(400).json({ msg: 'recipientId is required' });
        }

        //Find existing one-on-one chat
        let chat = await Chat.findOne({
            isGroupChat: false,
            users: { $all: [recipientId, currentUserId], $size: 2 }
        });
        console.log('Found chat: ', chat);
        
        if (!chat) {
            console.log('Enter create chat');
            chat = await Chat.create({
                users: [currentUserId, recipientId],
                isGroupChat: false
            });
        }
        await chat.populate('users', '-password');
        req.chat = chat;
        next();

    } catch (error) {
        console.log('Error in getOrCreateChat middleware:', error.message);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};