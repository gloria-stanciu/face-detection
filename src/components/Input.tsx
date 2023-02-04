export interface InputTypes {
  type: React.HTMLInputTypeAttribute | undefined
  placeholder?: string
  className?: string
  inputs?: string[]
  id: string
}

export const Input = ({
  type,
  placeholder,
  className,
  inputs,
  id,
}: InputTypes) => {
  const isType = (smth: React.HTMLInputTypeAttribute) => {
    return type === smth
  }

  if (isType('checkbox'))
    return (
      <div className="flex items-center justify-start pb-2 mb-8">
        <input
          required
          id={id}
          type={type}
          className={`focus:outline-none border-b w-fit placeholder-gray-500 ${className}`}
          placeholder={placeholder}
        />
        <label htmlFor={id} className="px-3 text-gray-500 ">
          {placeholder}
        </label>
      </div>
    )

  if (isType('radio'))
    return (
      <>
        <div className="flex flex-col items-start justify-start pb-2 mb-8">
          <div className="text-gray-500 ">{placeholder}</div>
          <div className="flex flex-row ">
            {inputs?.map((val, index) => (
              <div key={index} className="flex flex-row items-center pr-4">
                <label
                  htmlFor={`${id}-${index}`}
                  className="pr-2 text-gray-500 "
                >
                  {val}
                </label>
                <input
                  required
                  type={type}
                  id={`${id}-${index}`}
                  name={id}
                  value={val}
                  className={`focus:outline-none border-b w-fit placeholder-gray-500 ${className}`}
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>
        </div>
      </>
    )

  return (
    <input
      required
      type={type}
      className={`focus:outline-none border-b w-full pb-2 placeholder-gray-500 mb-8 ${className}`}
      placeholder={placeholder}
      id={id}
    />
  )
}
