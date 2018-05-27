const Posts = require('../../models/Posts');
const Validations = require('./posts.validation');

const createPost = ( req, res ) => {
  const { user,body } = req;
  
  const { errors, isValid } = Validations.validatePost( body );
  
  if ( !isValid )
    return res.status( 400 ).json( errors );
  
  const newPost = new Post({
    text : body.text,
    name : body.name,
    avatar : body.avatar,
    user : user._id
  });
  
  newPost.save().then( post => res.json( post ) ).catch( err => res.status( 404 ).json( { err, message : 'Error creating post' } ))
}

const getPostById = ( req, res ) => {
  const { params : { id } } = req;
  
  if ( !id )
    return res.status( 400 ).json( { message : 'Id is required' } );
  
  Posts.findById( id ).then( post => res.json( post ) ).catch( err => res.status(400).json( { err, message : 'No Post found'} ) );
} 

const getAllPosts = ( req, res ) => {
  Posts.find().sort( { date : -1 } ).then( posts => res.json( posts ) ).catch(err => res.status(400).json({ err, message : 'Error fetching posts'}));
}

const deletePost = ( req, res ) => {
  const { user,params : { id } } = req;
  Posts.findById( id )
    .then( post => {
      if ( post.user.toString() !== user._id.toString() )
          return res.status( 401 ).json( { message : 'Not Authorized to delete this post'} );
      else {
        post.remove().then( () => res.json( { message : 'Post deleted successfully' } ) )
          .catch( err => res.status(400).json( { err, message : 'Error deleting post'} ))
      }
    } )
    .catch( err => res.status(400).json( { err, message : 'No Post found'} ) );
}

const likePost = ( req, res ) => {
  const { user,params : { id } } = req;
  Posts.findById( id )
    .then( post => {
      if ( post.likes.filter( like => like.user.toString() === user._id.toString() ).length > 0 )
        return res.status( 400 ).json( { message : 'You have already liked this post' } );
        
      post.likes.unshift( { user : user._id } );
      
      post.save().then( post => res.json( { data : post } ) );
    } )
    .catch( err => res.status(400).json( { err, message : 'No Post found'} ) );
}

const unlikePost = ( req, res ) => {
  const { user,params : { id } } = req;
  Posts.findById( id )
    .then( post => {
      if ( post.likes.filter( like => like.user.toString() === user._id.toString() ).length === 0 )
        return res.status( 400 ).json( { message : 'You have not yet liked this post' } );
        
      const postIndex = post.likes.findIndex( like => like.user.toString() === user._id.toString() );  
      post.likes.splice( postIndex, 1 );
      
      post.save().then( post => res.json( { data : post } ) );
    } )
    .catch( err => res.status(400).json( { err, message : 'No Post found'} ) );
}

const commentPost = ( req,res ) => {
  const { 
    user,
    params : { id }, 
    body
  } = req;
  
  const { errors , isValid } = Validations.validateComment( body );
  
  if( !isValid )
    return res.status( 400 ).json( errors );
  
  Posts.findById( id )
    .then( post => {
      const newComment = {
        text : body.text,
        name : body.name,
        avatar : body.avatar,
        user : user._id
      }
      
      post.comments.unshift( newComment );
      post.save().then( data => res.json( { data } ) ).catch( err => res.status(400).json( { err, message : 'Something went wrong'} ));
    } )
    .catch( err => res.status(400).json( { err, message : 'No Post found'} ) );
}

const deleteComment = ( req, res ) => {
  const { user, params: { postId, commentId } } = req;
  
  Posts.findById( postId ).then( post => {
    const removeIndex = post.comments.findIndex( comment => comment._id.toString() === commentId );

    if ( removeIndex === -1 )
      return res.status( 404 ).json( { message : 'Comment not found' } );
      
    post.comments.splice( removeIndex, 1 );
    
    post.save().then( data => res.json( { data } ) );
      
  }).catch( err => res.status(400).json( { err, message : 'No Post found'} ) );

}

module.exports = {
  createPost,
  getPostById,
  getAllPosts,
  deletePost,
  likePost,
  unlikePost,
  commentPost,
  deleteComment
}