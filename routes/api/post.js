const express = require('express');
const router =  express.Router();

const {check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

/**
 * @route   POST api/posts
 * @desc    Create a Post
 * @access  Private
 */
router.post('/',[
  auth,
  [
    check('text', ' Text is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array()});
  }

  try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      }); 
      const post  = await newPost.save();

      res.status(200).json(post);

  } catch (error) {
      console.log(error.message);
      res.status(500).send(' Server error ');
  }

});

/**
 * @route   GET api/posts
 * @desc    Get all posts
 * @access  Private
 */

 router.get('/', auth, async (req,res)=>{
   try {
     
    const posts = await Post.find().sort( { date: 1} );
    res.status(200).json(posts);

   } catch (error) {
     console.log(error.message);
     res.status(500).send('Server error');
   }
 })

 /**
 * @route   GET api/posts/:id
 * @desc    Get a post by id
 * @access  Private
 */

 router.get('/:id', auth, async (req,res)=>{

   try {
    const post = await Post.findById(req.params.id);

    if(!post){
      return res.status(404).json({ msg: "Post not found"});
    }

    res.status(200).json(post);

   } catch (error) {
     console.log(error.message);
     
    if (!error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
     res.status(500).send('Server error');
   }
 })

  /**
 * @route   DELETE api/posts/:id
 * @desc    Delete a post by id
 * @access  Private
 */

 router.delete('/:post_id', auth, async (req,res)=>{

   try {
    //
    const post = await Post.findById(req.params.post_id);

    console.log(post);
    if(!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    //make sure user owned the post
    if(post.user.toString() !== req.user.id){
      return res.status(401).json({ msg:'USer not authorised' })
    }

    await post.remove();
    res.status(200).json({ msg: 'Post removed'});

   } catch (error) {
     console.log(error.message);
     
    if (!error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
     res.status(500).send('Server error');
   }
 })

module.exports = router;
