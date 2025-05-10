import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const result = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${result.connection.host}`);
    } catch (error) {
        console.log('MongoDB Connection Failed: ', error);
    }
};