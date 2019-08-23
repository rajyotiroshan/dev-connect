const express = require('express');
const router =  express.Router();
const gravatar = require('gravatar');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');


/**
 * @route   POST api/users
 * @desc    Register route
 * @access  Public
 */
router.post('/',[
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please enter a password with 6 or more characters').isEmail(),
  check('password', 'Please enter a password with 6 or mre characters').isLength({min: 6})
], async (req,res)=>{
  //console.log(req.body);
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({error: errors.array()}); //errors formate {error: [{location, param , msg}]}
  }

  const {name, email, password} = req.body;
  

  try {
    //see if user exists
    let user = await User.findOne({email});
    if(user) {
      //bad req
      res.status(400).json({errors: [{msg: 'User already exists'}]});
    }
    //Get users gravatar
    const awatar = gravatar.url(email, {
      s: '200', //size
      r: 'pg', //rating
      d: 'mm' //..
    })

    user = new User({
      name,
      email,
      awatar,
      password
    });
    
    //Encrypt password
  }catch(err){
    console.log(err.message);
    res.status.send('Server error');
  }


  //Return
  res.send('User route')
})

module.exports = router;