import User from '../models/user.model.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !password || !email) {
        res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({
            message: 'Password must be at least 6 characters long',
        });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            username,
            email,
            password,
        });

        if (!user) {
            return res.status(400).json({ message: 'Error creating user' });
        }

        const token = crypto.randomBytes(20).toString('hex');
        user.verificationToken = token;
        await user.save();

        var transport = nodemailer.createTransport({
            host: 'sandbox.smtp.mailtrap.io',
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS,
            },
        });

        const mailOptions = {
            from: `"${process.env.MAILTRAP_SENDERNAME}" <${process.env.MAILTRAP_SENDEREMAIL}>`,
            to: user.email,
            subject: 'Verify your email',
            text:
                'Please verify your email by clicking the link below:\n\n' +
                `${process.env.BASE_URL}/api/desietsy/verify-email/${token}`,
        };

        await transport.sendMail(mailOptions);

        return res
            .status(201)
            .json({ message: `${username} registered successfully` });
    } catch (error) {
        return res.status(400).json({ message: 'Error registering user' });
    }
};

const verifyUser = async (req, res) => {
    const { token } = req.params;
    if (!token) {
        return res.status(400).json({ message: 'Invalid token' });
    }

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
        return res.status(400).json({ message: 'Invalid token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: 'Email not verified' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        };
        res.cookie('token', token, cookieOptions);

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
            },
        });
    } catch (error) {
        return res.status(400).json({ message: 'Error logging in user' });
    }
};

export { registerUser, verifyUser, loginUser };
