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

getByHandle = (req,res) => {
  const { params : { handle } } = req;
  if ( _.isEmpty( handle ) )
    return res.status( 400 ).json( { message : 'Missing handle' } );
  
  Profile.findOne( { handle } ).populate( 'user', [ 'name', 'avatar' ])
    .then( profile => {
      if( _.isEmpty( profile ) )
        return res.status( 404 ).json( { message : 'Profile not found' } );
        
      return res.json( { data : profile } );
    }).catch( err => res.status(400).json({ err, message: 'Error loading profile'} ) );
}

getById = (req,res) => {
  const { params : { id } } = req;
  if ( _.isEmpty( id ) )
    return res.status( 400 ).json( { message : 'Missing handle' } );
  
  Profile.findOne( { user : id } ).populate( 'user', [ 'name', 'avatar' ])
    .then( profile => {
      if( _.isEmpty( profile ) )
        return res.status( 404 ).json( { message : 'Profile not found' } );
        
      return res.json( { data : profile } );
    }).catch( err => res.status( 404 ).json({ err, message: 'Error loading profile'} ) );
}

getAllProfiles = (req,res) => {
  Profile.find().populate( 'user', [ 'name', 'avatar', 'email' ]).then( results => {
    if ( !results )
      return res.status( 404 ).json( { message : 'No profiles found' } )
      
    return res.json( { data : results } );
  }).catch( err => res.status( 404 ).json( { err ,message : 'No profiles found' } ) );
}

addExperience = ( req,res ) => {
  const { user, body } = req;
  
  const { errors,isValid } = validateExperience( body );
  
  if( !isValid )
    return res.status( 400 ).json( errors );
  
  Profile.findOne( { user : user._id } )
    .then( profile => {
      const newExp = {
        title : body.title,
        company : body.company,
        location : body.location,
        from : body.from,
        to : body.to,
        current : body.current,
        description : body.description
      };
      
      profile.experience.unshift( newExp );
      
      profile.save().then( newProfile => res.json( { data : newProfile } ) );
    }).catch( err => res.status( 400 ).json( { err, message : 'Error adding experience' } ) );
}

deleteExperience = ( req,res ) => {
  const { user, params : { expId } } = req;
    
  if( !expId )
    return res.status( 400 ).json( { message : 'Id is required' } );
    
  Profile.findOne( { user : user._id } )
    .then( profile => {
      
      const expIndex = profile.experience.findIndex( exp => exp._id == expId );

      if ( expIndex  === -1 )
        return res.status( 404 ).json( { message : 'Experience not found' } );
        
      profile.experience.splice( expIndex, 1);
      
      profile.save().then( newProfile => res.json( { data : newProfile } ) );
    }).catch( err => res.status( 400 ).json( { err, message : 'Error deleting experience' } ) );
}

addEducation = ( req,res ) => {
  const { user, body } = req;
  
  const { errors,isValid } = validateEducation( body );
  
  if( !isValid )
    return res.status( 400 ).json( errors );
  
  Profile.findOne( { user : user._id } )
    .then( profile => {
      const newEdu = {
        school : body.school,
        degree : body.degree,
        fieldofstudy : body.fieldofstudy,
        from : body.from,
        to : body.to,
        current : body.current,
        description : body.description
      };
      
      profile.education.unshift( newEdu );
      
      profile.save().then( newProfile => res.json( { data : newProfile } ) );
    }).catch( err => res.status( 400 ).json( { err, message : 'Error adding education' } ) );
}

deleteEducation = ( req,res ) => {
  const { user, params : { eduId } } = req;
    
  if( !eduId )
    return res.status( 400 ).json( { message : 'Id is required' } );
    
  Profile.findOne( { user : user._id } )
    .then( profile => {
      
      const eduIndex = profile.education.findIndex( edu => edu._id == eduId );

      if ( eduIndex  === -1 )
        return res.status( 404 ).json( { message : 'Education not found' } );
        
      profile.education.splice( eduIndex, 1);
      
      profile.save().then( newProfile => res.json( { data : newProfile } ) );
    }).catch( err => res.status( 400 ).json( { err, message : 'Error deleting education' } ) );
}

deleteProfile = ( req,res ) => {
  const { user } = req;
  
  Profile.findOneAndRemove( { user : user._id } ).then( () => {
    User.findOneAndRemove( { _id : user._id } ).then( () => {
      return res.json( { success : 1, message : 'Profile successfully deleted' } )
    })
  }).catch( err => res.status( 400 ).json( { err, message : 'Error deleting profile' } ) )
}

module.exports = {
  getProfileDetails,
  setProfileDetails,
  updateProfileDetails,
  getByHandle,
  getById,
  getAllProfiles,
  addExperience,
  addEducation,
  deleteExperience,
  deleteEducation,
  deleteProfile
};