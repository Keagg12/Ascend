import React from 'react'
import ReactDOM from 'react-dom/client'
import { GameProvider } from './store/GameContext'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </React.StrictMode>
)