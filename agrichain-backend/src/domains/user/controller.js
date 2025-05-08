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
                // console.log('Fetching all user with username: ', req.params.username); // Debug log
                user = await UserModel.findByUsername(req.params.username);

                // console.log('1 user (rows)', user.rows); // Debug log
                console.log('user: ', user);
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
            console.log('Data received, ', req.body);

            if (!req.body.name || !req.body.username || !req.body.email || !req.body.phone || !req.body.address || !req.body.organization || !req.body.role || !req.body.password) {
                console.log('Empty field(s)'); // Debug log
                return res.status(401).json({ success: false, message: 'Please enter all fields.' });
            }

            if (req.body.password !== req.body.confirmPassword) {
                console.log('Passwords do not match.'); // Debug log
                return res.status(401).json({ success: false, message: 'Not matching.' });
            }

            if (req.body.password.length < 6) {
                console.log('Password is too short.'); // Debug log
                return res.status(401).json({ success: false, message: 'Short password.' });
            }

            const isNotUnique = await UserModel.existByUsername(req.body.username);
            if (isNotUnique) {
                console.log('Not a unique username.'); // Debug log
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
                console.log('Empty field(s)'); // Debug log
                return res.status(401).json({ success: false, message: 'Please enter all fields.' });
            }

            const isUnique = await UserModel.existByUsername(username);

            if (!isUnique && username !== oldUsername) {
                console.log('Not a unique username.'); // Debug log
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
                console.log('Fetching all users...'); // Debug log
                allUsers = await UserModel.getAllUsers();

                console.log('All users (rows)', allUsers.rows); // Debug log
                console.log('All users', allUsers);
            } else {
                return res.status(401).json({error: 'Unauthorized'});
            }

            res.status(200).json(allUsers);
        } catch(err) {
            res.status(500).json({ error: err.message });
        }
    },

    async authenticateUser(req, res) {
        console.log('Auth request received:', req.body);

        const { username, password } = req.body;
        try {
            console.log('Username: ', username);
            console.log('Password: ', password);

            console.log('Checking user existence:', username);
            const exist = await UserModel.existByUsername(username);

            if (!exist) {
                console.log('Exist boolean: ', exist);
                console.log('Username does not exist.'); // Debug log
                return res.status(401).json({ success: false, message: 'Wrong username.' });
            }

            console.log('Fetching user details');
            const user = await UserModel.findByUsername(username);

            console.log('Comparing passwords');
            const match = await bcrypt.compare(password, user.password);

            console.log('Password match:', match); // Debug

            if (!match) {
                console.log('Password mismatch');
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            console.log('Creating session for user:', user.username);
            req.session.user = {
                username: user.username,
                user: user.name,
                organization: user.organization,
                email: user.email,
                phone: user.phone,
                role: user.role
            };

            console.log('Session created:', req.session.user); // Debug log
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
                    console.error('Session destruction error:', err);
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

                console.log('User logged out successfully');
                res.json({
                    success: true,
                    message: 'Logged out successfully'
                });
            });
        } catch (err) {
            console.error('Logout error:', err);
            res.status(500).json({
                success: false,
                message: 'Server error during logout'
            });
        }
    },

    async verifySession(req, res) {
        console.log('Session verification request received'); // Debug log
        if (!req.session.user) {
            console.log('No session user found'); // Debug log
            return res.status(401).json({ success: false, message: 'No active session'});
        }

        try {
            const user = await UserModel.findByUsername(req.session.user.username);

            if (!user) {
                console.log('User not found in database'); // Debug log
                return res.status(401).json({ success: false, message: 'User not found' });
            }

            console.log('Session verified successfully'); // Debug log
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
            console.error('Session verification error:', err);
            res.status(500).json({ success: false, message: 'Server error'});
        }
    }
}

module.exports = { UserController };