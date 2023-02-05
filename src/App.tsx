import { Camera, Chat, StartForm } from './components'
import './App.css'
import { useEffect, useState } from 'react'
import { useGlobalStore } from './hooks/useGlobalStore'

function App() {
  const [pageState, setPageState] = useState('StartForm')
  const [startCamera, setStartCamera] = useState(false)

  useEffect(() => {
    if (pageState === 'Chat') {
      const cameraContainer = document.getElementById('camera-container')
      if (cameraContainer) {
        cameraContainer.hidden = true
      }
      setStartCamera(true)
    }
  }, [pageState])

  return (
    <>
      <div className="bg-slate-50 h-screen w-full flex justify-center items-center relative overflow-hidden">
        <Camera startCameraRecording={startCamera} />
        {pageState === 'StartForm' && (
          <>
            <StartForm setPageState={setPageState} />
          </>
        )}
        {pageState === 'Chat' && (
          <div className="flex max-w-2xl w-full z-10 h-screen p-8">
            <Chat />
          </div>
        )}
      </div>
    </>
  )
}

export default App
