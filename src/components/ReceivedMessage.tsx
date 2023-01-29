import BotIcon from '../assets/message-icons/bot.svg'

export const ReceivedMessage = ({ message }: { message: string }) => {
  return (
    <div className="chat-message">
      <div className="flex items-end">
        <div className="flex flex-col space-y-2 text-xs md:text-sm max-w-xs mx-2 order-2 items-start ">
          <div>
            <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
              {message}
            </span>
          </div>
        </div>

        <BotIcon />
      </div>
    </div>
  )
}
