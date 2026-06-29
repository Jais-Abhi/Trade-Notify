import mongoose from 'mongoose';

const userToolPreferenceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    tools: [
        {
            tool: {
                type: String,
                required: true,
            },
            style: {
                type: mongoose.Schema.Types.Mixed,
                default: {},
            },
            options: {
                type: mongoose.Schema.Types.Mixed,
                default: {},
            },
        }
    ]
}, {
    timestamps: true,
});

const UserToolPreference = mongoose.model('UserToolPreference', userToolPreferenceSchema);
export default UserToolPreference;
