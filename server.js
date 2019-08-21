const express = require('express');
const app = express();
const PORT = process.env.PORT||5000; //look for env var port on deploying

app.get('/',(req,res)=>{
  res.send("APO running");
})
app.listen(PORT, ()=>{
  console.log("Server started on port...", PORT);
})