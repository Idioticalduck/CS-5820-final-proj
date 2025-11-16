import { React,StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import './index.css'
import App from './App.jsx'
import Mail from './mails.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
    <Routes>
      <Route path="/" element={<Mail />} />
      <Route path="/blacklist" element={<App />} />
    </Routes>
  </Router>
    
  </StrictMode>,
)
