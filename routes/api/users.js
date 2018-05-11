const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');
const imageOptions = require('../../config/appConfig').gravatarOptions;

const router = express.Router();

router.get('/test', (req, res) => res.json({message: "USERS WORKS"}) );

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
})

module.exports = router;