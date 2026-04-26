import User from '../models/User.js';

/**
 * @desc    Add stock to user's wishlist
 * @route   POST /api/wishlist
 * @access  Private
 */
export const addToWishlist = async (req, res) => {
    try {
        const { symbol, name, series, isin } = req.body;

        if (!symbol || !name) {
            return res.status(400).json({
                success: false,
                message: 'Symbol and Name are required'
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if stock already exists in wishlist
        const exists = user.wishlist.some(item => item.symbol === symbol);

        if (exists) {
            return res.status(400).json({
                success: false,
                message: 'Stock already in wishlist'
            });
        }

        // Add to wishlist
        user.wishlist.push({ symbol, name, series, isin });
        await user.save();

        return res.status(201).json({
            success: true,
            message: 'Stock added to wishlist',
            data: user.wishlist
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * @desc    Get all stocks from user's wishlist
 * @route   GET /api/wishlist
 * @access  Private
 */
export const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: user.wishlist
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * @desc    Remove stock from user's wishlist
 * @route   DELETE /api/wishlist/:symbol
 * @access  Private
 */
export const removeFromWishlist = async (req, res) => {
    try {
        const { symbol } = req.params;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Filter out the stock
        const initialLength = user.wishlist.length;
        user.wishlist = user.wishlist.filter(item => item.symbol !== symbol);

        if (user.wishlist.length === initialLength) {
            return res.status(404).json({
                success: false,
                message: 'Stock not found in wishlist'
            });
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Stock removed from wishlist',
            data: user.wishlist
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};
