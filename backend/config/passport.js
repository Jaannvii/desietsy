import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.model.js';
import jwt from 'jsonwebtoken';
import {config} from '../config.js';

dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            callbackURL: `${config.BASE_URL}/auth/google/callback`,
        },
        async (profile, done) => {
            try {
                let user = await User.findOne({
                    email: profile.emails[0].value,
                });
                if (!user) {
                    user = await User.create({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        password: profile.id,
                        role: 'user',
                    });
                }

                const token = jwt.sign(
                    { id: user._id },
                    config.JWT_SECRET,
                    {
                        expiresIn: config.JWT_EXPIRE_TIME,
                    }
                );
                user.token = token;

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);
