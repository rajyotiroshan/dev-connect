const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');

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

/**
 * @route POST api/profile/me
 * @desc Create user profile or update
 * @access Private
 */

 router.post(
   '/', 
   [
     auth,
     [
       check('status', 'Status is required')
        .not()
        .isEmpty(),
       check('skills', ' Skills is required ')
        .not()
        .isEmpty()
     ]
   ], 
 async (req, res)=>{
    //validate
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
    }
    
      /**
      * required fields are passed
      */
      //access the field
      const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
      } = req.body;

      //build profile object
      let profileFields = {};
      profileFields.user = req.user.id;
      if(company) profileFields.company = company;
      if (bio) profileFields.bio = bio;
      if (website) profileFields.website = website;
      if (location) profileFields.location = location;
      if (status) profileFields.status = status;
      if (githubusername) profileFields.githubusername = githubusername;
      if (skills) {
        profileFields.skills = skills.split(',').map(skill=>skill.trim());
      }

      //build social object
      profileFields.social = {}
      if (youtube) profileFields.social.youtube = youtube;
      if (twitter) profileFields.social.twitter = twitter;
      if (facebook) profileFields.social.facebook = facebook;
      if (linkedin) profileFields.social.linkedin = linkedin;
      if (instagram) profileFields.social.instagram = instagram;

      try {
        let profile = await Profile.findOne({user: req.user.id});

        if(profile) {
          //Update
          profile = await Profile.findOneAndUpdate(
            {user: req.user.id},
            {$set: profileFields},
            {new: true});

            return res.json(profile);
        }

        //Create
        profile = new Profile(profileFields);

        await profile.save();

        res.json(profile);
      }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
      }
 })

 /**
  * @route GET api/profile
  * @desc Get all profiles
  * @access Public
  */

  router.get('/', 
    async (req, res)=>{
      try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.status(200).json(profiles);
      } catch (error) {
        console.log(error.message);
        res.status(500).send('Server error');
      }
    })

/**
  * @route GET api/profile/:user_id
  * @desc Get a user profile
  * @access Public
  */

  router.get('/user/:user_id', 
    async (req, res)=>{
      try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar']);
        if(!profile) return res.status(400).json({ msg: 'There is no profile for this user. '})
        res.status(200).json(profile);
      } catch (error) {
        console.log(error.message);
        res.status(500).send('Server error');
      }
    })

module.exports = router;
