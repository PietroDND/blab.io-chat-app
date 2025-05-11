import Chat from '../models/chat.model.js';
import Message from '../models/message.model.js'

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const senderId = req.user._id;
        const chatId = req.chat._id;

        if (!chatId) {
            return res.status(404).json({ msg: 'Chat not found or failed to create.' });
        }
        if (!text && !image) {
            return res.status(400).json({ msg: 'You must provide at least a text or image message.' });
        }

        const newMessage = await Message.create({
            chatId,
            senderId,
            text,
            image
        });

        //Update latest message
        req.chat.latestMessage = newMessage._id;
        await req.chat.save();

        const fullMessage = await newMessage.populate('senderId', 'username profilePic');

        res.status(201).json(fullMessage);

    } catch (error) {
        console.log('Error in sendMessage controller: ', error.message);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

export const getMessages = async (req, res) => {
    const currentUserId = req.user._id;
    const { chatId } = req.params;
    try {
        //Ensure user is part of the chat
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ msg: 'Chat not found' });
        }

        if (!chat.users.includes(currentUserId)) {
            return res.status(403).json({ msg: 'Access denied. You are not part of this chat.' });
        }

        // Fetch all messages in the chat
        const messages = await Message.find({ chatId })
            .populate('senderId', 'username profilePic')
            .sort({ createdAt: 1 });
            
        res.status(200).json(messages);

    } catch (error) {
        console.log('Error fetching messages:', error.message);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

export const markAsRead = () => {
    
};