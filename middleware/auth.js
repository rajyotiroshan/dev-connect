const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  //Get token from header
  const token = req.header('x-auth-token');

  //check if not token 
  if(!token) {
    return res.status(401).json({msg: 'No token, authorization denied'});//unauthorized.
  }

  //Verify token

  try {
    //decode token
    const decoded = jwt.verify(token, config.get('jwtToken'));

    //creat a user field on req
    req.user = decoded.user;
    //call next functino in the stack for route.
    next();
  }catch(err){
    //error in verification.
    res.status(401).json({msg: ' token is not valid'})// unauthorized
  }
}