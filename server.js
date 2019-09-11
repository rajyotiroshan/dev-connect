const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

//connect db.
connectDB();

const PORT = process.env.PORT||5000; //look for env var port on deploying

// Init middleware.
// every post data will be in json form.
// req.body <----- postData.
app.use(express.json({extended: false}));



//Define routes
app.use('/api/users', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/post'));

//Serve statis asset in production
if(process.env.NODE_ENV === 'production') {
  //Set static folder
  app.use(express.static('client/build'));

  app.get("*", (req, res)=>{
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}


app.listen(PORT, ()=>{
  console.log("Server started on port...", PORT);
})