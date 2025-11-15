import { useEffect,useRef,useState } from 'react'
import {io} from 'socket.io-client'


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
    const [emails,setEmails]=useState([{}])
    const [details,setDetails]=useState([])
    const [categorized,setCategorized]=useState([])
    const [displayedMail,setDisplayedMail]=useState()

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
            console.log("current",email)
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
       
        const mail=emails.filter(mail=>mail._id==e.target.id)
        console.log(mail)
        setDisplayedMail(mail[0])

    }
    useEffect(()=>{
        const templist=[]
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
    },emails)
    useEffect(()=>{
        console.log("deets",details)
    },details)
    return(
        <>
        <div>
            <h1>
                {selectedInbox}
            </h1>
            <ul>
                {inboxlist.map(inboxname=>(
                    <li key={inboxname} onClick={()=>setSelectedInbox(inboxname)} className= {selectedInbox==inboxname?'bg-gray-500':'bg-amber-100'}>
                        {inboxname}
                    </li>
                ))}
            </ul>
       
                <ul className="divide-y max-h-120 overflow-y-scroll">
                  {
                    (selectedInbox=='Spam'?categorized.filter(mail=>mail.details['spam?']>=spamthreshold):selectedInbox=="Safe"?categorized.filter(mail=>mail.details['spam?']<=spamthreshold):categorized)?.map((email) => 
                    {
                        const{mail,details}=email
                        return(
                      <li
                        className={details["spam?"]<spamthreshold?"px-4 py-2 hover:bg-gray-100 cursor-pointer":"px-4 py-2 hover:bg-red-600 cursor-pointer bg-red-300"}
                        id={mail._id}
                        onClick={(e) => {
                          setDisplay(e);
                        }}
                        key={mail._id}
                      >
                        {mail.subject}
                      </li>
                    )})}
                </ul>
                {displayedMail && (
                  <ul className="divide-y">
                    <li className="px-4 py-2">Sender: {displayedMail.sender}</li>

                    <li className="px-4 py-2">Subject: {displayedMail.subject}</li>
                    <li className='px-4 py-2'>Body :{displayedMail.body}</li>
                    
                     
                    
                    
                  </ul>
                )}
            
        </div>
        
        </>
    )
}



export default Mail