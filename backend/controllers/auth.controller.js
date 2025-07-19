import User from '../models/user.model.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

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

export { registerUser };
