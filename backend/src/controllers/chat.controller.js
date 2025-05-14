import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import Chat from "../models/chat.model.js";

const DEFAULT_GROUP_PIC_URL = 'https://res.cloudinary.com/db9yd5h2v/image/upload/v1747230380/group-chat-default_pettly.png';

export const getChats = async (req, res) => {
    const currentUserId = req.user._id;
    try {
        const chats = await Chat.find({ users: currentUserId })
            .populate('users', 'username profilePic')
            .populate({
                path: 'latestMessage',
                populate: { path: 'senderId', select: 'username' }
            })
            .sort({ updatedAt: -1 });

        if (!chats) {
            return res.status(404).json({ msg: 'Chat not found.' });
        }
        
        res.status(200).json(chats);
    } catch (error) {
        console.error('Error retrieving chats: ', error.message);
        res.status(500).json({ msg: 'Failed to fetch chats.' });
    }
};

export const getChatById = async (req, res) => {
    const currentUserId = req.user._id;
    const { chatId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return res.status(400).json({ msg: 'Invalid chat ID.' });
    }

    try {
        const chat = await Chat.find({ users: currentUserId, _id: chatId })
            .populate('users', 'username profilePic')
            .populate({
                path: 'latestMessage',
                populate: { path: 'senderId', select: 'username' }
            });

        if (!chat) {
            return res.status(404).json({ msg: 'Chat not found.' });
        }
        
        res.status(200).json(chat);
    } catch (error) {
        console.error('Error retrieving chat by ID: ', error.message);
        res.status(500).json({ msg: 'Failed to fetch chat by ID.' });
    }
};

export const createChat = async (req, res) => {
    const currentUserId = req.user._id;
    const users = Array.isArray(req.body.users) ? [...req.body.users] : null;
    const groupName = req.body.groupName;
    const rawGroupPic = req.body.groupPic;

    if (!users || users.length === 0) {
        return res.status(400).json({ msg: 'You must specify at least one user to create a chat.' });
    }

    if (!users.includes(currentUserId.toString())) {
        users.push(currentUserId);
    }
    //Check that every user is in valid ObjectId format
    for (const userId of users) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ msg: 'Invalid userId format' });
        }
    }
    
    const isGroupChat = users.length > 2;
    if (isGroupChat && (!groupName || groupName.trim() === '')) {
        return res.status(400).json({ msg: 'Group name is required for group chats.' });
    }
      

    let uploadedGroupPicUrl;
        if (isGroupChat && rawGroupPic) {
            try {
                const result = await cloudinary.uploader.upload(rawGroupPic, { 
                    folder: 'chat-group-avatars'
                });
                uploadedGroupPicUrl = result.secure_url;
            } catch (error) {
                console.warn('Cloudinary upload failed, using default groupPic:', error.message);
            }
        }

    try {
        const chatData = {
            users,
            isGroupChat,
            ...(isGroupChat && {
                groupName,
                groupAdmins: [currentUserId],
                ...(uploadedGroupPicUrl && { groupPic: uploadedGroupPicUrl })
            })
        };

        const chat = await Chat.create(chatData);
        await chat.populate('users', 'username profilePic');
        await chat.populate('groupAdmins', 'username');

        res.status(201).json(chat);
    } catch (error) {
        console.error('Error creating chat:', error.message);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

export const deleteChat = async (req, res) => {
    const { chatId } = req.params;
    const currentUserId = req.user._id;

    //Validate chatId
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return res.status(400).json({ msg: 'Invalid Chat ID.' });
    }

    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ msg: 'Chat not found.' });
        }

        const isParticipant = chat.users.some((id) => {
            return id.toString() === currentUserId.toString();
        });
        const isAdmin = chat.groupAdmins?.some((id) => {
            return id.toString() === currentUserId.toString();
        });
        if (!isParticipant) {
            return res.status(403).json({ msg: 'You are not authorized to delete this chat.' });
        }
        if (chat.isGroupChat && !isAdmin) {
            return res.status(403).json({ msg: 'Only group admins can delete group chats.' });
        }

        if (chat.isGroupChat && chat.groupPic && chat.groupPic !== DEFAULT_GROUP_PIC_URL) {
            const groupPicPublicId = chat.groupPic.split('/').slice(7).join('/').split('.')[0];
            try {
                await cloudinary.uploader.destroy(groupPicPublicId); // Delete from Cloudinary
                /* console.log('Cloudinary delete result:', result); // Log the result
                if (result.result === 'ok') {
                    console.log(`Group picture deleted from Cloudinary: ${groupPicPublicId}`);
                } else {
                    console.log(`Failed to delete group picture from Cloudinary: ${result.message}`);
                } */
            } catch (error) {
                console.error('Error deleting group picture from Cloudinary: ', error.message);
            }
        }

        //Delete document from MongoDB
        await Chat.findByIdAndDelete(chatId);
        res.status(200).json({ msg: 'Chat deleted successfully.' });
    } catch (error) {
        console.error('Error deleting chat: ', error.message);
        res.status(500).json({ msg: 'Internal Server Error' });

    }
};

/* export const getGroupChat = (req, res) => {
    const chat = req.chat;
    if (!chat) {
        res.status(500).json({ msg: 'Internal Server Error'});
    }
    
    res.status(201).json(chat);
}; */