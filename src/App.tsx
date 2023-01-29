import { Camera, Chat } from './components'
import './App.css'

function App() {
  return (
    <>
      <div className="bg-slate-50 h-screen w-full flex justify-center items-center relative">
        <Camera />
        <div className="flex max-w-2xl w-full z-10 h-screen p-8">
          {/* <img className="ml-4" src="./logo.svg" /> */}
          {/* <div className="h-1/4"> */}
          <Chat />
          {/* </div> */}
        </div>
      </div>
      {/* <div className="bg-white h-screen w-[661px] absolute top-0" /> */}
    </>
  )
}

export default App
