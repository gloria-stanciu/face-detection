const likertOptions: { value: number; text: string }[] = [
  { value: 1, text: 'Strongly disagree' },
  { value: 2, text: 'Disagree' },
  { value: 3, text: 'Neither agree nor disagree' },
  { value: 4, text: 'Agree' },
  { value: 5, text: 'Strongly agree' },
]

export const OpenEndedQuestion = ({
  question,
  id,
}: {
  question: string
  id: string
}) => {
  return (
    <div className="flex flex-col lg:flex-col items-start py-2 px-2 lg:py-4 lg:px-8 hover:bg-slate-50 bg-white rounded-xl border border-gray-300 shadow-md gap-2 ">
      <span className="flex-1 ml-6 lg:ml-0 lg:mr-8 self-start font-semibold">
        {question}
      </span>
      <input
        required
        type="text"
        id={`${id}`}
        name={id}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Write your thoughts here"
      />
    </div>
  )
}
