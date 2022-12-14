import { useEffect, useRef, useState } from 'react'
import { useFaceDetection } from '../hooks'
import { RecordedVideo } from './RecordedVideo'

export const Camera = () => {
  //#region - Setup refs -
  const previewVideo = useRef<HTMLVideoElement>(null)
  let canvasRef = useRef<HTMLCanvasElement>(null)
  //#endregion

  //#region - Setup states -
  const [camera, setCamera] = useState<MediaStream>()
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  //#endregion

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

  const wait = (delayInMS: number) => {
    return new Promise(resolve => setTimeout(resolve, delayInMS))
  }

  return (
    <div className=" flex flex-col space-y-8 w-full">
      <div>
        <div className="flex flex-row justify-around">
          <button onClick={startCamera}>Start camera</button>
          <button
            onClick={() => {
              camera ? stopCamera(camera) : null
              setRecordedChunks([])
              stopFaceDetection()
            }}
          >
            Stop camera
          </button>
        </div>

        <h2>Preview recording</h2>
        <div className="relative ">
          <video
            ref={previewVideo}
            autoPlay={camera ? true : false}
            onLoadedData={() => {
              runFaceDetection()
            }}
          />
          <canvas ref={canvasRef} className="absolute z-10 top-0 left-0" />
        </div>
      </div>

      {/* 
      -- For seeing the recorded video --
      {recordedChunks.length !== 0 && (
        <RecordedVideo recordedChunks={recordedChunks} />
      )} */}
    </div>
  )
}
