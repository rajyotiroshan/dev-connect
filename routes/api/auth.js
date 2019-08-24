const express = require('express');
const router =  express.Router();

const auth = require('../../middleware/auth');
const User = require('../../models/User');
/**
 * @route   GET api/auth
 * @desc    Test route
 * @access  Public
 */
router.get('/',auth, async (req, res) => {
  try {
    //access the user 
    const user = await User.findById(req.user.id).select('-password');//do not select the password.
    res.status(200).json(user);
  }catch(err) {
    res.status(500).send({error: 'bad request'});//server error
  }
});

module.exports = router;
