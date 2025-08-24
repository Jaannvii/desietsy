import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

const isLoggedIn = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ message: 'Authentication Failed' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Server error' });
    }
};

const authorize = (...roles) => {
    return async (req, res, next) => {
        const user = req.user;
        if (!user || !roles.includes(user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        next();
    };
};

export { isLoggedIn, authorize };
