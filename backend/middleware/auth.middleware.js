import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

export const isLoggedIn = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({ message: 'Authentication Failed' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await user.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(400).json({ message: 'Server error' });
    }
};
