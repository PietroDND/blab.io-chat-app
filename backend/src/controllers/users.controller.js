import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
    try {
        const currentUser = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: currentUser}}).select('-password');
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log('Error in getUsers controller: ', error.message);
        res.status(500).json({msg: 'Internal Server Error'});
    }
};