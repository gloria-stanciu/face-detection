import {
  MutableRefObject,
  Ref,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { useFaceDetection } from '../hooks'
import { useGlobalStore } from '../hooks/useGlobalStore'
import { RecordedVideo } from './RecordedVideo'
import { motion } from 'framer-motion'

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: (i: number) => {
    return {
      y: 0,
      opacity: 1,
      transition: { delay: i * 2.5 },
    }
  },
}

export const Camera = ({
  startCameraRecording,
  cameraContainer,
}: // constraintsRef,
{
  startCameraRecording: boolean
  cameraContainer: any
}) => {
  //#region - Setup refs -
  const previewVideo = useRef<HTMLVideoElement>(null)
  let canvasRef = useRef<HTMLCanvasElement>(null)
  // const constraintsRef = useRef(null)
  //#endregion

  //#region - Setup states -
  const [camera, setCamera] = useState<MediaStream>()
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  // const cameraContainer = useRef(null)
  //#endregion

  useLayoutEffect(() => {
    startCamera()
  }, [])

  useEffect(() => {
    if (startCameraRecording) {
      runFaceDetection()
    }
  }, [startCameraRecording])

  //#region - Setup hooks -
  const { runFaceDetection, stopFaceDetection } = useFaceDetection(
    previewVideo,
    canvasRef
  )

  //#endregion

  const startCamera = async () => {
    try {
      if (recordedChunks.length !== 0) setRecordedChunks([])

      if (navigator.mediaDevices) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          preferCurrentTab: true,
        })

        if (previewVideo.current) {
          previewVideo.current.srcObject = stream
        }

        const recordedChunks = await startRecording(stream, 5000)
        setRecordedChunks(recordedChunks)
      }
    } catch (err) {
      console.log({ err })
    }
  }

  const startRecording = async (stream: MediaStream, delayInMS: number) => {
    let recorder = new MediaRecorder(stream)
    let data: BlobEvent['data'][] = []
    recorder.ondataavailable = event => {
      data.push(event.data)
    }
    setCamera(stream)
    recorder.start()

    const stopped = new Promise((resolve, reject) => {
      recorder.onstop = () => {
        stopCamera(stream)
        resolve(null)
      }
      recorder.onerror = event => reject(event)
    })

    // await wait(delayInMS)

    // if (recorder.state === 'recording') {
    //   recorder.stop()
    // }

    // await stopped

    return data
  }

  const stopCamera = (stream: MediaStream) => {
    stream.getTracks().forEach(track => track.stop())
  }

  // const wait = (delayInMS: number) => {
  //   return new Promise(resolve => setTimeout(resolve, delayInMS))
  // }

  return (
    <motion.div
      className="flex-col w-full rounded-xl"
      ref={cameraContainer}
      variants={item}
      custom={0.5}
      drag
      dragConstraints={cameraContainer}
    >
      <motion.div drag dragConstraints={cameraContainer}>
        <motion.div className="relative" drag dragConstraints={cameraContainer}>
          <motion.video
            ref={previewVideo}
            autoPlay={camera ? true : false}
            className="rounded-xl w-1/2"
            drag
            dragConstraints={cameraContainer}
            // onLoadedData={() => {
            //   runFaceDetection()
            // }}
          />
          <motion.canvas
            ref={canvasRef}
            className=" absolute z-10 top-0 left-0 w-[20rem]"
            drag
            dragConstraints={cameraContainer}
          />
        </motion.div>
      </motion.div>

      {/* 
      -- For seeing the recorded video --
      {recordedChunks.length !== 0 && (
        <RecordedVideo recordedChunks={recordedChunks} />
      )} */}
    </motion.div>
  )
}
