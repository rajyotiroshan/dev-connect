const express = require('express');
const connectDB = require('./config/db');

const app = express();

//connect db.
connectDB();

const PORT = process.env.PORT||5000; //look for env var port on deploying

app.get('/',(req,res)=>{
  res.send("API running");
})

//Define routes
app.use('/api/users', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/post', require('./routes/api/post'));

app.listen(PORT, ()=>{
  console.log("Server started on port...", PORT);
})