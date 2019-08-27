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
 * @route   DELETE api/post/:id
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

 /**
  * @route POST api/post/like/:post_id
  * @descp give a like to a post
  * @access Private
  */

  router.post('/like/:post_id', auth, async (req, res)=>{
    try {

      //access the post
      const post = await Post.findById(req.params.post_id);
      
      //verify if user already liked
      if(post.likes.filter(like=>like.user.toString()===req.user.id).length >0){
        return res.status(400).json({ msg: " already liked. "})
      }

      //for new like
      post.likes.unshift({
        user: req.user.id
      });
      
      //save post
      await post.save();
      res.status(200).json(post);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: "Server error "});
    }
  });

   /**
  * @route POST api/post/unlike/:post_id
  * @descp give a like to a post
  * @access Private
  */

  router.put('/unlike/:post_id', auth, async (req, res)=>{
    try {

      //access the post
      const post = await Post.findById(req.params.post_id);
      
      //verify if user already liked
      if(post.likes.filter(like=>like.user.toString()===req.user.id).length < 1){
        return res.status(400).json({ msg: " not liked yet"})
      }
      //remove user from likes
      const removeUserIndex = post.likes.map(like=>like.user.toString()).indexOf(req.user.id);
      
      post.likes.splice(removeUserIndex, 1);
      //save post
      await post.save();
      res.status(200).json(post);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: "Server error "});
    }
  });

  /**
   * @route POST /comment/:post_id
   * @desc Post a comment on a post
   * @access Private
   */

   router.post('/comment/:post_id', [
     auth,
     [
       check('text', " Text is required ").not().isEmpty()
     ]
   ],
   async (req, res)=>{
      //check error
      const error = validationResult(req);
      if(!error.isEmpty()){
        return res.status(400).json({ error: error.array() });
      }
      try {
        //access user
        const user = await User.findById(req.user.id).select('-password');
        //access post
        const post = await Post.findById(req.params.post_id);
        //construct a comment
        let cmntData = {
          user: req.user.id,
          text: req.body.text,
          name: user.name,
          avatar: user.avatar
        };

        //add commnt to post.comments
        post.comments.unshift(cmntData);
        //ssave post
        await post.save();
        //response
        res.status(200).json(post);
      } catch (error) {
        console.log(error.message);
        res.send(500).send('Server error');
      }
   })

   /**
    * @route DELETE /:post_id/:cmnt_id
    * @desc Delete a comment from a post
    * @access Private
    */

    router.delete('/:post_id/:comnt_id', auth, async (req, res)=>{
      try {
        //access post
        const post = await Post.findById(req.params.post_id);
        console.log(post);
        if(!post){
          return res.status(404).json({ msg: "post does not exist" });
        }
        //access comment
        let comment = post.comments.find(comment=> comment.id.toString() === req.params.comnt_id);
        if(!comment) {
          return res.status(404).json({ msg: "comment does not exist" });
        }
        //right user
        if(req.user.id !== comment.user.toString()){
          return res.status.json({ msg: " user not authorized " });
        }
        //access comment index
        let comntIndex = post.comments.map(comnt=> comnt.id.toString()).indexOf(req.params.comnt_id);
        //remove comment
        post.comments.splice(comntIndex, 1);
        await post.save();
        res.status(200).json(post);
      } catch (error) {
        console.log(error.message);
        res.status(500).send(' Server Error');
      }
    })


module.exports = router;
