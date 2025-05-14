import Chat from "../models/chat.model.js";

export const getChats = async (req, res) => {
    const currentUserId = req.user._id;
    try {
        const userChats = await Chat.find({ users: currentUserId })
            .populate('users', 'username profilePic')
            .populate({
                path: 'latestMessage',
                populate: { path: 'senderId', select: 'username' }
            })
            .sort({ updatedAt: -1 });
        
        res.status(200).json(userChats);
    } catch (error) {
        console.error('Error retrieving chats:', error);
        res.status(500).json({ msg: 'Failed to fetch chats.' });
    }
};

export const getGroupChat = (req, res) => {
    const chat = req.chat;
    if (!chat) {
        res.status(500).json({ msg: 'Internal Server Error'});
    }
    
    res.status(201).json(chat);
};