import UserIcon from '../assets/message-icons/user.svg'

export const SentMessage = ({ message }: { message: string }) => {
  return (
    <div className="chat-message">
      <div className="flex items-end justify-end">
        <div className="flex flex-col space-y-2 text-xs md:text-sm max-w-xs mx-2 order-1 items-end">
          <div>
            <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-purple-500 text-white ">
              {message}
            </span>
          </div>
        </div>
        <UserIcon />
      </div>
    </div>
  )
}
