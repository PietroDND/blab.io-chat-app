import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: ''},
    lastSeen: { type: Date },
    isAdmin: { type: Boolean, required: true}
}, { timestamps: true} );

const User = mongoose.model('User', userSchema);

export default User;