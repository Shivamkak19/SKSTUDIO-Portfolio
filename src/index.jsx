import { createRoot } from 'react-dom/client'
import React from 'react'
import './styles.css'
import './panels.css'
import App from './App3'
import Overlay from './Overlay'

createRoot(document.querySelector('#root')).render(
  <>
    <App />
    <Overlay />
  </>
)
