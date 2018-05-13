const _ = require('lodash');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const PROFILE_FIELDS = require('../../config/appConfig').profileFields;
const Validations = require('./profile.validation');

setProfileFields = ( body ) => {
  const profileData = {};
  PROFILE_FIELDS.map( fieldName => {
    if( fieldName === 'skills' && !_.isEmpty( body.skills ) )
      profileData.skills = body.skills.split(',');
    else if ( !_.isEmpty( body[ fieldName ] ) ) 
      profileData[ fieldName] = body[ fieldName ];
  } );
  
  profileData.social = {};
  if ( !_.isEmpty( body.twitter ) ) profileData.social.twitter = body.twitter; 
  if ( !_.isEmpty( body.facebook ) ) profileData.social.facebook = body.facebook; 
  if ( !_.isEmpty( body.linkedin ) ) profileData.social.linkedin = body.linkedin; 
  if ( !_.isEmpty( body.youtube ) ) profileData.social.youtube = body.youtube; 
  if ( !_.isEmpty( body.instagram ) ) profileData.social.instagram = body.instagram; 

  return profileData;
}

getProfileDetails = ( req, res ) => {
  const { user } = req;
  
  Profile.findOne( { user : user._id } )
  .populate('user', ['name','email','avatar'])
  .then( profile => {
    if( !profile )
      return res.status(404).json( { message : 'User not found'} );
      
    return res.json( { sucess : true, data : profile } );
  }).catch( err => res.status(404).json(err) ); 
};

setProfileDetails = (req,res) => {
  const { user, body } = req;
  const { errors, isValid } = Validations.validateProfileFields( body );
  
  if( !isValid )
    return res.status(400).json(errors);
  
  const profileFields = setProfileFields( body );
  profileFields.user = user._id;

  Profile.findOne( { user : user._id } ).then( profileData => {
    if ( profileData ) return res.status(400).json({ message : 'Profile already exists' } );
    
    Profile.findOne({ handle : profileFields.handle }).then( profile => {
      if( profile ){
        errors.handle = 'Handle already exists';
        return res.status(400).json(errors);
      }

    new Profile(profileFields).save().then( data => res.json({ success: true, data }))
      .catch(err => res.status(400).json( {err , message: 'Error creating profile' }));
    })
  })
}

updateProfileDetails = (req,res) => {
  const { user, body } = req;
  const { errors, isValid } = Validations.validateProfileFields( body );
  
  if( !isValid )
      return res.status(400).json(errors);
  
  const profileFields = setProfileFields( body );
  profileFields.user = user._id;

  Profile.findOne( { user : user._id } ).then( profileData => {
    if ( _.isEmpty( profileData ) ) return res.status(400).json({ message : 'Profile does not exist' } );

    if ( profileData.handle === profileFields.handle )
      updateProfileCallToDb( profileFields, res );
    else{
      Profile.findOne({ handle : profileFields.handle }).then( profile => {
        if( profile.user !== profileFields.user ){
          errors.handle = 'Handle already exists';
          return res.status(400).json(errors);
        }
        
        updateProfileCallToDb( profileFields, res );
      });
    }
  });
}

updateProfileCallToDb = ( profileFields, res ) => {
  Profile.findOneAndUpdate( { user : profileFields.user }, { $set : profileFields }, { new : true } )
    .then( profile => res.json({ sucess: true, data : profile } ))
    .catch( err => res.status(400).json({ err, message: 'Cannot edit profile'} ) );
}

module.exports = {
  getProfileDetails,
  setProfileDetails,
  updateProfileDetails
};