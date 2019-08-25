const express = require('express');
const router = express.Router();
const mongoose  = require('mongoose');

const Profile = require('../../models/Profile'); 
const auth = require('../../middleware/auth');
/**
 * @route   GET api/profile/me
 * @desc    Get current user profile
 * @access  Public
 */
router.get('/me',auth, 
 async (req, res) => {
   try {
      const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name','avatar']);
      if(!profile) {//profile doesnot exist
        res.status(400).json({msg: "Profile does not exist"});
      }
      res.status(200).json(profile);
   }catch(err){
     console.log(err);
     res.status(500).json({msg: "Server error"});
   }
});

module.exports = router;
