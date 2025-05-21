import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import Chat from "../models/chat.model.js";
import { io } from "../lib/socket.js";

const DEFAULT_GROUP_PIC_URL = 'https://res.cloudinary.com/db9yd5h2v/image/upload/v1747230380/group-chat-default_pettly.png';

export const getChats = async (req, res) => {
    const currentUserId = req.user._id;
    try {
        const chats = await Chat.find({ users: currentUserId })
            .populate('users', 'username fullname profilePic lastSeen')
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
        console.error('Error in getChats: ', error.message);
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
        const chat = await Chat.findOne({ users: currentUserId, _id: chatId })
            .populate('users', 'username profilePic lastSeen')
            .populate({
                path: 'latestMessage',
                populate: { path: 'senderId', select: 'username' }
            });

        if (!chat) {
            return res.status(404).json({ msg: 'Chat not found.' });
        }
        
        res.status(200).json(chat);
    } catch (error) {
        console.error('Error in getChatById: ', error.message);
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
        console.error('Error in createChat: ', error.message);
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
        console.error('Error in deleteChat: ', error.message);
        res.status(500).json({ msg: 'Internal Server Error' });

    }
};

export const updateChat = async (req, res) => {
    const currentUserId = req.user._id;
    const { chatId } = req.params;
    const { groupName, groupPic } = req.body;
    const updatedInfo = {};

    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ msg: 'Chat not found.' });
        }
        if (!chat.isGroupChat) {
            return res.status(403).json({ msg: "You can't modify title or image of 1-on-1 chats." });
        }

        const isParticipant = chat.users.some((id) => {
            return id.toString() === currentUserId.toString();
        });

        if (!isParticipant) {
            return res.status(403).json({ msg: 'You are not authorized to update this chat.' });
        }

        //Add new name to updatedInfo object
        if (groupName && groupName.length > 0 && groupName.trim() !== '') updatedInfo.groupName = groupName;
        //Handle image modification
        if (groupPic) {
            if (chat.isGroupChat) {

                if (chat.groupPic && chat.groupPic !== DEFAULT_GROUP_PIC_URL) {
                    const groupPicPublicId = chat.groupPic.split('/').slice(7).join('/').split('.')[0];
                        try {
                            await cloudinary.uploader.destroy(groupPicPublicId); // Delete from Cloudinary
                        } catch (error) {
                            console.error('Error deleting group picture from Cloudinary: ', error.message);
                        }
                }

                try {
                    const result = await cloudinary.uploader.upload(groupPic, { 
                        folder: 'chat-group-avatars'
                    });
                    updatedInfo.groupPic = result.secure_url;
                } catch (error) {
                    console.warn('Cloudinary upload failed, using default groupPic:', error.message);
                }
            }
        }

        // If no updates were made
        if (Object.keys(updatedInfo).length === 0) {
            return res.status(400).json({ msg: 'No updates were provided.' });
        }

        //Apply updates to chat
        Object.assign(chat, updatedInfo);
        await chat.save();
        await chat.populate('users', 'username profilePic');
        await chat.populate('groupAdmins', 'username');
        await chat.populate({
            path: 'latestMessage',
            populate: { path: 'senderId', select: 'username' }
        })

        res.status(200).json(chat);
    } catch (error) {
        console.error('Error in updateChat :', error.message);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

export const manageChatUsers = async (req, res) => {
    const currentUserId = req.user._id;
    const { chatId } = req.params;
    const { 
        usersToAdd = [],
        usersToRemove = [], 
        usersToPromote = [], 
        usersToDemote = [] 
    } = req.body;

    const formatId = (userId) => {
        if (!mongoose.Types.ObjectId.isValid(userId)) return null;
        return mongoose.Types.ObjectId.createFromHexString(userId);
    };

    try {
        const changes = {
            added: [],
            removed: [],
            promoted: [],
            demoted: []
        };

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ msg: 'Chat not found.' });
        }

        //Check that logged user in a chat admin and participant
        if (
            !chat.users.includes(currentUserId) ||
            !chat.groupAdmins.includes(currentUserId)
        ) {
            return res.status(403).json({ msg: 'You are not authorized to carry this operation.' });
        }
        
        //ADD USERS
        for (const userId of usersToAdd) {
            const formattedUserId = formatId(userId);
            if (formattedUserId && !chat.users.includes(formattedUserId)) {
                chat.users.push(formattedUserId);
                changes.added.push(formattedUserId);
            }
        }

        //REMOVE USERS
        for (const userId of usersToRemove) {
            const formattedUserId = formatId(userId);
            //Eventually remove user from admin list first
            if (chat.groupAdmins.includes(formattedUserId)) {
                chat.groupAdmins.splice(chat.groupAdmins.indexOf(formattedUserId), 1);
            }

            if (formattedUserId && chat.users.includes(formattedUserId)) {
                const removeIndex = chat.users.indexOf(formattedUserId);
                chat.users.splice(removeIndex, 1);
                changes.removed.push(formattedUserId);
            }
        }

        //PROMOTE USERS TO ADMIN ROLE
        for (const userId of usersToPromote) {
            const formattedUserId = formatId(userId);;
            if (
                formattedUserId && 
                chat.users.includes(formattedUserId) &&
                !chat.groupAdmins.includes(formattedUserId)
            ) {
                chat.groupAdmins.push(formattedUserId);
                changes.promoted.push(formattedUserId);
            }
        }

        //DEMOTE USERS FROM ADMIN ROLE
        for (const userId of usersToDemote) {
            const formattedUserId = formatId(userId);

            //Check if the logged user is trying to demote himself and block the operation if there aren't other admins in the group
            if (formattedUserId.equals(currentUserId) && chat.groupAdmins.length === 1) continue;

            if (
                formattedUserId && 
                chat.users.includes(formattedUserId) &&
                chat.groupAdmins.includes(formattedUserId)
            ) {
                const removeIndex = chat.groupAdmins.indexOf(formattedUserId);
                chat.groupAdmins.splice(removeIndex, 1);
                changes.demoted.push(formattedUserId);
            }
        }

        await chat.save();
        res.status(200).json({ msg: 'Chat data updated.', changes });
    } catch (error) {
        console.log('Error in manageChatUsers: ', error.message);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
}