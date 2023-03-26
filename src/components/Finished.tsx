import Done from '../assets/Done.svg'

export const Finished = () => {
  return (
    <div className="w-full h-full flex items-center justify-center z-10 flex-col gap-4">
      <Done />
      <span className="text-3xl text-gray-400 font-bold">All done!</span>
      <span className="sm:text-xl lg:text-6xl font-extrabold text-gray-600 p-4 rounded-md">
        Thank you for participanting in the study!
      </span>
    </div>
  )
}
