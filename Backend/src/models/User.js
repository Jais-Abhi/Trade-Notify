import mongoose from 'mongoose';

const wishlistItemSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    series: {
        type: String,
    },
    isin: {
        type: String,
    }
}, { _id: false });

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        wishlist: [wishlistItemSchema]
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);
export default User;
