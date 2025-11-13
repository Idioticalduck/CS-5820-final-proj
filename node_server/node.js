import express from 'express'

import { Server } from 'socket.io';
import { createServer } from 'http';
const app = express();
const server=createServer(app)
const io= new Server(server)
const PORT = 3000;  // Backend running on port 3000



app.use(express.json())


savedemail={}
saveddetails={}
// Sample data/accounts under /api route
app.get('/api/data/email',async (req, res) => {
  try{
    res.json(savedemail);
  }catch(err){
    console.error('womp womp',err)
  }
});
app.post('/api/data/email',async (req,res)=>{
  try{
  const email=req.body
  savedemail=email
  io.emit('Email has been uploaded',email)
  res.json(savedemail)
  }catch(err){
    console.log('womp womp',err)
  }
})
app.post('/api/data/details',async (req,res)=>{
    const detail=req.body
    saveddetails=detail
    io.emit("details posted",detail)
  res.json(saveddetails)
})
app.get('/api/data/details',async(req,res)=>{
  try {
   
    res.json(saveddetails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }

})

io.on('connection',(socket)=>{
    console.log('user connected')
})



// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});