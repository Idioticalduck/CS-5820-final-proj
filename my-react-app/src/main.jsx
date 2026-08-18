import { React,StrictMode,useEffect,useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import './index.css'
import App from './App.jsx'
import Mail from './mails.jsx'
import { createContext } from 'react'
import Login from './login.jsx'
export const GlobalContext=createContext()

export const GlobalProvider=({children})=>{

  const [currentAccount, setCurrentAccount] = useState(
    localStorage.getItem("currentAccount") ? JSON.parse(localStorage.getItem("currentAccount")):"",
  );

  
 



  useEffect(()=>{
    if(currentAccount){
    localStorage.setItem('currentAccount',JSON.stringify(currentAccount))
    }
  },[currentAccount])


  return (
    <GlobalContext.Provider
      value={{
       
        currentAccount,
        setCurrentAccount,
        
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Mail />} />
        <Route path="/blacklist" element={<App />} />
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </Router>

    </GlobalProvider>
    
    
  </StrictMode>,
)
