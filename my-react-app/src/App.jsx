import { useEffect,useRef,useState } from 'react'
import {io} from 'socket.io-client'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

function App() {
  const [sender,setSender]=useState("")
  const [subject,setSubject]=useState("")
  const [body,setBody]=useState("")

  const [detail,setDetails]=useState({})
  const [blacklisted,setBlacklisted]=useState([])
  const [safe,setSafe]=useState([])
  const domainIndicators = [
  ".com", ".org", ".net", ".info", ".biz", ".gov", ".edu", ".mil",
  ".io", ".co", ".xyz", ".me", ".dev", ".app", ".ly", ".gl", ".gg",
  ".id", ".sg", ".my", ".th", ".vn", ".ph", ".hk", ".kr", ".jp", ".cn",
  ".in", ".ae", ".qa", ".sa", ".il", ".tr", ".ru", ".ua", ".by", ".pl",
  ".de", ".fr", ".es", ".it", ".uk", ".ie", ".nl", ".se", ".no", ".fi",
  ".dk", ".is", ".ch", ".at", ".be", ".cz", ".sk", ".hu", ".ro", ".bg",
  ".gr", ".pt", ".lt", ".lv", ".ee", ".hr", ".rs", ".si", ".ba", ".me",
  ".us", ".ca", ".mx", ".br", ".ar", ".cl", ".co", ".ve", ".pe", ".uy",
  ".za", ".ng", ".ke", ".eg", ".gh", ".tz", ".ma", ".dz", ".tn",
  ".tv", ".fm", ".online", ".site", ".store", ".tech", ".club",
  ".agency", ".design", ".news", ".blog", ".mobi", ".shop", ".email",
  ".link", ".space", ".life", ".today", ".games", ".video", ".photos",
  ".media", ".website", ".software", ".cloud", ".solutions", ".systems",
  ".services", ".community", ".network", ".center", ".digital",
  ".studio", ".finance", ".law", ".lawyer", ".legal", ".art", ".music",
  ".band", ".live", ".show", ".movie", ".film", ".press", ".beauty",
  ".health", ".care", ".clinic", ".doctor", ".bank", ".money", ".crypto",
  ".capital", ".fund", ".loan", ".investments", ".energy", ".green",
  ".eco", ".travel", ".hotel", ".vacations", ".restaurant", ".shop",
  ".fashion", ".fit", ".yoga", ".games", ".casino", ".bet", ".tv",
  ".global", ".world", ".company", ".business", ".international"
];
  const socketRef=useRef(null)
   useEffect(() => {
    // connect to Node server
    socketRef.current= io("http://localhost:3000");

    // listen for messages from server
    socketRef.current.on("py_to_js", (data) => {
  
      setDetails(data)
    });
    socketRef.current.on("safemail",(data)=>{
      console.log(data)
      setSafe(data)
    })
    socketRef.current.on("blacklisted",(data)=>{
      setBlacklisted(data)
    })
    // optional: cleanup on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, [])
  const countURLS=()=>{
    const words = body.split(/\s+/); // split by whitespace
  const links = new Set();

  words.forEach(word => {
    domainIndicators.forEach(domain => {
      if (word.includes(domain)) {
        links.add(word);
      }
    });
  });

  return links.size ;
  }

  useEffect(()=>{
    console.log("details:",detail)
  },[detail])

  const [editing,setEditing]=useState()
  const [tempnewmail,setTempnewmail]=useState()
  const submit=()=>{
    const urls=countURLS()
    const email={
      "sender":[sender],
      "subject":[subject],
      "body":[body],
      "urls":[urls]
    }
    console.log(email)
    socketRef.current.emit("js_to_py",JSON.stringify(email))

    return 1
  }
  const delete_email=(type,email)=>{
    if(type=="safe"){
      socketRef.current.emit("editsafe",{
      'old':email,
      'new':''
      })
    }else{
      socketRef.current.emit("editbl",{
      'old':email,
      'new':''
      })
    }
  }
    const checkEmail = async (mail) => {

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      return true
    } else return false
  };
  const handleEnter=async(oldmail,newmail,type) =>{
    console.log(newmail)
    const check=await checkEmail(newmail)
    if(check){
      console.log(';1')
      if(type=="safe"){
      socketRef.current.emit("editsafe",{
      'old':oldmail,
      'new':newmail
      })
    }else{
      socketRef.current.emit("editbl",{
      'old':oldmail,
      'new':newmail
      })
    }
    }
    setEditing('')
  }
  const [adding_newsafe,setAdding_newsafe]=useState(false)
  const [adding_newbl,setAdding_newbl]=useState(false)
  const handleEnter2=async(newmail,type) =>{
    console.log(newmail)
    const check=await checkEmail(newmail)
    if(check){
      console.log(';1')
      if(type=="safe"){
      socketRef.current.emit("addsafe",{
      
      'email':newmail
      })
      
    }else{
      socketRef.current.emit("addbl",{
      'email':newmail
      })
    }
    
    }
    setAdding_newbl(false)
    setAdding_newsafe(false)
   
  }
  useEffect(()=>{
    setTempnewmail(editing)
  },[editing])
  const[showsafe,setShowsafe]=useState(false)
  const[showblacklisted,setShowblacklisted]=useState(false)
  return (
    <>
    <div>
      <div>
    <div className='bg-green-500'>
      <h1 className="text-white text-4xl">Whitelisted </h1>
      <button onClick={()=>setShowsafe(prev=>(!prev))}>{showsafe ? (
        <ChevronUpIcon className="w-4 h-4 ml-2" />
      ) : (
        <ChevronDownIcon className="w-4 h-4 ml-2" />
      )}</button>
      </div>
      {(safe.length!=0&&showsafe)?
      <div>
    <ul>
        {safe.map(mail=>(
          <li id={mail} key={mail}>
            {editing!=mail? mail:
            
            <input type='text' value={tempnewmail} key={mail}  onChange={(e) => setTempnewmail(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleEnter(mail, tempnewmail,"safe");
    }
  }}/>}
            <button onClick={()=>setEditing(mail)}>edit</button>
            <button onClick={()=>delete_email("safe",mail)}>delete</button></li>
        ))}
        {adding_newsafe?
        <li>
              <input type='text' value={tempnewmail} onChange={(e) => setTempnewmail(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleEnter2(tempnewmail,"safe");
    }
  }}/>

        </li>
        :
        
        <li>
          <button onClick={()=>{
            setAdding_newsafe(true)
            setAdding_newbl(false)
            }}>+</button>
        </li>
        }
    </ul>
    </div>
:<></>}
</div>
<div>
<div className='bg-red-800'><h1 className='text-shadow-neutral-800 text-4xl'>Blacklisted</h1>
      <button onClick={()=>setShowblacklisted(prev=>(!prev))}>{showblacklisted ? (
        <ChevronUpIcon className="w-4 h-4 ml-2" />
      ) : (
        <ChevronDownIcon className="w-4 h-4 ml-2" />
      )}</button>
</div>
{(blacklisted.length!=0 &&showblacklisted)?
    <div>
      <ul>
        {blacklisted.map(mail=>(
          <li id={mail} key={mail}>
            {editing!=mail? mail:
            
            <input type='text' value={tempnewmail} key={mail}  onChange={(e) => setTempnewmail(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleEnter(mail, tempnewmail,"blacklisted");
    }
  }}/>}
            <button onClick={()=>setEditing(mail)}>edit</button>
            <button onClick={()=>delete_email("blacklisted",mail)}>delete</button></li>
        ))}
         {adding_newbl?
        <li>
              <input type='text' value={tempnewmail} onChange={(e) => setTempnewmail(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleEnter2(tempnewmail,"safe");
    }
  }}/>

        </li>
        :
        
        <li>
          <button onClick={()=>{
            setAdding_newsafe(false)
            setAdding_newbl(true)
            }}>+</button>
        </li>
        }
    </ul>

    </div>
:<></>}
</div>
    <div>
    <label>
      Sender Details
      <input type='text' placeholder='Format: Sender name <senderemail@senderdomain.com>' onChange={(e)=>setSender(e.target.value)}></input>
    </label>
    </div>
    <div>
        <label>
    Subject
    <input type='text' placeholder="Subject" onChange={(e)=>setSubject(e.target.value)}></input>
    </label>
    </div>
    <div>
 <label>
      Body
      <input type='textarea' placeholder="Input email body" onChange={(e)=>setBody(e.target.value)}></input>
    </label>
    </div>
    <div>
       <button onClick={()=>submit()} >Submit Details</button>
    </div>
    
    </div>
    {Object.keys(detail).length!=0?

    <div>
      <h1>
      Likelihood of spam: {detail['spam?']*100}%
      </h1>
      {detail['safemail']?
      <>
      <p>Reasoning: email listed among safe emails</p>
      </>
    :detail['blmail'] ?
    <>
    <p>Reasoning:email listed among blacklisted emails</p>
    </>
    :<>
    </>
    } 
 
    </div>:<></>}
    </>

  )
}

export default App
