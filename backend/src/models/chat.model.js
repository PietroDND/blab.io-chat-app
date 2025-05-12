import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    name: { type: String }, // Optional for group chats
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
