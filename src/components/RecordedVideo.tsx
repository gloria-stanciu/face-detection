import { useEffect, useState } from 'react'

type RecordedVideoProps = {
  recordedChunks: Blob[]
  className?: React.HTMLAttributes<HTMLDivElement>['className']
}

export const RecordedVideo = ({
  recordedChunks,
  className,
}: RecordedVideoProps) => {
  const [recordedVideo, setRecordedVideo] = useState<string>('')

  useEffect(() => {
    let recordedBlob = new Blob(recordedChunks, { type: 'video/webm' })
    setRecordedVideo(URL.createObjectURL(recordedBlob))
  }, [])

  return (
    <>
      <div className={className}>
        <h2>Recorded video</h2>
        <video src={recordedVideo} className="w-full aspect-video" controls />
      </div>
    </>
  )
}
