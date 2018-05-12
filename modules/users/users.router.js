const express = require('express');
const userController = require('./users.controller');

const router = express.Router();

router.get('/test', (req, res) => res.json({message: "USERS WORKS"}));

// register user
router.post('/', userController.register );

// login user
router.post('/login', userController.loginUser );

module.exports = router;