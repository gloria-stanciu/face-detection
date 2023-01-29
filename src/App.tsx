import { Camera, Chat } from './components'
import './App.css'
import { useEffect } from 'react'

function App() {
  // const fetchOpenAI = async () => {
  //   const res = await fetch(
  //     'https://bibmytmkipilvlznixwo.functions.supabase.co/create-completion-open-ai',
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  //       },
  //       body: JSON.stringify({
  //         name: 'Functions',
  //         prompt:
  //           'The AI must make the human angry! Use emoji while doing this.',
  //       }),
  //     }
  //   )

  //   console.log(await res.json())
  // }

  // useEffect(() => {
  //   fetchOpenAI()
  // }, [])
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
