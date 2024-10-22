import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { UserModel } from '../models/userModel.js';
import { TokenModel } from '../models/tokenModel.js';

export const AuthController = {
    register: async (req, res) => {
        const { name, email, password, role, userName } = req.body;
        if (!name || !email || !password) {
            return res.status(422).json({ message: 'Please fill in all fields (name , email, password)' });
        }
        if (await UserModel.findByEmail(email)) {
            return res.status(409).json({ message: 'Email already exists' });
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        const newUser = await UserModel.create({
            name, email, password: hashedPassword, role: role ?? 'member', userName,
        });
        return res.status(201).json({ message: 'User Registered Successfully', id: newUser._id });
    },

    login: async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(422).json({ message: 'Please fill in all fields (email and password)' });
        }
        const user = await UserModel.findByEmail(email);
        if (!user || !(await bcryptjs.compare(password, user.password))) {
            return res.status(401).json({ message: 'Email or password is invalid' });
        }
        const accessToken = jwt.sign({ userId: user._id }, config.accessTokenSecret, { subject: 'accessApi', expiresIn: config.accessTokenExpiresIn });
        const refreshToken = jwt.sign({ userId: user._id }, config.refreshTokenSecret, { subject: 'refreshToken', expiresIn: config.refreshTokenExpiresIn });
        await TokenModel.insertRefreshToken({ refreshToken, userId: user._id });
        return res.status(200).json({ id: user._id, name: user.name, email: user.email, accessToken, refreshToken });
    },

    refreshToken: async (req, res) => {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh Token Not Found' });
        }
        try {
            const decodedToken = jwt.verify(refreshToken, config.refreshTokenSecret);
            const validToken = await TokenModel.findRefreshToken({ refreshToken, userId: decodedToken.userId });
            if (!validToken) {
                return res.status(401).json({ message: 'Invalid or expired refresh token' });
            }
            await TokenModel.deleteRefreshToken(validToken._id);
            await TokenModel.compactRefreshTokens();
            const newAccessToken = jwt.sign({ userId: decodedToken.userId }, config.accessTokenSecret, { subject: 'accessApi', expiresIn: config.accessTokenExpiresIn });
            const newRefreshToken = jwt.sign({ userId: decodedToken.userId }, config.refreshTokenSecret, { subject: 'refreshToken', expiresIn: config.refreshTokenExpiresIn });
            await TokenModel.insertRefreshToken({ refreshToken: newRefreshToken, userId: decodedToken.userId });
            return res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
        } catch (error) {
            return res.status(500).json({ message: 'Refresh token invalid or expired' });
        }
    },

    logout: async (req, res) => {
        try {
            await TokenModel.deleteRefreshToken({ userId: req.user.id });
            await TokenModel.compactRefreshTokens();
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
};
