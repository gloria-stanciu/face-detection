import { ReceivedMessage } from './ReceivedMessage'
import { SentMessage } from './SentMessage'

import Smile from '../assets/emotions/smile.svg'
import Angry from '../assets/emotions/angry.svg'
import Disgusted from '../assets/emotions/disgusted.svg'
import Fearful from '../assets/emotions/fearful.svg'
import Neutral from '../assets/emotions/neutral.svg'
import Sad from '../assets/emotions/sad.svg'
import Surprised from '../assets/emotions/surprised.svg'
import Logo from '../assets/logo.svg'

import PaperAirplane from '../assets/paper-airplane.svg'
import BotAvatar from '../assets/bot-avatar.svg'

import { useGlobalStore } from '../hooks/useGlobalStore'
import {
  fetchResponse,
  // fetchSentiment,
  greetUser,
  requestCommentAboutSentiment,
} from '../hooks/api-calls'

import '../styles/Chat.css'
import { useSupabase } from '../hooks'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { debounce } from 'lodash'
import { TypingDots } from './TypingDots'
import { SentimentType } from '../types'

export const Chat = ({
  setPageState,
}: {
  setPageState: Dispatch<SetStateAction<string>>
}) => {
  const { conversation, addMessage } = useGlobalStore(state => ({
    conversation: state.conversation,
    addMessage: state.addMessage,
  }))

  const { supabase } = useSupabase()
  const [isTyping, setIsTyping] = useState(false)
  const [showLinkToForm, setShowLinkToForm] = useState(false)
  const [emojiToShow, setEmojiToShow] = useState(null)
  const [sentimentMessage, setSentimentMessage] = useState(false)
  const pastEmotion = useRef<SentimentType | null>('neutral')
  const pastShownEmoji = useRef<SentimentType | null>(null)
  const timePassed = useRef(Date.now())

  useEffect(() => {
    setIsTyping(true)
    greetUser(conversation.nickname)
    setIsTyping(false)
    setTimeout(() => {
      setShowLinkToForm(true)
      addMessage({
        content:
          'Thank you, you may continue chatting with me. Whenever you are ready, use the link that just appeared in the header of the chatbot to complete the questionnaire, conclude the session and the study.',
        participant: false,
        sentiment: '',
        timestamp: Date.now(),
      })
    }, 2 * 60 * 1000)

    // setTimeout(() => {
    //   setSentimentMessage(true)
    //   fetchSentimentComment(conversation.sentiment, conversation.nickname)
    // }, 20 * 1000)
    // setSentimentMessage(true)
  }, [])

  useEffect(() => {
    const el = document.getElementById('messages')
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [conversation.messages, isTyping])

  useEffect(() => {
    if (!isTyping) {
      if (emojiToShow !== pastShownEmoji.current) {
        console.log({
          pastShownEmoji: pastShownEmoji.current,
          emojiToShow,
        })
        debounceSentimentComment(conversation.sentiment, conversation.nickname)
      }
    }
  }, [isTyping])

  const fetchSentimentComment = async (
    sentiment: SentimentType,
    name: string
  ) => {
    setIsTyping(true)
    if (sentiment !== 'neutral') {
      timePassed.current = Date.now()
    }
    await requestCommentAboutSentiment(sentiment, name)
    setIsTyping(false)
  }

  const debounceSentimentComment = useRef(
    debounce(async (sentiment, nickname) => {
      await fetchSentimentComment(sentiment, nickname)
    }, 1000)
  ).current

  const debounceSentimentUpdate = useRef(
    debounce(sentiment => {
      pastEmotion.current = pastShownEmoji.current
      pastShownEmoji.current = sentiment
      setEmojiToShow(sentiment)
    }, 300)
  ).current

  useEffect(() => {
    debounceSentimentUpdate(conversation.sentiment)
    if (
      conversation.studyType === 'EMOCOM' &&
      // !conversation.messages[conversation.messages?.length - 1]?.participant &&
      !isTyping &&
      Date.now() - timePassed.current > 15 * 1000
      // !conversation.messages.slice(-2).every(value => !value.participant) &&
      // sentimentMessage
    ) {
      debounceSentimentComment(conversation.sentiment, conversation.nickname)
    }
  }, [conversation.sentiment])

  const sendMessage = async (e: any) => {
    const message = e.target['message-to-send'].value
    e.preventDefault()
    e.target.reset()

    setIsTyping(true)
    // add mesage to global store
    addMessage({
      content: message,
      participant: true,
      sentiment: '',
      timestamp: Date.now(),
    })

    // fetch sentiment of message
    // const sentiment = await fetchSentiment(message)

    // add message to db
    await supabase.from('message').insert({
      content: message,
      conversation_id: conversation.id,
      participant: true,
      // sentiment,
    })

    await fetchResponse()
    setIsTyping(false)
  }

  return (
    <div className="flex-1 justify-between flex flex-col bg-white rounded-xl border border-gray-300 shadow-md ">
      <div className="flex sm:items-center justify-between p-4 border-b-2 border-gray-200 ">
        <div className="relative flex items-center space-x-4 w-full">
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
              <span className="text-gray-700 mr-3">
                <Logo />
              </span>
            </div>
            <span className="text-lg text-gray-600">Driven by OpenAI</span>
          </div>
          {showLinkToForm && (
            <div className="flex justify-end flex-1">
              <a
                className="hover:bg-purple-500 hover:text-white py-2 px-4 rounded-md text-purple-500"
                href={`https://docs.google.com/forms/d/e/1FAIpQLSdMEwJU7dI-2NhL5lb0mg0RyyGoJ_1ukr_VpMS8vanU2eYRXQ/viewform?usp=pp_url&entry.417764107=${conversation.id}`}
              >
                Go to <span className="font-bold">Questionnaire</span>
              </a>
            </div>
          )}
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
        {isTyping && <TypingDots key="typing dots" />}
      </div>
      <div className="border-t-2 border-gray-200 p-4 mb-2 sm:mb-0">
        <form
          className="relative flex items-center gap-2"
          onSubmit={sendMessage}
        >
          <input
            id="message-to-send"
            type="text"
            placeholder="Write your message!"
            className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-purple-500 hover:bg-purple-400 focus:outline-none"
          >
            <span className="font-bold">Send</span>
            <PaperAirplane />
          </button>
          {conversation.studyType !== 'INIBOT' && (
            <div className="flex flex-col justify-center items-center px-2 ">
              <span className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 focus:outline-none">
                {emojiToShow === 'happy' && <Smile />}
                {emojiToShow === 'sad' && <Sad />}
                {emojiToShow === 'angry' && <Angry />}
                {emojiToShow === 'fearful' && <Fearful />}
                {emojiToShow === 'disgusted' && <Disgusted />}
                {/* {conversation.sentiment === 'neutral' && <Neutral />} */}
                {emojiToShow === 'surprised' && <Surprised />}
              </span>
              <span className="text-xs">Emotion</span>
            </div>
          )}
          {/* </div> */}
        </form>
      </div>
    </div>
  )
}
