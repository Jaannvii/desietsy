import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

const isLoggedIn = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(400).json({ message: 'Authentication Failed' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(400).json({ message: 'Server error' });
    }
};

const authorize = (...roles) => {
    return async (req, res, next) => {
        const user = await User.findById(req.user._id);
        if (!user || !roles.includes(req.user.role)) {
            return res.status(400).json({ message: 'Access denied' });
        }

        next();
    };
};

export { isLoggedIn, authorize };
