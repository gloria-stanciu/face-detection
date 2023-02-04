import { OpenAIResponse } from '../types'
import { useGlobalStore } from './useGlobalStore'
import { useSupabase } from '../hooks'

const convertToPrompMessages = () => {
  const messages = useGlobalStore.getState().conversation.messages

  return messages.reduce((promptString, message) => {
    const messageToConcat = message.participant
      ? `\nHuman: ${message.content}`
      : `\nAI: ${message.content}`
    return `${promptString} \n ${messageToConcat}`
  }, '')
}

export const fetchResponse = async () => {
  const { supabase } = useSupabase()
  const messagesToAdd = convertToPrompMessages()

  const res = await fetch(
    'https://bibmytmkipilvlznixwo.functions.supabase.co/create-completion-open-ai',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        name: 'Functions',
        prompt: `The AI is friendly with the Human and tries to be cool. ${messagesToAdd} \n`,
        temperature: 0.5,
        max_tokens: 60,
        top_p: 1.0,
        frequency_penalty: 0.5,
        presence_penalty: 0.0,
        stop: '\n',
      }),
    }
  )
  const response: OpenAIResponse = await res.json()
  console.log({ response })

  useGlobalStore.getState().addMessage({
    content: response.choices[0].text,
    participant: false,
    sentiment: '',
    timestamp: Date.now(),
  })

  await supabase.from('message').insert({
    content: response.choices[0].text,
    participant: false,
  })
}

export const fetchSentiment = async (message: string) => {
  const res = await fetch(
    'https://bibmytmkipilvlznixwo.functions.supabase.co/create-completion-open-ai',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        name: 'Functions',
        prompt: `Decide whether a message's sentiment is happy, sad, amused, angry or neutral,. \n Message: ${message} \n`,
        temperature: 0,
        max_tokens: 60,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0,
        stop: '\n',
      }),
    }
  )

  const response: OpenAIResponse = await res.json()
  return response.choices[0].text.replace('\n', '')
}
