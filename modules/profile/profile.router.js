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
// get profile by handle
router.get('/handle/:handle', profileController.getByHandle );
// get all profiles
router.get('/all', profileController.getAllProfiles );
// add experience
router.post('/experience', passport.authenticate( 'jwt', { session : false } ), profileController.addExperience )
// delete experience
router.delete('/experience/:expId', passport.authenticate( 'jwt', { session : false } ), profileController.deleteExperience )
// add education
router.post('/education', passport.authenticate( 'jwt', { session : false } ), profileController.addEducation )
// delete education
router.delete('/education/:eduId', passport.authenticate( 'jwt', { session : false } ), profileController.deleteEducation )
// get by id
router.get('/:id', profileController.getById );
// delete user & profile
router.delete('/', passport.authenticate( 'jwt', { session : false } ), profileController.deleteProfile );




module.exports = router;