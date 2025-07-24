import jwt from 'jsonwebtoken';

export const isLoggedIn = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({ message: 'Authentication Failed' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(400).json({ message: 'Server error' });
    }
};
