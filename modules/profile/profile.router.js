const express = require('express');
const passport = require('passport');
const profileController = require('./profile.controller');

const router = express.Router();

router.get('/test',  (req,res) => res.json( { message : "PROFILE WORKS" } ) );

// get profile details
router.get('/', passport.authenticate( 'jwt', { session : false } ), profileController.getProfileDetails );

// set profile details
router.post('/', passport.authenticate( 'jwt', { session : false } ), profileController.setProfileDetails );
// update profile details
router.put('/', passport.authenticate( 'jwt', { session : false } ), profileController.updateProfileDetails );

module.exports = router;