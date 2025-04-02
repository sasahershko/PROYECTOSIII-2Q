import mongoose from 'mongoose';

const storageSchema = new mongoose.Schema(
    {
        filename: String,
        url: String
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model('storage', storageSchema);
