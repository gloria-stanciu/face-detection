import { Camera, Chat, StartForm } from './components'
import './App.css'
import { useEffect, useState } from 'react'
import { useGlobalStore } from './hooks/useGlobalStore'
import { Questionnaire } from './components/Questionnaire'
import { Finished } from './components/Finished'

function App() {
  const [pageState, setPageState] = useState('StartForm')
  const [startCamera, setStartCamera] = useState(false)

  useEffect(() => {
    if (pageState === 'Chat') {
      const cameraContainer = document.getElementById('camera-container')
      if (cameraContainer) {
        cameraContainer.style.opacity = '0'
      }
      setStartCamera(true)
    }
    // if (['Questionnaire', 'Finished'].includes(pageState)) {
    //   const cameraContainer = document.getElementById('camera-container')
    //   if (cameraContainer) {
    //     cameraContainer.hidden = true
    //   }
    //   setStartCamera(false)
    // }
  }, [pageState])

  return (
    <>
      <div
        className={`bg-slate-50 flex justify-center items-center relative ${
          pageState !== 'Questionnaire' ? 'overflow-hidden h-screen w-full' : ''
        }`}
      >
        <Camera startCameraRecording={startCamera} />
        {pageState === 'StartForm' && (
          <>
            <StartForm setPageState={setPageState} />
          </>
        )}
        {pageState === 'Chat' && (
          <div className="flex max-w-2xl w-full z-10 h-screen p-8 ">
            <Chat setPageState={setPageState} />
          </div>
        )}
        {/* {pageState === 'Questionnaire' && (
          <div className="flex z-10 my-8 h-full items-center justify-center flex-col md:max-w-7xl">
            <Questionnaire setPageState={setPageState} />
          </div>
        )}
        {pageState === 'Finished' && (
          <div className="flex z-10 my-8 h-full items-center justify-center flex-col md:max-w-7xl">
            <Finished />
          </div>
        )} */}
      </div>
    </>
  )
}

export default App
