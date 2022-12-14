import {
  loadFaceExpressionModel,
  nets,
  detectAllFaces,
  TinyFaceDetectorOptions,
  draw,
  resizeResults,
  MtcnnOptions,
  SsdMobilenetv1Options,
} from 'face-api.js'
import { useEffect, useState } from 'react'
import { useGlobalStore } from '../useGlobalStore'

let isCameraOn = false

export const useFaceDetection = (
  video: React.RefObject<HTMLVideoElement>,
  canvas: React.RefObject<HTMLCanvasElement>
) => {
  const { options } = useGlobalStore(state => ({ options: state.options }))
  const [detectionOptions, setDetectionOptions] = useState<
    TinyFaceDetectorOptions | MtcnnOptions | SsdMobilenetv1Options
  >()
  // set on mount
  useEffect(() => {
    loadFaceDetectionModel()
    loadExpressionModel()
    getFaceDetectorOptions()
  }, [])

  // action functions

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
      const results = await detectAllFaces(
        video.current,
        detectionOptions
      ).withFaceExpressions()
      // .withAgeAndGender()
      console.log('All faces detected')
      if (!canvas.current) return
      console.log('Attempt to draw')
      clearCanvas()
      draw.drawDetections(
        canvas.current,
        resizeResults(results, {
          height: video.current.videoHeight,
          width: video.current.videoWidth,
        })
      )
      draw.drawFaceExpressions(
        canvas.current,
        resizeResults(results, {
          height: video.current.videoHeight,
          width: video.current.videoWidth,
        }),
        0.1
      )

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
      console.log('Attempt to detect all faces')
      console.log({ detectionOptions })
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
