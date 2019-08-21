const express = require('express');
const connectDB = require('./config/db');

const app = express();

//connect db.
connectDB();

const PORT = process.env.PORT||5000; //look for env var port on deploying

app.get('/',(req,res)=>{
  res.send("APO running");
})
app.listen(PORT, ()=>{
  console.log("Server started on port...", PORT);
})