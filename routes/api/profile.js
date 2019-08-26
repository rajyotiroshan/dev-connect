const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const reqquest = require('request');
const config = require('config');

const Profile = require('../../models/Profile'); 
const User = require('../../models/User');
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

  /**
   * @route DELETE api/profile
   * @desc Delete profile, post and user account
   * @access Private
   */

   router.delete('/', auth, 
    async (req, res)=>{
      try {
        //@totdo - delte post

        //Remove profile
        await Profile.findOneAndRemove({user: req.user.id}) ;
        //Remove user
        await User.findOneAndRemove({_id: req.user.id});
        //response
        res.status(200).json({ msg: "User deleted" });
      } catch (error) {
        console.log(error.message)
        res.status(500).send('Server error');
      }
    }
   )
     /**
   * @route PUT api/profile/experience
   * @desc Add Profile expreience
   * @access Private
   */

   router.put(
     '/experience',
     [
       auth,
       [
         check('title', 'Title is required')
           .not()
           .isEmpty(),
         check('from', 'From data is required')
           .not()
           .isEmpty()
       ]
     ],
     async (req, res) => {
         const errors = validationResult(req);
         if(!errors.isEmpty()){
           return res.status(400).json({ erros: errors.array()});
         }
         const {
           title,
           company,
           location,
           from,
           to,
           current,
           description
         } = req.body;

         const newExp = {
           title,
           company,
           location,
           from,
           to,
           current,
           description
         } 
          try{
            let profile = await Profile.findOne({ user: req.user.id});
            //console.log(profile); working
            profile.experience.unshift(newExp);

            await profile.save();
            res.json(profile);
          }
         catch (error) {
         console.log(error.message);
         res.status(500).send('Server error');
       }
      });

/**
 * @route DELETE api/profile/experience/:exp_id
 * @desc Delete experience from profile
 * @access Private
 */


 router.delete('/experience/:exp_id', auth, async (req,res)=>{

  try {
    //get user prfoile 
    const profile = await Profile.findOne({ user: req.user.id });

    //get remove index
    const removeIndex = profile.experience.map(item=>item.id).indexOf(req.params.exp_id);
    //
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.status(200).json(profile);
  } catch (error) {
    console.log(error.message);
    res.send(500).send(' Server Error ');
  }
 })

 /**
  * @route PUT api/profile/education
  * @desc Update /create education
  * @access Private
  */

  router.put(
    '/education',
    [
      auth,
      [
        check('school', 'School field is required')
          .not()
          .isEmpty(),
        check('degree', 'degree field is required')
          .not()
          .isEmpty(),
        check('fieldofstudy', 'fieldofstudy field is required')
          .not()
          .isEmpty(),
        check('from', 'from field is required')
          .not()
          .isEmpty()
      ]
    ],
    async (req, res) => {
      //validate req
      const errors = validationResult(req);
      if(!errors.isEmpty()){
        console.log(errors.array());
        res.status(400).json({errors: errors.array()});
      }

      try {
        //access profile
        const profile = await Profile.findOne({ user: req.user.id});
        //extract send data from req
        let {
          school,
          degree,
          fieldofstudy,
          from,
          to,
          current,
          description
        } = req.body;

        //create new education row
        let newEdu = {
          school,
          degree,
          fieldofstudy,
          from,
          to,
          current,
          description
        };

        //push education at start
        profile.education.unshift(newEdu);
        //save education into the db
        await profile.save();
        //res
        res.status(200).json(profile);
      } catch (error) {
        console.log(error.message);
        return res.status(500).send('Server error');
      }
    }
  );

  /**
   * @route DELETE api/profile/education/:edu_id
   * @desc Delete an education fieled
   * @access Private
   */

   router.delete('/education/:edu_id',
    auth,
    async (req,res)=>{
      try {
        //access the profile
        let profile = await Profile.findOne({ user: req.user.id});
        let removeindex = profile.education.map(item=>item.id).indexOf(req.params.edu_id);
        profile.education.splice(removeindex, 1);
        await profile.save();
        res.status(200).json(profile);        
      } catch (error) {
        console.log(error.message);
        res.status(500).send(' Server error');
      }
    })

    /**
     * @route GET api/profile/github/:username
     * @desc Get user repos from github
     * @access Public
     */

     router.get('/github/:username', (req,res)=>{
       try {
         const option = {
           uri : `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
           method: 'GET',
           headers:{'user-agent': 'node.js'}
         };

         reqquest(option, (error, response, body) => {
           if(error) console.log(error);

           if(response.statusCode !== 200){
             res.status(404).json({msg: "No githun profile found"});
           }
           res.json(JSON.parse(body));
         })
       } catch (error) {
         console.log(error.message);
         res.status(500).send("Server error");
       }
     })


module.exports = router;
