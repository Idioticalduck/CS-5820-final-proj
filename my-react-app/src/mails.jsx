import { useEffect,useRef,useState } from 'react'
import {io} from 'socket.io-client'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';


const Mail=()=>{
    const [selectedInbox,setSelectedInbox]=useState("All Inboxes")
    const spamthreshold=0.6
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

    const inboxlist=[
        'All',
        'Safe',
        'Spam'
    ]
    const [emails,setEmails]=useState([])
    const [details,setDetails]=useState([])
    const [categorized,setCategorized]=useState([])
    const [loadedin,setLoadedin]=useState(false)
    const [displayedMail,setDisplayedMail]=useState({
   

    }
    )
    const navigation=useNavigate()
    const socketRef=useRef(null)
    useEffect(() => {
    // connect to Node server
    socketRef.current= io("http://localhost:3000");
    
    socketRef.current.on('connect',()=>{
        console.log("socket connected")
           const object_to_send={
        'sender':[],
        'subject':[],
        'body':[],
        'urls':[]
    }
    
    fetch("http://localhost:3000/api/data/emails", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data",data);
        setEmails(data)
        return data
      }).then((data)=>{
        data.map(email=>
        {   
         
            object_to_send.sender.push(email.sender)
            object_to_send.subject.push(email.subject)
            object_to_send.body.push(email.body)
            object_to_send.urls.push(countURLS(email.body))
        })
        console.log("seend",object_to_send)
        
      }).then(()=>{
        console.log(object_to_send)
        socketRef.current.emit('js_to_py',JSON.stringify(object_to_send))
        
      })
      .catch((err) => console.log(err));
  
    })
    // listen for messages from server
    socketRef.current.on("py_to_js", (data) => {
        console.log(data)
      setDetails(data)
    });
    // optional: cleanup on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, [])
    const setDisplay=(e)=>{
        const mail=categorized.filter(mail=>mail.mail._id==e.currentTarget.id)
        console.log(mail)
        setDisplayedMail(mail[0])

    }
    useEffect(()=>{
        const templist=[]
        console.log('ballsy')
        console.log(details.length)
        console.log(emails.length)
        if(emails.length==details.length && details.length!=0){
            for (let i=0;i<emails.length;i++){
                const temp={
                    mail:emails[i],
                    'details':details[i]
                }
                templist.push(temp)
            }
            console.log(templist)
            setCategorized(templist)
            setLoadedin(true)
            console.log('yayah')
        }
        
    },[emails,details])
   
 const countURLS=(body)=>{
    const words = body.split(/\s+/); // split by whitespace
  const links = new Set();

  words.forEach(word => {
    domainIndicators.forEach(domain => {
      if (word.includes(domain)) {
        links.add(word);
      }
    });
  });
  return (links.size)
}   



    useEffect(()=>{
        console.log("emain",emails)
    },[emails])
    useEffect(()=>{
        console.log("deets",details)
    },[details])


    const [showinboxes,setShowinboxes]=useState(false)

    const deletemail=(id)=>{
              const object_to_send={
        'sender':[],
        'subject':[],
        'body':[],
        'urls':[]
    }
    if (confirm("Are you sure you want to delete the email? This action cannot be undone")){
      fetch(`http://localhost:3000/api/data/emails/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify({"newemail":{}})
      
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data",data);
        window.location.reload()
      })
      .catch((err) => console.log(err));
    }
    }
    
     return (
        
        <>
    
        {loadedin?
        
        <div className="container mx-auto mt-4">
        
          <div className="flex flex-col md:flex-row gap-4">
            {/* Sidebar - Account List */}
            <div className="md:w-1/3 w-full">
                  <div>
            <h1 className='px-4 py-2 border-2 border-gray-200 bg-gray-150 rounded-xl'>
                Inbox: {selectedInbox}
                <button onClick={()=>setShowinboxes(prev=>(!prev))}>{showinboxes ? (
        <ChevronUpIcon className="w-4 h-4 ml-2" />
      ) : (
        <ChevronDownIcon className="w-4 h-4 ml-2" />
      )}</button>
            </h1>
            {showinboxes&&
                <ul>
                {inboxlist.map(inboxname=>(
                    <li key={inboxname} onClick={()=>setSelectedInbox(inboxname)} className= {`px-4 py-2 rounded-sm border-2 border-gray  hover:bg-gray-700 hover:text-amber-50 ${(selectedInbox==inboxname)?'bg-gray-500':''}`}>
                        {inboxname}
                    </li>
                ))}
            </ul>
}
        
          
            
        </div>
       
              <div className="bg-white shadow rounded border">
                <div className="bg-gray-700 text-white px-4 py-2 font-semibold">
                  Incoming emails
                   <button className='bg-amber-50 text-black float-right' onClick={()=>navigation('/blacklist')}>Edit blacklist</button>
                </div>
                
       
                <ul className="divide-y max-h-120 overflow-y-scroll">
                  {
                    (selectedInbox=='Spam'?categorized.filter(mail=>mail.details['spam?']>=spamthreshold):selectedInbox=="Safe"?categorized.filter(mail=>mail.details['spam?']<=spamthreshold):categorized)?.map((email) => 
                    {
                        const{mail,details}=email
                        return(
                      <li
                            key={mail._id}
                       id={mail._id}
                        className={`px-4 py-2 ${details["spam?"]<spamthreshold? `hover:bg-gray-500 hover:text-amber-50 cursor-pointer ${ displayedMail.mail?._id==mail._id?'bg-gray-500 text-amber-50':''}`:` hover:bg-red-600 hover:text-amber-50 cursor-pointer bg-red-300 ${displayedMail.mail?._id==mail._id?'bg-red-600 text-amber-50':''}`}`}
                       
                        onClick={(e) => {
                          setDisplay(e);
                        }}
                        
                      >
                        <h1 className='text-2xl'>
                        {mail.subject}
                        </h1>
                        <p className='pl-2 text-xs'>From: {mail.sender}</p>
                        <button id={mail._id} onClick={(e)=>deletemail(e.target.id)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
<path d="M3 6h18v2H3V6zm2 3h14l-1.5 12h-11L5 9zm3-7h8v2H8V2z"/>
  </svg></button>
                      </li>
                    )})}
                </ul>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:w-2/3 w-full flex flex-col gap-4">
              {/* Account Details */}
              <div className="bg-white shadow rounded border">
                <div className="bg-gray-700 text-white px-4 py-2 font-semibold">
                  Email
                  
                </div>
             {displayedMail.mail && (
                <>
                 <div
  className={`mt-4 mx-2 px-4 py-2 text-2xl font-semibold rounded-xl border-2 shadow-md text-center
    ${
      displayedMail.details["spam?"] < spamthreshold
        ? "bg-lime-400 text-green-900 border-green-700"
        : "bg-red-500 text-white border-red-700"
    }`}
>
    {displayedMail.details.safemail ? 'This email has been labelled as safe':displayedMail.details.blmail? 'This email has been listed as automatic Spam':`Likelihood of Spam: ${(displayedMail.details["spam?"]*100).toFixed(2)}%`}
 
</div>

                  <ul className="divide-y ">
                    <li className="px-4 py-2">Sender: {displayedMail.mail.sender}</li>

                    <li className="px-4 py-2">Subject: {displayedMail.mail.subject}</li>
                    <li className='px-4 py-2 max-h-120 overflow-y-scroll'>Body :<br/>{displayedMail.mail.body}</li>
                    
                     
                    
                    
                  </ul>
                  </>
                )}
             
              </div>
            </div>
          </div>
        </div>:
      <div className="flex items-center justify-center min-h-screen">
  <div role="status m-50%">
    <svg aria-hidden="true" class="w-40 h-40 text-neutral-tertiary animate-spin fill-brand" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span class="sr-only">Loading...</span>
</div>
</div>


}
        </>
    )
}



export default Mail