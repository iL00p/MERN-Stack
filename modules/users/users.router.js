const express = require('express');
const passport = require('passport');
const userController = require('./users.controller');

const router = express.Router();

router.get('/test', (req, res) => res.json({message: "USERS WORKS"}));

// register user
router.post('/', userController.register );

// login user
router.post('/login', userController.loginUser );

// current user
router.get('/me', passport.authenticate( 'jwt', { session : false } ), userController.currentUser );

module.exports = router;