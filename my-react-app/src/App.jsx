import { useEffect,useRef,useState } from 'react'
import {io} from 'socket.io-client'
import { useNavigate } from 'react-router-dom'

function App() {


  const [blacklisted,setBlacklisted]=useState([])
  const [safe,setSafe]=useState([])
  const socketRef=useRef(null)
  const navigation=useNavigate()
   useEffect(() => {
    // connect to Node server
    socketRef.current= io("http://localhost:3000");

    // listen for messages from server
  
    socketRef.current.on("safemail",(data)=>{
      console.log(data)
      setSafe(data)
    })
    socketRef.current.on("blacklisted",(data)=>{
      console.log(data)
      setBlacklisted(data)
    })
    // optional: cleanup on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, [])



  const [editing,setEditing]=useState()
  const [tempnewmail,setTempnewmail]=useState()
  const delete_email=(type,email)=>{
    if(confirm("Are you sure you wish to delete? This cannot be undone."))
{    if(type=="safe"){
      socketRef.current.emit("editsafe",{
      'old':email,
      'new':''
      })
    }else{
      socketRef.current.emit("editbl",{
      'old':email,
      'new':''
      })
    }}
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
      console.log('addblacklist')
      socketRef.current.emit("addbl",{
      'email':newmail
      })
    }
    
    }
    setTempnewmail('')
    setAdding_newbl(false)
    setAdding_newsafe(false)
   
  }
  useEffect(()=>{
    setTempnewmail(editing)
  },[editing])

  return (
    <div>
      <div onClick={()=>navigation('/') } className='text-4xl text-amber-50 bg-pink-950 p-4'>Return to Inboxes</div>
    <div className="fixed left-0 w-full h-screen flex">
      <div className='flex-1'>
    <div className='bg-green-500 '>
      <h1 className="text-white text-4xl p-4">Whitelisted </h1>
      </div>
      {(safe.length!=0)?
      <div>
    <ul>
        {safe.map(mail=>(
           <li id={mail} key={mail}
          className={`border-2 border-gray-500 px-4 py-2 hover:bg-gray-500 hover:text-amber-50 cursor-pointer ${ editing==mail?'bg-gray-500 text-amber-50':''}`}>
            {editing!=mail? <>{mail}
            <button onClick={()=>{setEditing(mail)
              setAdding_newbl(false)
              setAdding_newsafe(false)
            }}> <svg className=" w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path d="M3 17.25V21h3.75l11.02-11.02-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.41L18.37 3.29a1.003 1.003 0 0 0-1.41 0l-2.34 2.34 3.75 3.75 2.34-2.34z" fill="currentColor"/>
  </svg></button>
            </>:
            <>
            <input type='text'
            className='bg-amber-50 text-black'
            value={tempnewmail} key={mail}  onChange={(e) => setTempnewmail(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleEnter(mail, tempnewmail,"safe");
    }
  }}/>
  <button class="p-2 rounded"
  onClick={()=>setEditing('')}
  >
  <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
</button>

  </>}
            
  <button onClick={()=>delete_email("safe",mail)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
<path d="M3 6h18v2H3V6zm2 3h14l-1.5 12h-11L5 9zm3-7h8v2H8V2z"/>
  </svg>
              </button></li>
        ))}
        {adding_newsafe?
        <li
                  className={`border-2 border-gray-500 px-4 py-2 hover:bg-gray-500 hover:text-amber-50 cursor-pointer ${ adding_newsafe?'bg-gray-500 text-amber-50':''}`}
>
              <input type='text'className='bg-amber-50 text-black' value={tempnewmail} onChange={(e) => setTempnewmail(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleEnter2(tempnewmail,"safe");
    }
  }}/>
    <button class="p-2 rounded"
  onClick={()=>setAdding_newsafe(false)}
  >
  <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
</button>

        </li>
        :
        
        <li className='border-2 border-gray-500 px-4 py-2'>
          <button className='hover:bg-amber-300' onClick={()=>{
            setAdding_newsafe(true)
            setAdding_newbl(false)
            setEditing('')
            }}>+</button>
        </li>
        }
    </ul>
    </div>
:<></>}
</div>
<div className='flex-1'> 
<div className='bg-red-800'><h1 className='p-4 text-amber-50 text-4xl'>Blacklisted</h1>

</div>
{(blacklisted.length!=0 )?
    <div>
      <ul>
        {blacklisted.map(mail=>(
          <li id={mail} key={mail}
          className={`border-2 border-gray-500 px-4 py-2 hover:bg-gray-500 hover:text-amber-50 cursor-pointer ${ editing==mail?'bg-gray-500 text-amber-50':''}`}>
            {editing!=mail? <>{mail}
            <button onClick={()=>{setEditing(mail)
              setAdding_newbl(false)
              setAdding_newsafe(false)
            }}> <svg class=" w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path d="M3 17.25V21h3.75l11.02-11.02-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.41L18.37 3.29a1.003 1.003 0 0 0-1.41 0l-2.34 2.34 3.75 3.75 2.34-2.34z" fill="currentColor"/>
  </svg></button>
            </>:
            <>
            <input type='text'
            className='bg-amber-50 text-black'
            value={tempnewmail} key={mail}  onChange={(e) => setTempnewmail(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleEnter(mail, tempnewmail,"blacklisted");
    }
  }}/>
  <button class="p-2 rounded"
  onClick={()=>{setEditing('')
    setAdding_newbl(false)
    setAdding_newsafe(false)
  }
  }
  >
  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
</button>

  </>}
            
            <button onClick={()=>delete_email("blacklisted",mail)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
<path d="M3 6h18v2H3V6zm2 3h14l-1.5 12h-11L5 9zm3-7h8v2H8V2z"/>
  </svg>
              </button></li>
        ))}
         {adding_newbl?
        <li
                  className={`border-2 border-gray-500 px-4 py-2 hover:bg-gray-500 hover:text-amber-50 cursor-pointer ${ adding_newbl?'bg-gray-500 text-amber-50':''}`}>
              <input type='text'className='bg-amber-50 text-black' value={tempnewmail} onChange={(e) => setTempnewmail(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleEnter2(tempnewmail,"blacklisted");
    }
  }}/>
    <button class="p-2 rounded"
  onClick={()=>setAdding_newbl(false)}
  >
  <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
</button>

        </li>
        :
        
        <li className='border-2 border-gray-500 px-4 py-2'>
          <button className='hover:bg-amber-300' onClick={()=>{
            setAdding_newsafe(false)
            setAdding_newbl(true)
            setEditing('')
            }}>+</button>
        </li>
        }
    </ul>

    </div>
:<></>}
</div>

    
    </div>
 
    </div>

  )
}

export default App
