const express = require('express');
const router = express.Router();
const {UserController} = require('./controller');

router.post('/api/login', UserController.authenticateUser);
router.put('/api/add-user', UserController.createUser);
router.get('/api/users', UserController.getAllUsers);
router.get('/api/users/:username', UserController.getUser); // TODO: change route to modify user detail
router.get('/api/profile', UserController.getProfile);
router.post('/api/profile/edit', UserController.updateUser);
router.get('/auth/verify-session', UserController.verifySession);
router.post('/api/logout', UserController.logoutUser);

module.exports = router;