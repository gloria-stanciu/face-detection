import create from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { DetectionModel, FacesToDetect, Models } from '../types'

interface GlobalStore {
  user: {
    conversation_id: string
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
  setConversationId: (conversationId: string) => void
}

const initializeUser: GlobalStore['user'] = {
  conversation_id: '',
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
  immer<GlobalStore>(set => ({
    user: initializeUser,
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
    setConversationId: conversationId => {
      set(state => (state.user.conversation_id = conversationId))
    },
  }))
)
