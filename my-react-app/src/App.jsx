import {React, useEffect,useState,useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlobalContext } from './main'
function App() {



   const {currentAccount,setCurrentAccount} =
          useContext(GlobalContext);

  const navigation=useNavigate()



  const [editing,setEditing]=useState()
  const [tempnewmail,setTempnewmail]=useState()
[toyota___,,,,,,,,,]


  const postChanges=(newacc)=>{
    fetch(`http://localhost:3000/api/data/accounts/${currentAccount.email}`, {
          method: "POST", // Specifies that this is a POST request
          headers: {
            "Content-Type": "application/json", // Indicate the type of data being sent
          },
          body: JSON.stringify(newacc), // Send the new account object as JSON
        })
          .then((response) => response.json()) // Convert the response to JSON
          .then((data) => {
            console.log("User created:", data)
            setCurrentAccount(data); // Log the updated list of accounts (from POST response)
          })
          .catch((error) => {
            console.error("Error:", error); // Catch and log any errors
          });
  }

  // delete email from either list
  
  const delete_email=(type,email)=>{
    const temp={...currentAccount}
    if(confirm("Are you sure you wish to delete? This cannot be undone."))
{    if(type=="safe"){

      temp.whitelist=temp.whitelist.filter(address=>address!=email)

      
    
    }else {
      temp.blacklist=temp.blacklist.filter(address=>address!=email)
    }
    postChanges(temp)
  }
  }

  // check if valid email format

    const checkEmail = async (mail) => {

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      return true
    } else return false
  };

  //handling for when pressing enter on the edit email textinput

  const handleEnter=async(oldmail,newmail,type) =>{
    console.log(newmail)
     const temp={...currentAccount}

    //makes changes if it is a valid email 

    const check=await checkEmail(newmail)
    if(check){
    
      if(type=="safe"){
      temp.whitelist=temp.whitelist.map(mail=>mail==oldmail?newmail:mail)
    }else{
      temp.blacklist=temp.blacklist.map(mail=>mail==oldmail?newmail:mail)
    }
    postChanges(temp)
    }


    setEditing('')
  }
  const [adding_newsafe,setAdding_newsafe]=useState(false)
  const [adding_newbl,setAdding_newbl]=useState(false)

  // handle enter on the add email textinput

  const handleEnter2=async(newmail,type) =>{
    console.log(newmail)
    const temp={...currentAccount}

    //only adds if proper email format

    const check=await checkEmail(newmail)
   if(check){
    
      if(type=="safe"){
      temp.whitelist.push(newmail)
    }else{
      temp.blacklist.push(newmail)
    }
    postChanges(temp)
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
    
      <div>
    <ul>
        {/* outputs all of the data in safemails and in a list with text, edit button and delete button */}
        {currentAccount.whitelist.map(mail=>(
           <li id={mail} key={mail}
          className={`border-2 border-gray-500 px-4 py-2 hover:bg-gray-500 hover:text-amber-50 cursor-pointer ${ editing==mail?'bg-gray-500 text-amber-50':''}`}>
            {/* if editing the current one, then change to a textinput field with the email and changes pencil to cancel button
            press enter to submit email

            if press pencil then change the one being edited to current one, the other edits on other ones not saved. only current edit saved
            */}
            {editing!=mail? <>{mail}
            <button onClick={()=>{setEditing(mail)
              setAdding_newbl(false)
              setAdding_newsafe(false)
            }}> 
            {/* pencil svg button */}
            <svg className=" w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
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

  {/* svg for cross symbol button */}
  <button className="p-2 rounded"
  onClick={()=>setEditing('')}
  >
  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
</button>

  </>}
            
  <button onClick={()=>delete_email("safe",mail)}>
    {/* trash can svg */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
<path d="M3 6h18v2H3V6zm2 3h14l-1.5 12h-11L5 9zm3-7h8v2H8V2z"/>
  </svg>
              </button></li>
        ))}

        {/* conditional last row if adding new
        if creating new (pressed the +) then changes to a textinput with an exit x and enter is pressed to send
        */}
        {adding_newsafe?
        <li
                  className={`border-2 border-gray-500 px-4 py-2 hover:bg-gray-500 hover:text-amber-50 cursor-pointer ${ adding_newsafe?'bg-gray-500 text-amber-50':''}`}
>
              <input type='text'className='bg-amber-50 text-black' value={tempnewmail} placeholder="enter email: press enter to confirm addition"onChange={(e) => setTempnewmail(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleEnter2(tempnewmail,"safe");
    }
  }}/>
    <button className="p-2 rounded"
  onClick={()=>setAdding_newsafe(false)}
  >
  {/* svg for the cross symbol to cancel */}
  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

</div>
<div className='flex-1'> 
<div className='bg-red-800'><h1 className='p-4 text-amber-50 text-4xl'>Blacklisted</h1>

</div>

{/* follows same logic as the whitelisted one */}

    <div>
      <ul>
        {currentAccount.blacklist.map(mail=>(
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
      handleEnter(mail, tempnewmail,"blacklisted");
    }
  }}/>
  <button className="p-2 rounded"
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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
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
    <button className="p-2 rounded"
  onClick={()=>setAdding_newbl(false)}
  >
  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

</div>

    
    </div>
 
    </div>

  )
}

export default App
