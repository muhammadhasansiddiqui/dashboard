import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
// import './index.css'
import "./assets/css/index.css";
import "./assets/css/grid.css";
import "./assets/boxicons-2.0.7/css/boxicons.min.css";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
