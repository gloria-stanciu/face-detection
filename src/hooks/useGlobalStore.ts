import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { DetectionModel, FacesToDetect, Models, SentimentType } from '../types'

interface Message {
  participant: boolean
  timestamp: number
  content: string
  sentiment: string
}

interface GlobalStore {
  conversation: {
    id: string
    nickname: string
    messages: Message[]
    age: number | null
    gender: 'male' | 'female' | null
    studyType: null | 'INIBOT' | 'SUBEMO' | 'EMOCOM'
    sentiment: SentimentType
  }
  options: {
    numberOfFaces: FacesToDetect
    faceDetectionModel: DetectionModel
    faceDetectionOptions: Models[DetectionModel]
    withFaceExpression: boolean
    withAgeAndGender: boolean
  }
  updateOptions: (optionToUpdate: Partial<GlobalStore['options']>) => void
  resetDetectionOptions: () => void
  updateConversation: (
    valuestoUpdate: Partial<GlobalStore['conversation']>
  ) => void
  addMessage: (obj: Message) => void
}

const initializeDetectionOptions: GlobalStore['options'] = {
  numberOfFaces: 'All',
  faceDetectionModel: 'TINY_FACE_DETECTOR',
  faceDetectionOptions: {
    inputSize: 128,
    scoreThreshold: 0.5,
  },
  withFaceExpression: true,
  withAgeAndGender: true,
}

export const useGlobalStore = create(
  persist(
    immer<GlobalStore>(set => ({
      conversation: {
        id: '',
        nickname: '',
        messages: [],
        age: null,
        gender: null,
        studyType: null,
        sentiment: 'neutral',
      },
      options: initializeDetectionOptions,

      updateOptions: optionToUpdate =>
        set(state => ({
          options: {
            ...state.options,
            ...optionToUpdate,
          },
        })),
      resetDetectionOptions: () => {
        set(state => (state.options = initializeDetectionOptions))
      },
      updateConversation: valuesToUpdate => {
        set(state => ({
          conversation: {
            ...state.conversation,
            ...valuesToUpdate,
          },
        }))
      },
      addMessage: (obj: Message) => {
        set(state => {
          state.conversation.messages.push(obj)
        })
      },
    })),
    {
      name: 'vorbee', // unique name
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
)
