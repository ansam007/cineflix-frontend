import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter is the "Brain" that manages our URLs */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)