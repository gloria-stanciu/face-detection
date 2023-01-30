import { Camera, Chat, StartForm } from './components'
import './App.css'
import { MutableRefObject, Ref, useEffect, useRef, useState } from 'react'
import { fetchOpenAI } from './hooks/api-calls'

function App() {
  const [pageState, setPageState] = useState('StartForm')
  const [startCamera, setStartCamera] = useState(false)
  const cameraContainer = useRef<Ref<HTMLDivElement>>(null)

  // useEffect(() => {
  //   fetchOpenAI()
  // }, [])

  useEffect(() => {
    if (pageState === 'Chat') {
      if (cameraContainer.current) {
        // @ts-ignore
        cameraContainer.current.hidden = true
      }
      setStartCamera(true)
    }
  }, [pageState])

  return (
    <>
      <div
        className="bg-slate-50 h-screen w-full flex justify-center items-center relative"
        // ref={constraintsRef}
      >
        <Camera
          startCameraRecording={startCamera}
          cameraContainer={cameraContainer}
        />
        {pageState === 'StartForm' && (
          <>
            <StartForm setPageState={setPageState} />
            <div className="flex-col w-full"></div>
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
