import { useState } from 'react'


function App() {
  const [count, setCount] = useState(0)
  const [sender,setSender]=useState()
  const [subject,setSubject]=useState()
  const [body,setBody]=useState()
  const [urls,setUrls]=useState()

  const countURLS=()=>{

  }
  const submit=()=>{
    return 1
  }
  return (
    <>
    <div>
    <div>
    <label>
      Sender Details
      <input type='text' placeholder='Format: Sender name <senderemail@senderdomain.com>'></input>
    </label>
    </div>
    <div>
        <label>
    Subject
    <input type='text' placeholder="Subject"></input>
    </label>
    </div>
    <div>
 <label>
      Body
      <input type='textarea' placeholder="Input email body"></input>
    </label>
    </div>
    <div>
       <button onClick={submit} >Submit Details</button>
    </div>
    
    </div>
    </>
  )
}

export default App
