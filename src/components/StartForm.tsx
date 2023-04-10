import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { nanoid } from 'nanoid'
import { Input, InputTypes } from './Input'
import { useGlobalStore } from '../hooks/useGlobalStore'
import { useSupabase } from '../hooks'
import { useSearchParams } from 'react-router-dom'
import PageNotFound from '../assets/page-not-found.svg'

type CaseType = 'INIBOT' | 'SUBEMO' | 'EMOCOM'
const caseStudyTypes: CaseType[] = ['INIBOT', 'SUBEMO', 'EMOCOM']

const FormInputs: InputTypes[] = [
  {
    type: 'input',
    placeholder: 'Nickname',
    id: 'nickname',
  },
  {
    type: 'checkbox',
    placeholder:
      'I have read all the terms written in the consent part and agreed to be part of the study!',
    id: 'terms',
  },
]

export const StartForm = ({
  setPageState,
}: {
  setPageState: Dispatch<SetStateAction<string>>
}) => {
  const { conversation, updateConversation } = useGlobalStore(state => ({
    conversation: state.conversation,
    updateConversation: state.updateConversation,
  }))

  const [error, setError] = useState(false)
  const { supabase } = useSupabase()
  const [params] = useSearchParams()

  useEffect(() => {
    const user_id = params.get('user_id')
    const case_id = params.get('case_id')

    if (!user_id || !case_id) {
      setError(true)
    }
    if (user_id) {
      updateConversation({ id: user_id })
    }
    if (case_id && caseStudyTypes.includes(case_id as CaseType)) {
      updateConversation({ studyType: case_id as CaseType })
    }
  }, [])

  const startConversation = async (e: any) => {
    e.preventDefault()
    const nickname = e.target['nickname'].value
    updateConversation({ nickname })
    // add conversation info to db
    await supabase.from('conversation').upsert({
      conversation_id: conversation.id,
      study_type: conversation.studyType,
    })
    setPageState('Chat')
  }

  return (
    <>
      {error && (
        <div className="w-full h-full flex items-center bg-zinc-200 justify-center z-10 flex-col gap-4">
          <PageNotFound />
          <span className="sm:text-xl lg:text-6xl font-extrabold text-gray-600 p-4 rounded-md">
            Something's missing
          </span>
          <span className="text-3xl text-gray-400 font-bold">
            URL is incorrect
          </span>
        </div>
      )}
      {!error && (
        <div className="w-full h-auto flex items-center justify-center">
          <div className="bg-white py-6 px-10 md:max-w-4xl border border-gray-300 shadow-md rounded-xl z-30">
            <div className="sm:text-3xl text-2xl font-semibold text-center text-purple-500  mb-6">
              Case study
            </div>
            <div className="bg-gray-100 rounded-xl p-4 mb-6 flex flex-col gap-4">
              <p>
                <span className="font-sans font-bold text-red-500 text-lg pr-2">
                  i
                </span>
                <b>Info</b>
              </p>
              <p>
                Vorbee is a chatbot instructed to talk with you about your
                hobbies.
              </p>
              {conversation.studyType === 'INIBOT' && (
                <p>
                  In the background, Vorbee will analyze your face expression.
                </p>
              )}
              {conversation.studyType === 'SUBEMO' && (
                <>
                  <p>
                    In the background, Vorbee will analyze your face expression
                    and display its interpretation through emojis (happy, sad,
                    anger, fearful, surprised, disgusted).
                  </p>
                  <p>No emoji displayed means a neutral face.</p>
                </>
              )}
              {conversation.studyType === 'EMOCOM' && (
                <>
                  <p>
                    In the background, Vorbee will analyze your face expression
                    and display its interpretation through emojis (happy, sad,
                    anger, fearful, surprised, disgusted).
                  </p>
                  <p>
                    Throughout the conversation, Vorbee will also make comments
                    about your emotion.
                  </p>
                  <p>No emoji displayed means a neutral face.</p>
                </>
              )}
              <p className="font-semibold">
                NO video recordings or images with your face will be collected.
              </p>
            </div>
            <div className="py-4 px-4 mb-6 bg-gray-100 rounded-xl">
              <p>
                ❗<b>Before starting</b>
              </p>
              <ol className="list-decimal ml-6">
                <li className="my-1">Position your camera at eye level</li>
                <li className="my-1">
                  Position your camera 0.5 meters (1.5-2 feet) away from you to
                  provide good framing
                </li>
                <li className="my-1">
                  Make sure that your face is framed correctly
                </li>
                <li className="my-1">
                  Make sure the lighting does not affect the visibility and
                  clarity of the recording
                </li>
                <li className="my-1">
                  The camera should only capture yourselve from shoulders
                  upwards
                </li>
              </ol>
            </div>
            <form onSubmit={startConversation}>
              {FormInputs.map((input, index) => (
                <Input
                  key={index}
                  placeholder={input.placeholder}
                  type={input.type}
                  inputs={input.inputs}
                  id={input.id}
                />
              ))}
              <div className="flex justify-center my-6">
                <button
                  type="submit"
                  className=" rounded-full  p-3 w-full sm:w-56   bg-purple-500 text-white text-lg font-semibold "
                >
                  Start conversation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
