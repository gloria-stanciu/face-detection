import {
  loadFaceExpressionModel,
  loadFaceLandmarkModel,
  nets,
  TinyFaceDetectorOptions,
  draw,
  resizeResults,
  MtcnnOptions,
  SsdMobilenetv1Options,
  loadAgeGenderModel,
  utils,
  detectSingleFace,
  matchDimensions,
} from 'face-api.js'
import { useEffect, useRef, useState } from 'react'
import { Prediction, Sentiments, SentimentType } from '../types'
import { useGlobalStore } from './useGlobalStore'
import { useSupabase } from './index'
import throttle from 'lodash.throttle'

const threshold: Sentiments = {
  angry: 0.4,
  disgusted: 0.5,
  fearful: 0.5,
  happy: 0.95,
  neutral: 0.95,
  sad: 0,
  surprised: 0.8,
} as const

let isCameraOn = false
//@ts-ignore
let predictedAges = []
let predictions: Prediction[] = []

export const useFaceDetection = (
  video: React.RefObject<HTMLVideoElement>,
  canvas: React.RefObject<HTMLCanvasElement>
) => {
  const { supabase } = useSupabase()
  const options = useGlobalStore(state => state.options)
  const [detectionOptions, setDetectionOptions] = useState<
    TinyFaceDetectorOptions | MtcnnOptions | SsdMobilenetv1Options
  >()
  // set on mount
  useEffect(() => {
    loadLandmarkModel()
    loadFaceDetectionModel()
    loadAgeAndGenderModel()
    loadExpressionModel()
    getFaceDetectorOptions()
  }, [])

  // action functions

  const loadLandmarkModel = async () => {
    try {
      console.log('Load landmark model.')
      await loadFaceLandmarkModel('/weights')
    } catch (error) {
      console.log(error)
    }
  }

  const loadFaceDetectionModel = () => {
    console.log('Load face detection model.')
    switch (options.faceDetectionModel) {
      case 'TINY_FACE_DETECTOR': {
        nets.tinyFaceDetector.load('/weights')
        break
      }
      case 'SSD Mobilenet V1': {
        nets.ssdMobilenetv1.load('/weigths')
        break
      }
      case 'MTCNN': {
        nets.mtcnn.load('/weights')
        break
      }
    }
  }

  const loadExpressionModel = async () => {
    try {
      console.log('Load face expression model.')
      await loadFaceExpressionModel('/weights')
    } catch (error) {
      console.log(error)
    }
  }

  const loadAgeAndGenderModel = async () => {
    try {
      console.log('Load age and gender model.')
      await loadAgeGenderModel('/weights')
    } catch (error) {
      console.log(error)
    }
  }

  const getFaceDetectorOptions = () => {
    console.log(`Set options for ${options.faceDetectionModel}`)
    switch (options.faceDetectionModel) {
      case 'TINY_FACE_DETECTOR': {
        setDetectionOptions(
          new TinyFaceDetectorOptions({
            inputSize: 224,
            scoreThreshold: 0.1,
          })
        )
        break
      }
      case 'MTCNN': {
        setDetectionOptions(
          new MtcnnOptions({
            scaleFactor: 0.709,
            minFaceSize: 20,
          })
        )
        break
      }
      case 'SSD Mobilenet V1': {
        setDetectionOptions(new SsdMobilenetv1Options({ minConfidence: 0.5 }))
        break
      }
    }
  }

  const clearCanvas = () => {
    if (canvas.current) {
      canvas.current
        .getContext('2d')
        ?.clearRect(0, 0, canvas.current.width, canvas.current.height)
    }
  }

  const interpolateAgePredictions = (age: any) => {
    //@ts-ignore
    predictedAges = [age].concat(predictedAges).slice(0, 30)
    const avgPredictedAge =
      predictedAges.reduce((total, a) => total + a) / predictedAges.length
    return avgPredictedAge
  }

  const storePredominantSentiment = (sentiments: Sentiments) => {
    const sentimentsValue = Object.entries(sentiments).map(
      ([sentiment, value]) => {
        return {
          sentiment,
          value: value - threshold[sentiment as keyof typeof threshold],
        }
      }
    )
    sentimentsValue.sort((a, b) => b.value - a.value)
    console.log(sentimentsValue)

    if (
      useGlobalStore.getState().conversation.sentiment !==
      sentimentsValue[0].sentiment
    ) {
      useGlobalStore.getState().updateConversation({
        sentiment: sentimentsValue[0].sentiment as SentimentType,
      })
    }
  }

  const storePredictionsToDB = throttle(async () => {
    if (predictions.length !== 0) {
      await supabase.from('recording').insert(predictions)
    }

    predictions = []
  }, 1000)

  const storePredictionLocally = (newPrediction: Prediction) => {
    predictions.push(newPrediction)
    storePredictionsToDB()
  }

  let animationFrame: number

  const detect = async (
    detectionOptions:
      | TinyFaceDetectorOptions
      | MtcnnOptions
      | SsdMobilenetv1Options
      | undefined
  ) => {
    try {
      if (animationFrame) cancelAnimationFrame(animationFrame)

      if (!video.current) return

      const detection = detectSingleFace(video.current, detectionOptions)
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender()

      const results = await detection

      // console.log('All faces detected')

      if (!canvas.current) return

      if (results) {
        const resizedResults = resizeResults(
          results,
          matchDimensions(canvas.current, video.current, true)
        )
        // console.log('Attempt to draw')
        clearCanvas()

        if (options.withAgeAndGender) {
          const { age, gender, genderProbability } = resizedResults

          // interpolate gender predictions over last 30 frames
          // to make the displayed age more stable
          const interpolatedAge = interpolateAgePredictions(age)

          if (!video.current.hidden) {
            draw.drawDetections(canvas.current, resizedResults)

            if (options.withFaceExpression) {
              draw.drawFaceExpressions(canvas.current, resizedResults, 0.1)
            }

            new draw.DrawTextField(
              [
                `${utils.round(interpolatedAge, 0)} years`,
                `${gender} (${utils.round(genderProbability)})`,
              ],
              resizedResults.detection.box.bottomRight
            ).draw(canvas.current)
          }
          const conversation_id = useGlobalStore.getState().conversation.id
          if (conversation_id) {
            storePredictionLocally({
              conversation_id,
              age: Number(age.toFixed(0)),
              gender,
              gender_probability: resizedResults.genderProbability,
              angry: resizedResults.expressions.angry,
              disgusted: resizedResults.expressions.disgusted,
              fearful: resizedResults.expressions.fearful,
              happy: resizedResults.expressions.happy,
              neutral: resizedResults.expressions.neutral,
              sad: resizedResults.expressions.sad,
              surprised: resizedResults.expressions.surprised,
            })
            storePredominantSentiment({
              angry: resizedResults.expressions.angry,
              disgusted: resizedResults.expressions.disgusted,
              fearful: resizedResults.expressions.fearful,
              happy: resizedResults.expressions.happy,
              neutral: resizedResults.expressions.neutral,
              sad: resizedResults.expressions.sad,
              surprised: resizedResults.expressions.surprised,
            })
          }
        }
      } else {
        clearCanvas()
      }

      if (isCameraOn) {
        animationFrame = requestAnimationFrame(
          async () => await detect(detectionOptions)
        )
      } else {
        if (canvas.current) {
          clearCanvas()
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  //primary functions
  const runFaceDetection = async () => {
    try {
      isCameraOn = true
      if (canvas.current && video.current) {
        canvas.current.width = video.current.videoWidth
        canvas.current.height = video.current.videoHeight
      }
      // await loadExpressionModel()
      // const detectionOptions = getFaceDetectorOptions()
      // console.log('Attempt to detect all faces')
      await detect(detectionOptions)
    } catch (error) {
      console.log(error)
    }
  }

  const stopFaceDetection = async () => {
    if (!isCameraOn) return
    isCameraOn = false
    console.log('Face detection stopped.')
  }
  return { runFaceDetection, stopFaceDetection }
}
