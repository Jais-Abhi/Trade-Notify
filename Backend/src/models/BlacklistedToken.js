import mongoose from 'mongoose';

const blacklistedTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 30 * 24 * 60 * 60, // Automatically delete from database after 30 days
    },
});

const BlacklistedToken = mongoose.model('BlacklistedToken', blacklistedTokenSchema);
export default BlacklistedToken;
