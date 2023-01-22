import { Camera } from './components'
import './App.css'

function App() {
  return (
    <>
      <div className="bg-purple-500 h-screen w-full flex justify-center items-center relative">
        <Camera />
        <div className="flex flex-col items-start gap-4 z-10">
          <img className="ml-4" src="./logo.svg" />
          <div
            className="chatbot-container rounded-xl overflow-hidden drop-shadow-2xl "
            style={{ height: '50rem', width: '50rem' }}
          ></div>
        </div>
      </div>
      <div className="bg-white h-screen w-[661px] absolute top-0" />
    </>
  )
}

export default App
