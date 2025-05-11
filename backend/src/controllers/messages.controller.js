import Message from '../models/message.model.js'

export const sendMessage = async (req, res) => {
    try {
        const { recipientId, text, image } = req.body;
        const senderId = req.user._id;

        if (!recipientId || (!text && !image)) {
            return res.status(400).json({ msg: 'Recipient and either text or image are required.' });
        }

        const newMessage = await Message.create({
            senderId,
            recipientId,
            text,
            image
        });

        res.status(201).json(newMessage);

    } catch (error) {
        console.log('Error in sendMessage controller: ', error.message);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

export const getMessages = async (req, res) => {
    const currentUserId = req.user._id;
    const { userId } = req.params;
    try {
        const messages = await Message.find({
            $or: [
                { senderId: currentUserId, recipientId: userId },
                { senderId: userId, recipientId: currentUserId }
            ]
        }).sort({ createdAt: 1 }); //Sort messages chronologically

        res.status(200).json(messages);

    } catch (error) {
        console.log('Error fetching messages:', error.message);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

export const markAsRead = () => {
    
};