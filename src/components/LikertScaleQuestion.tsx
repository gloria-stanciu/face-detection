const likertOptions: { value: number; text: string }[] = [
  { value: 1, text: 'Strongly disagree' },
  { value: 2, text: 'Disagree' },
  { value: 3, text: 'Neither agree nor disagree' },
  { value: 4, text: 'Agree' },
  { value: 5, text: 'Strongly agree' },
]

export const LikertScaleQuestion = ({
  question,
  id,
}: {
  question: string
  id: string
}) => {
  return (
    <div className="flex flex-col lg:flex-row items-center lg:justify-between py-2 px-2 lg:py-4 lg:px-8 hover:bg-slate-50 bg-white rounded-xl border border-gray-300 shadow-md ">
      <span className="flex-1 ml-6 lg:ml-0 lg:mr-8 self-start lg:self-center font-semibold">
        {question}
      </span>
      <div className="flex justify-around w-full lg:justify-end lg:w-fit">
        {likertOptions.map((option, index) => (
          <div key={index} className="flex flex-col items-center pr-4">
            <label
              htmlFor={`${id}-${index}`}
              className="pb-2 text-gray-500 text-sm md:text-base text-center "
            >
              {option.text}
            </label>
            <input
              required
              type="radio"
              id={`${id}-${index}`}
              name={id}
              value={option.text}
              className={`focus:outline-none border-b w-fit placeholder-gray-500 accent-purple-500`}
              placeholder={option.text}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
