import { Dispatch, SetStateAction } from 'react'
import { Input, InputTypes } from './Input'

const FormInputs: InputTypes[] = [
  {
    type: 'text',
    placeholder: 'Name',
    id: 'name',
  },
  {
    type: 'number',
    placeholder: 'Age',
    id: 'age',
  },
  {
    type: 'radio',
    placeholder: 'Gender',
    inputs: ['Male', 'Female'],
    id: 'gender',
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
  const startConversation = async () => {
    setPageState('Chat')
  }

  return (
    <div className="w-full h-auto flex items-center justify-center">
      <div className="bg-white py-6 px-10 sm:max-w-md w-full border border-gray-300 shadow-md rounded-xl z-30">
        <div className="sm:text-3xl text-2xl font-semibold text-center text-purple-500  mb-6">
          Case study
        </div>
        <p className="py-4 px-4 mb-6 text-gray-700 bg-gray-100 rounded-xl">
          ❗<br /> Before starting, please make sure the lighting does not
          affect the visibility and that your face is seen by the camera.
        </p>
        <div>
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
              onClick={startConversation}
              className=" rounded-full  p-3 w-full sm:w-56   bg-purple-500 text-white text-lg font-semibold "
            >
              Start conversation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
