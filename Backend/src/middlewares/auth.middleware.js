import jwt from 'jsonwebtoken';
import User from '../models/User.js';

import BlacklistedToken from '../models/BlacklistedToken.js';

export const protect = async (req, res, next) => {
    let token = req.cookies.jwt;

    if (token) {
        try {
            // Check if token is blacklisted
            const isBlacklisted = await BlacklistedToken.findOne({ token });
            if (isBlacklisted) {
                return res.status(401).json({ message: 'Not authorized, token revoked' });
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token and attach to req
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};
