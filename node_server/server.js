import express from 'express'

import { Server } from 'socket.io';
import { createServer } from 'http';
import { readEmails,addEmail,editEmail } from './readtxt.js';
const app = express();
const server=createServer(app)

const safepath='safemails.txt'
const blacklistpath='blacklisted.txt'
let safemails=await readEmails(safepath)
let blacklistmail=await readEmails(blacklistpath)
const io= new Server(server,{
  cors: {
    origin: "http://localhost:5173",  // allow your frontend
    methods: ["GET", "POST"]
  }
})
const PORT = 3000;  // Backend running on port 3000







io.on('connection',(socket)=>{
    console.log('user connected')
    socket.emit('blacklisted',blacklistmail)
    socket.emit('safemail',safemails)
    socket.on("py_to_js",(data)=>{
  socket.broadcast.emit("py_to_js",data)
})
socket.on("js_to_py",(data)=>{
  socket.broadcast.emit("js_to_py",data)
})
socket.on("addsafe",async (data)=>{
  console.log("yeet",data)
  await addEmail(data,safepath)
  safemails=await readEmails(safepath)
  socket.emit('safemail',safemails)
})
socket.on("editsafe",async(data)=>{
  
  await editEmail(data['old'],data['new'],safepath)
  safemails=await readEmails(safepath)
   socket.emit('safemail',safemails)
})

socket.on("addbl",async (data)=>{
  await addEmail(data,blacklistpath)
  safemails=await readEmails(blacklistpath)
  socket.emit('blacklisted',blacklistmail)
})
socket.on("editbl",async(data)=>{

  await editEmail(data['old'],data['new'],blacklistpath)
  safemails=await readEmails(blacklistpath)
   socket.emit('safemail',blacklistmail)
})
})



// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});