import { ReceivedMessage } from './ReceivedMessage'
import { SentMessage } from './SentMessage'

import Smile from '../assets/emotions/smile.svg'
import PaperAirplane from '../assets/paper-airplane.svg'
import BotAvatar from '../assets/bot-avatar.svg'

import { useGlobalStore } from '../hooks/useGlobalStore'
import { fetchResponse } from '../hooks/api-calls'

import '../styles/Chat.css'

export const Chat = () => {
  const { conversation, addMessage } = useGlobalStore(state => ({
    conversation: state.conversation,
    addMessage: state.addMessage,
  }))
  const el = document.getElementById('messages')
  if (el) {
    el.scrollTop = el.scrollHeight
  }

  const sendMessage = (e: any) => {
    e.preventDefault()
    addMessage({
      content: e.target['message-to-send'].value,
      participant: true,
      sentiment: '',
      timestamp: Date.now(),
    })
    e.target.reset()

    fetchResponse()
  }

  return (
    <div className="flex-1 justify-between flex flex-col bg-white rounded-xl border border-gray-300 shadow-md">
      <div className="flex sm:items-center justify-between p-4 border-b-2 border-gray-200 ">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <span className="absolute text-green-500 right-0 bottom-0">
              <svg width="20" height="20">
                <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
              </svg>
            </span>
            <span className="w-10 h-10">
              <BotAvatar />
            </span>
          </div>
          <div className="flex flex-col leading-tight">
            <div className="text-2xl mt-1 flex items-center">
              <span className="text-gray-700 mr-3">Chatbot name</span>
            </div>
            <span className="text-lg text-gray-600">Driven by OpenAI</span>
          </div>
        </div>
      </div>
      <div
        id="messages"
        className="flex flex-col flex-1 space-y-4 p-4 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch "
      >
        {conversation.messages.map((message, index) =>
          message.participant ? (
            <SentMessage message={message.content} key={index} />
          ) : (
            <ReceivedMessage message={message.content} key={index} />
          )
        )}
      </div>
      <div className="border-t-2 border-gray-200 p-4 mb-2 sm:mb-0">
        <form className="relative flex" onSubmit={sendMessage}>
          <input
            id="message-to-send"
            type="text"
            placeholder="Write your message!"
            className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
          />
          <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
            <span className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 focus:outline-none">
              <Smile />
            </span>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-purple-500 hover:bg-purple-400 focus:outline-none"
            >
              <span className="font-bold">Send</span>
              <PaperAirplane />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
