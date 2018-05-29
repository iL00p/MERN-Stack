const express = require('express');
const passport = require('passport');

const router = express.Router();
const postsController = require('./posts.controller');

router.get('/test', (req, res) => res.json({ message: 'POSTS WORKS' }));
// create post
router.post('/', passport.authenticate('jwt', { session: false }), postsController.createPost);
// get posts by Id
router.get('/:id', postsController.getPostById);
// get all posts
router.get('/', postsController.getAllPosts);
// like post
router.post('/like/:id', passport.authenticate('jwt', { session: false }), postsController.likePost);
// unlike post
router.delete('/like/:id', passport.authenticate('jwt', { session: false }), postsController.unlikePost);
// comment on post
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), postsController.commentPost);
// delete comment
router.delete('/:postId/comment/:commentId', passport.authenticate('jwt', { session: false }), postsController.deleteComment);
// delete post
router.delete('/:id', passport.authenticate('jwt', { session: false }), postsController.deletePost);

module.exports = router;
