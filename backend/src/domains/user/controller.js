require('dotenv').config();
const UserModel = require('./model');
const {matchedData} = require("express-validator");
const bcrypt = require("bcrypt");

const UserController = {

    // For administrator, get user in params => /users/:username && /api/users/:username
    async getUser(req, res) {
        if (!req.session.user) {
            res.status(401).json({ error: 'Unauthorized' });
        }
        try {
            let user;

            if (req.session.user.role === 'admin') {
                user = await UserModel.findByUsername(req.params.username);
            } else {
                return res.status(401).json({error: 'Unauthorized'});
            }

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'No user found.'
                });
            }
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // For personal use, get profile data => /profile && /api/profile
    async getProfile(req, res) {
        if (!req.session.user) {
            res.status(401).json({ error: 'Not authenticated' });
        }
        try {
            const username = req.session.user.username;

            const user = await UserModel.findByUsername(username);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Profile not found.'
                })
            }

            res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }

    },

    async createUser(req, res) {
        if (!req.session.user || req.session.user.role !== 'admin') {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        try {
            if (!req.body.name || !req.body.username || !req.body.email || !req.body.phone || !req.body.address || !req.body.organization || !req.body.role || !req.body.password) {
                return res.status(401).json({ success: false, message: 'Please enter all fields.' });
            }

            if (req.body.password !== req.body.confirmPassword) {
                return res.status(401).json({ success: false, message: 'Not matching.' });
            }

            if (req.body.password.length < 6) {
                return res.status(401).json({ success: false, message: 'Short password.' });
            }

            const isNotUnique = await UserModel.existByUsername(req.body.username);
            if (isNotUnique) {
                return res.status(401).json({ success: false, message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const newUser = await UserModel.createUser(req.body.username, req.body.name, hashedPassword, req.body.role, req.body.organization, req.body.email, req.body.phone, req.body.address);

            res.status(201).json(newUser);
        } catch(err) {
            res.status(500).json({ error: err.message });
        }
    },

    async updateUser(req, res) {
        if (!req.session.user) {
            res.status(401).json({ error: 'Unauthorized' });
        }
        try {

            const { username, name, role, organization, email, phone, address } = req.body;

            const oldUsername = req.session.user.username;

            if (!name || !username || !email || !phone || !address || !organization || !role) {
                return res.status(401).json({ success: false, message: 'Please enter all fields.' });
            }

            const isUnique = await UserModel.existByUsername(username);

            if (!isUnique && username !== oldUsername) {
                return res.status(401).json({ success: false, message: 'User already exists' });
            }

            const updatedUser = await UserModel.updateUser(username, name, role, organization, email, phone, address);

            res.status(201).json(updatedUser);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getAllUsers(req, res) {
        if (!req.session.user && req.session.user.role !== 'admin') {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        try {
            const user = req.session.user;

            let allUsers;

            if (user.role === 'admin') {
                allUsers = await UserModel.getAllUsers();
            } else {
                return res.status(401).json({error: 'Unauthorized'});
            }

            res.status(200).json(allUsers);
        } catch(err) {
            res.status(500).json({ error: err.message });
        }
    },

    async authenticateUser(req, res) {

        const { username, password } = req.body;
        try {
            const exist = await UserModel.existByUsername(username);

            if (!exist) {
                return res.status(401).json({ success: false, message: 'Wrong username.' });
            }

            const user = await UserModel.findByUsername(username);
            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }
            req.session.user = {
                username: user.username,
                user: user.name,
                organization: user.organization,
                email: user.email,
                phone: user.phone,
                role: user.role
            };
            res.status(200).json({
                success: true,
                role: user.role,
                user: {
                    username: user.username,
                    user: user.name,
                    organization: user.organization,
                    email: user.email,
                    phone: user.phone,
                    role: user.role
                },
                redirect: '/dashboard'
            });
        } catch(err) {
            res.status(500).json({ error: err.message });
        }
    },

    async logoutUser(req, res) {
        try {
            req.session.destroy((err) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Logout failed'
                    });
                }

                res.clearCookie('connect.sid', {
                    path: '/',
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict'
                });
                res.json({
                    success: true,
                    message: 'Logged out successfully'
                });
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Server error during logout'
            });
        }
    },

    async verifySession(req, res) {
        if (!req.session.user) {
            return res.status(401).json({ success: false, message: 'No active session'});
        }

        try {
            const user = await UserModel.findByUsername(req.session.user.username);

            if (!user) {
                return res.status(401).json({ success: false, message: 'User not found' });
            }

            res.json({
                success: true,
                user: {
                    username: user.username,
                    user: user.name,
                    organization: user.organization,
                    email: user.email,
                    phone: user.phone,
                    role: user.role
                }
            });
        } catch(err) {
            res.status(500).json({ success: false, message: 'Server error'});
        }
    }
}

module.exports = { UserController };