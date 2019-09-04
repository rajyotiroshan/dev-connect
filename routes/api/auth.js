const express = require('express');
const router =  express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');

const auth = require('../../middleware/auth');
const User = require('../../models/User');
/**
 * @route   GET api/auth
 * @desc    Test route
 * @access  Public
 */
router.get('/',
auth, 
async (req, res) => {
  try {
    //access the user 
    const user = await User.findById(req.user.id).select('-password');//do not select the password.
    res.status(200).json(user);
  }catch(err) {
    res.status(500).send({error: 'bad request'});//server error
  }
});

/**
 * @route POST api/auth
 * @desc Login route, Authenticate uer and get token.
 * @access Public
 */

 router.post('/',
  [
    check('email','please include a valid email').isEmail(),
    check('password', 'password is required').exists()
  ] 
 ,async(req, res)=> {

  //validate erros
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  const {email, password} = req.body;

  try {
    //access user with email
    const user = await User.findOne({email});
    //check if user exist
    if(!user) {
      return res.status(400).json({msg: 'user does not exist'});
    }
    //user exist.
    //check if password matches.
    const isMatched = await bcrypt.compare(password, user.password);
    if(!isMatched) {//password did not match
      return  res.status(400).json({msg: 'password did not match.'})
    }

    /*user exist with valid email and password.*/
    //Generate jwt token
    //create payload

    const payload = {
      user: {
        id: user.id
      }
    };
    //sign a token and send it back to the client/user.
    jwt.sign(
      payload,
      config.get('jwtToken'),
      {expiresIn: 360000},
      (err, token)=>{
        if(err) throw err;
        res.status(200).json({ token });
      }
    );
  }catch(err){
    console.log(err.message);
    res.status(500).json({error:' Server error'});
  }
 })

module.exports = router;
