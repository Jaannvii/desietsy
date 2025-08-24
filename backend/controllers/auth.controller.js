import mongoose from 'mongoose';
import User from '../models/User.model.js';
import Artisan from '../models/Artisan.model.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const registerUser = async (req, res) => {
    const { username, email, password, role } = req.body;

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
            role: role || 'user',
        });
        if (!user) {
            return res.status(400).json({ message: 'Error creating user' });
        }

        if (role === 'Artisan') {
            const artisan = await Artisan.create({
                userId: user._id,
                shopName: '',
                bio: '',
                contactNumber: '',
                address: {
                    street: '',
                    city: '',
                    state: '',
                    postalCode: '',
                    country: '',
                },
                isVerified: false,
            });
            if (!artisan) {
                return res
                    .status(400)
                    .json({ message: 'Error creating artisan profile' });
            }

            await artisan.save();
        }

        const token = crypto.randomBytes(20).toString('hex');
        user.verificationToken = token;
        await user.save();

        try {
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
                    `${process.env.FRONTEND_URL}/auth/verify-email/${token}`,
            };

            await transport.sendMail(mailOptions);
        } catch (err) {
            return res.status(500).json({
                message: 'Error sending verification email',
                error: err.message,
            });
        }

        return res.status(201).json({
            message: `${username} registered successfully`,
            token,
        });
    } catch (err) {
        return res
            .status(400)
            .json({ message: 'Error registering user', error: err.message });
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

    if (!user) {
        const verifiedUser = await User.findOne({
            isVerified: true,
            verificationToken: undefined,
        });
        if (verifiedUser) {
            return res.status(200).json({ message: 'Email already verified' });
        }
        return res.status(400).json({ message: 'Invalid token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;

    await user.save();

    if (!user.isVerified) {
        return res.status(400).json({ message: 'Email verification failed' });
    }

    return res.status(200).json({
        message: 'Email verified successfully',
        user: {
            id: user._id,
            username: user.username,
            role: user.role,
        },
    });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(400).json({
                message: 'Email not verified',
                token: user.verificationToken,
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRE_TIME,
            }
        );

        const cookieOptions = {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        };
        res.cookie('token', token, cookieOptions);

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
            },
        });
    } catch (err) {
        return res
            .status(400)
            .json({ message: 'Error logging in user', error: err.message });
    }
};

const getMe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not Authenticated' });
        }

        return res.status(200).json({
            user: {
                id: req.user._id,
                username: req.user.username,
                email: req.user.email,
                role: req.user.role,
            },
        });
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Error fetching user data', error: err.message });
    }
};

const logoutUser = async (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logout successful' });
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

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
            subject: 'Password Reset',
            text:
                `Please click on the following link:\n\n` +
                `${process.env.BASE_URL}/api/desietsy/reset-password/${resetToken}`,
        };
        await transport.sendMail(mailOptions);

        return res.status(200).json({
            message: 'Password reset link is sent to your email',
        });
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Error sending reset email', error: err.message });
    }
};

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    if (!token || !newPassword) {
        return res.status(400).json({ message: 'Invalid request' });
    }
    if (newPassword.length < 6) {
        return res.status(400).json({
            message: 'New password must be at least 6 characters long',
        });
    }

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return res.status(200).json({ message: 'Password reset successful' });
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Error resetting password', error: err.message });
    }
};

const getUserRole = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }
        const user = await User.findById(id).select('role');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ role: user.role });
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Error fetching user role', error: err.message });
    }
};

export {
    registerUser,
    verifyUser,
    loginUser,
    getMe,
    logoutUser,
    forgotPassword,
    resetPassword,
    getUserRole,
};
