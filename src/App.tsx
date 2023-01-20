import { Camera } from './components'
import './App.css'
import { useEffect } from 'react'

function App() {
  return (
    <div className="bg-gradient-to-br from-purple-300 to-purple-100 h-screen w-full flex justify-center items-center ">
      <Camera />
      <div
        className="chatbot-container rounded-xl overflow-hidden drop-shadow-2xl "
        style={{ height: '50rem', width: '50rem' }}
      ></div>
    </div>
  )
}

export default App
