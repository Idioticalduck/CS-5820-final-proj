import express from 'express'

import { Server } from 'socket.io';
import { createServer } from 'http';
import { MongoClient ,ObjectId} from 'mongodb';
import cors from 'cors'
const app = express();
app.use(cors()); // allow all origins, or specify frontend origin
app.use(express.json());
const server=createServer(app)

// ref all in var so that can be edited in the code


const PORT = 3000;  // Backend running on port 3000

const url='mongodb://localhost:27017'


const emailsDbName = 'emails';
const accountsDbName='admin';



let emailsdb,emailscollection,accountsDb,accountcollection;
const io= new Server(server,{
  cors: {
    origin: "http://localhost:5173",  // allow your frontend, no need to do this for ipynb because no CORS issue in python
    methods: ["GET", "POST"]
  }
})

// Connect to database
MongoClient.connect(url)
  .then(client => {
    // Assign each database to variable
    emailsdb=client.db(emailsDbName)
    accountsDb=client.db(accountsDbName)
    accountcollection=accountsDb.collection('accounts')
    emailscollection=emailsdb.collection('emails')
    console.log('Connected to emails database');
  })
  .catch(err => console.error(err));



app.get('/api/data/emails/:recipient',async(req,res)=>{
const {recipient}=req.params
const emails=await emailscollection.find({}).toArray()
const filtered=emails.filter(email=>email.recipient==recipient)
    res.json(filtered);
})
app.post('/api/data/emails/:id',async(req,res)=>{
  const {id}=req.params
  const {newemail}=req.body
  console.log("id",id,'newmail',newemail)
  if (Object.entries(newemail).length!==0){
  await emailscollection.updateOne({_id:id},{$set :newemail})
}
else{
await emailscollection.deleteOne({_id:new ObjectId(id)})
console.log("deleted")
} 
const emails=await emailscollection.find({}).toArray()

    res.json(emails);
})


app.post('/api/data/emails',async(req,res)=>{
  const newemail=req.body
  if (Object.entries(newemail).length!==0){
  await emailscollection.insertOne(newemail)

}
else{
await emailscollection.deleteOne({_id:new ObjectId(id)})
console.log("deleted")
} 
const emails=await emailscollection.find({}).toArray()

    res.json(emails);
})


app.post('/api/data/accounts',async (req,res)=>{
  try{
  const newAccount=req.body
  await accountcollection.insertOne(newAccount)
  const accounts=await accountcollection.find({}).toArray()
  res.json(accounts)

  }catch(err){
    console.log('Error:',err)
  }
})

app.post('/api/data/accounts/:email',async (req,res)=>{
  const {email}=req.params
  const account=req.body

  const {_id,...newacc}=account
  if (Object.entries(newacc).length!==0)
  await accountcollection.updateOne({email:email},{$set :newacc})
else
await accountcollection.deleteOne({email})
  const accounts=await accountcollection.find({}).toArray()
  const newaccount=accounts.filter(acc=>acc.email==email)[0]
  res.json(newaccount)
})
app.get('/api/data/accounts/:email',async(req,res)=>{
  try {
    const { email } = req.params;
    const account = await accountcollection.findOne({email});

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    res.json(account);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }

})

io.on('connection',(socket)=>{
    console.log('user connected')
    // broadcasts the blacklist and safelist to all 
    socket.on("py_to_js",(data)=>{
  socket.broadcast.emit("py_to_js",data)
})
socket.on("js_to_py",(data)=>{
  socket.broadcast.emit("js_to_py",data)
})
})



// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});