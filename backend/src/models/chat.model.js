import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    groupName: { type: String }, // Optional for group chats
    groupPic: { type: String, default: 'https://res.cloudinary.com/db9yd5h2v/image/upload/v1747230380/group-chat-default_pettly.png'}, // Optional for group chats
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    groupAdmins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
