import { Camera } from './components'
import './App.css'
import { useEffect } from 'react'


function App() {

  return (
    <>
      <Camera />
      <div className="chatbot-container" style={{height: '500px'}}></div>
    </>
  )
}

export default App
