const express = require('express');
const { check, validationResult } = require('express-validator');

const router =  express.Router();

/**
 * @route   POST api/users
 * @desc    Register route
 * @access  Public
 */
router.post('/',[
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please enter a password with 6 or more characters').isEmail(),
  check('password', 'Please enter a password with 6 or mre characters').isLength({min: 6})
], (req,res)=>{
  //console.log(req.body);
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({error: errors.array()}); //errors formate {error: [{location, param , msg}]}
  }
  res.send('User route')
})

module.exports = router;