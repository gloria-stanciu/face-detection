export type FacesToDetect = 'All' | 'One'
export type InputSize = 128 | 256
export type DetectionModel = keyof Models

export interface Models {
  TINY_FACE_DETECTOR: {
    inputSize: InputSize
    scoreThreshold: number
  }
  'SSD Mobilenet V1': {
    minConfidence: number
  }
  MTCNN: {
    scaleFactor: number
    minFaceSize: number
  }
}

export interface Prediction {
  id?: number
  conversation_id?: string
  timestamp?: string
  age: number
  gender: string
  gender_probability: number
  angry: number
  disgusted: number
  fearful: number
  happy: number
  neutral: number
  sad: number
  surprised: number
}
