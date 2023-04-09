import { OpenAIResponse, SentimentType } from '../types'
import { Message, useGlobalStore } from './useGlobalStore'
import { useSupabase } from '../hooks'
import GPT3Tokenizer from 'gpt3-tokenizer'

const convertToPrompMessages = (numberOfMessages: number | null = null) => {
  let messages = [] as Message[]
  if (numberOfMessages) {
    messages = useGlobalStore
      .getState()
      .conversation.messages.slice(numberOfMessages)
  } else {
    messages = useGlobalStore.getState().conversation.messages
  }
  return messages.reduce((promptString, message) => {
    const messageToConcat = message.participant
      ? `\nHuman: ${message.content}`
      : `\nAI: ${message.content}`
    return `${promptString} \n ${messageToConcat}`
  }, '')
}

export const requestCommentAboutSentiment = async (
  sentiment: SentimentType,
  name: string
) => {
  const { supabase } = useSupabase()

  if (sentiment === 'neutral') return

  let prompt
  switch (sentiment) {
    case 'angry':
      prompt = `${name} is angry. Send a message to calm ${name} down!`
      break
    case 'disgusted':
      prompt = `${name} is disgusted. Send a message to make ${name} feel better!`
      break
    case 'fearful':
      prompt = `${name} is afraid. Send a message to comfort ${name}!`
      break
    case 'happy':
      prompt = `Make a comment to ${name} about noticing that ${name} is ${sentiment}!`
      break
    case 'sad':
      prompt = `${name} is sad. Send a message to cheer ${name} up!`
      break
    case 'surprised':
      prompt = `${name} is surprised. Explain the topic ${name}!`
      break
    default:
      break
  }

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
        prompt: prompt,
        temperature: 0.5,
        max_tokens: 60,
        top_p: 1.0,
        frequency_penalty: 0.5,
        presence_penalty: 0.0,
        stop: 'You: ',
      }),
    }
  )
  const response: OpenAIResponse = await res.json()

  useGlobalStore.getState().addMessage({
    content: response.choices[0].text,
    participant: false,
    sentiment: '',
    timestamp: Date.now(),
  })

  await supabase.from('message').insert({
    content: response.choices[0].text,
    conversation_id: useGlobalStore.getState().conversation.id,
    participant: false,
  })
}

export const fetchResponse = async () => {
  const tokenizer = new GPT3Tokenizer({ type: 'gpt3' }) // or 'codex'

  const { supabase } = useSupabase()

  let messagesToAdd = convertToPrompMessages()
  let prompt = `Vorbee is a virtual assistant that asks questions about hobbies. ${messagesToAdd} \n You: `

  const encodedPrompt = tokenizer.encode(prompt)

  if (encodedPrompt.bpe.length + 151 > 4097) {
    messagesToAdd = convertToPrompMessages(-20)
    prompt = `Vorbee is a virtual assistant that asks questions about hobbies. ${messagesToAdd} \n You: `
  }

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
        prompt: prompt,
        temperature: 0.5,
        max_tokens: 60,
        top_p: 1.0,
        frequency_penalty: 0.5,
        presence_penalty: 0.0,
        stop: 'You: ',
      }),
    }
  )
  const response: OpenAIResponse = await res.json()

  useGlobalStore.getState().addMessage({
    content: response.choices[0].text,
    participant: false,
    sentiment: '',
    timestamp: Date.now(),
  })

  await supabase.from('message').insert({
    content: response.choices[0].text,
    conversation_id: useGlobalStore.getState().conversation.id,
    participant: false,
  })
}

export const fetchSentiment = async (message: string) => {
  try {
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
  } catch (err) {
    console.log(err)
  }
}
