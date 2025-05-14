import mongoose from 'mongoose';
import Chat from '../models/chat.model.js';

export const getOrCreateChat = async (req, res, next) => {
    try {
        let users = [...req.body.users];
        const groupPic = req.body.groupPic || '';
        const groupName = req.body.groupName || `${req.user?.username || 'Unknown'}'s Group`;
        const currentUserId = req.user._id;

        if (!users || users.length === 0) {
            return res.status(400).json({ msg: 'Users are required to create/get a chat' });
        }

        if (!users.includes(currentUserId)) {
            users.push(currentUserId);
        }

        //Check that every user is in valid ObjectId format
        for (const userId of users) {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ msg: 'Invalid userId format' });
            }
        }

        let chat;

        //Case 1-on-1 chat (2 users)
        if (users.length === 2) {
            chat = await Chat.findOne({
            isGroupChat: false,
            users: { $all: users, $size: 2 }
            });
        
            if (!chat) {
                chat = await Chat.create({
                    users,
                    isGroupChat: false
                });
            }

            await chat.populate('users', '-password');
        }

        if (users.length > 2) {
            chat = await Chat.findOne({
                isGroupChat: true,
                users: { $all: users, $size: users.length }
            });

            if (!chat) {
                chat = await Chat.create({
                    groupName,
                    groupPic,
                    users,
                    isGroupChat: true,
                    groupAdmin: currentUserId
                });
            }

            await chat.populate('users', '-password');
        }

        req.chat = chat;
        next();

    } catch (error) {
        console.log('Error in getOrCreateChat middleware:', error.message);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};