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

export type SentimentType =
  | 'happy'
  | 'sad'
  | 'angry'
  | 'disgusted'
  | 'fearful'
  | 'neutral'
  | 'surprised'

export interface Sentiments {
  disgusted: number
  fearful: number
  happy: number
  neutral: number
  sad: number
  surprised: number
  angry: number
}

export interface Prediction {
  id?: number
  conversation_id: string
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

export interface OpenAIChoice {
  text: string
  index: number
  logprobs: null | string
  finish_reason: string
}

export interface OpenAIResponse {
  id: string
  object: string
  created: number
  model: string
  choices: OpenAIChoice[]
  usage: {
    prompt_token: number
    completion_token: number
    total_tokens: number
  }
}
