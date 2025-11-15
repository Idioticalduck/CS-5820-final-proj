import express from 'express'

import { Server } from 'socket.io';
import { createServer } from 'http';
import { readEmails,addEmail,editEmail } from './readtxt.js';
import { MongoClient ,ObjectId} from 'mongodb';
import cors from 'cors'
const app = express();
app.use(cors()); // allow all origins, or specify frontend origin
app.use(express.json());
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

const url='mongodb://localhost:27017'


const emailsDbName = 'emails';


let emailsdb,emailscollection;


// Connect to all three databases
MongoClient.connect(url)
  .then(client => {
    // Assign each database to a variable
    emailsdb=client.db(emailsDbName)
    emailscollection=emailsdb.collection('emails')
    console.log('Connected to emails database');
  })
  .catch(err => console.error(err));



app.get('/api/data/emails',async(req,res)=>{
const emails=await emailscollection.find({}).toArray()
    res.json(emails);
})
app.post('/api/data/emails/:id',async(req,res)=>{
  const {id}=req.params
  const {newemail}=req.body
  console.log("id",id,'newmail',newemail)
  if (Object.entries(newemail).length!==0){
  await emailscollection.updateOne({_id:id},{$set :newemail})
    console.log(edited)
}
else{
await emailscollection.deleteOne({_id:new ObjectId(id)})
console.log("deleted")
} 
const emails=await emailscollection.find({}).toArray()

    res.json(emails);
})


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
  const newmail=data['email']
  await addEmail(newmail,safepath)
  safemails=await readEmails(safepath)
  socket.emit('safemail',safemails)
})
socket.on("editsafe",async(data)=>{
  
  await editEmail(data['old'],data['new'],safepath)
  safemails=await readEmails(safepath)
   socket.emit('safemail',safemails)
})

socket.on("addbl",async (data)=>{
  const newmail=data['email']
  await addEmail(newmail,blacklistpath)
  blacklistmail=await readEmails(blacklistpath)
  socket.emit('blacklisted',blacklistmail)
})
socket.on("editbl",async(data)=>{

  await editEmail(data['old'],data['new'],blacklistpath)
  blacklistmail=await readEmails(blacklistpath)
   socket.emit('blacklisted',blacklistmail)
})
})



// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});