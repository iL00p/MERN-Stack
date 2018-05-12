const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');
const imageOptions = require('../../config/appConfig').gravatarOptions;
const secret = require('../../config/keys').secret;

const router = express.Router();

router.get('/test', (req, res) => res.json({message: "USERS WORKS"}));

router.post('/', (req, res) => {
  const {body} = req;

  User.findOne({email: body.email}).then(user => {

    if (user) 
      return res.status(400).json({message: "Email already exists"});
    
    const avatar = gravatar.url(body.email, imageOptions);

    const newUser = new User({name: body.name, email: body.email, password: body.password, avatar});

    bcrypt.genSalt(10, (err, salt) => {
      if (err) 
        throw err;
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) 
          throw err;
        
        newUser.password = hash;
        newUser.save().then(user => res.json(user)).catch(err => console.log("ERR::", err));
      })
    })

  })
});

router.post('/login', (req, res) => {
  const {
    body: {
      email,
      password
    }
  } = req;

  User.findOne({email}).then(user => {
    if (!user) 
      return res.status(404).json({message: "User not found"});
    
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          _id: user._id,
          user: user.name,
          email: user.email
        }

        jwt.sign(payload, secret, {
          expiresIn: 3600
        }, (err, token) => {
          if (err) 
            throw err;
          
          const data = {
            _id: user._id,
            email: user.email,
            avatar: user.avatar,
            name: user.name,
            token: `Bearer ${token}`
          };

          return res.json({success: true, data, message: "Login Successfull"});

        })
      } else 
        return res.status(400).json({message: "Password mismatch"});

      }
    ).catch(err => {
      console.log("ERR::", err);
      res.status(500).json({message: "Oops... Something went wrong"});
    })
  })

});

module.exports = router;