import mongoose from 'mongoose';
import Chat from '../models/chat.model.js';
import Message from '../models/message.model.js'
import cloudinary from '../lib/cloudinary.js';

export const getMessages = async (req, res) => {
    //TO-DO: PAGINATION
    const currentUserId = req.user._id;
    const { chatId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return res.status(400).json({ msg: 'Invalid chat ID.' });
    }

    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ msg: 'Chat not found.' });
        }

        if (!chat.users.includes(currentUserId)) {
            return res.status(403).json({ msg: 'User unauthorized to retrieve messages from this chat.' });
        }

        const messages = await Message.find({ chatId })
            .sort({ createdAt: 1 })
            .populate('senderId', 'username profilePic');
        
        res.status(200).json({messages});
    } catch (error) {
        console.error("Error in getMessages:", error.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

export const getMessageById = async (req, res) => {
    const currentUserId = req.user._id;
    const { chatId, messageId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return res.status(400).json({ msg: 'Invalid chat ID.' });
    }

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
        return res.status(400).json({ msg: 'Invalid message ID.' });
    }

    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ msg: 'Chat not found.' });
        }

        if (!chat.users.includes(currentUserId)) {
            return res.status(403).json({ msg: 'User unauthorized to retrieve messages from this chat.' });
        }

        const message = await Message.findOne({ chatId, _id: messageId })
            .populate('senderId', 'username profilePic');
        if (!message) {
            return res.status(404).json({ msg: 'Message not found.' });
        }
        res.status(200).json({message});
    } catch (error) {
        console.error(`Error in getMessageById for user ${currentUserId} in chat ${chatId}: `, error.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

export const getChatImages = async (req, res) => {
    const currentUserId = req.user._id;
    const { chatId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return res.status(400).json({ msg: 'Invalid chat ID.' });
    }

    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ msg: 'Chat not found.' });
        }

        if (!chat.users.includes(currentUserId)) {
            return res.status(403).json({ msg: 'User unauthorized to retrieve messages from this chat.' });
        }

        const imageMessages = await Message.find({
            chatId,
            image: { $exists: true, $ne: '' }
        }).select('image senderId createdAt')
        .populate('senderId', 'username');

        res.status(200).json(imageMessages);
    } catch (error) {
        console.error(`Error in getChatImages for user ${currentUserId} in chat ${chatId}: `, error.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

export const sendMessage = async (req, res) => {
    const { text, image } = req.body;
    const senderId = req.user._id;
    const { chatId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return res.status(400).json({ msg: 'Invalid chat ID.' });
    }

    if (!text && !image) {
        return res.status(400).json({ msg: 'No text or image provided.' });
    }

    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ msg: 'Chat not found.' });
        }

        if (!chat.users.includes(senderId)) {
            return res.status(403).json({ msg: 'User unauthorized to send messages in this chat.' });
        }

        let uploadedImage;

        if (image) {
            try {
                const result = await cloudinary.uploader.upload(image, { 
                    folder: `${chat._id}-chat-images-folder`
                });
                uploadedImage = result.secure_url;
            } catch (error) {
                console.warn('Cloudinary upload failed:', error.message);
            }
        }

        const newMessage = await Message.create({
            chatId,
            senderId,
            text,
            image: uploadedImage || image,
            readBy: [senderId]
        });

        //Update latest message in chat
        chat.latestMessage = newMessage._id;
        await chat.save();
        await newMessage.populate('senderId', 'username profilePic');

        res.status(201).json(newMessage);
    } catch (error) {
        console.log('Error in sendMessage: ', error.message);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

export const deleteMessageById = async (req, res) => {
    //TO-DO
};

export const editMessageById = async (req, res) => {
    //TO-DO
};

export const markMessagesAsRead = async (req, res) => {
    const userId = req.user._id;
    const { chatId } = req.params;

    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ msg: 'Chat not found.' });
        }

        if (!chat.users.includes(userId)) {
            return res.status(403).json({ msg: 'User unauthorized to read messages in this chat.' });
        }

        await Message.updateMany(
            {
                chatId,
                readBy: {$ne: userId}
            },
            {
                $addToSet: { readBy: userId }
            }
        );

        res.status(200).json({ msg: 'Messages marked as read' });
    } catch (error) {
        console.log('Error in markMessagesAsRead: ', error.message);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};