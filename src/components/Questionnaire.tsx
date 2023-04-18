import { Dispatch, SetStateAction, useRef, useState } from 'react'
import { useSupabase } from '../hooks'
import { useGlobalStore } from '../hooks/useGlobalStore'
import { LikertScaleQuestion } from './LikertScaleQuestion'
import { OpenEndedQuestion } from './OpenEndedQuestion'

const engagementStatements: { message: string; id: string }[] = [
  {
    message: 'I lost myself in this experience.',
    id: 'focused-attention-1',
  },
  {
    message:
      'The time I spent communicating with the virtual agent just slipped away.',
    id: 'focused-attention-2',
  },
  {
    message: 'I was absorbed in this conversation with the virtual agent.',
    id: 'focused-attention-3',
  },
  {
    message: 'I felt frustrated while talking with the virtual agent.',
    id: 'perceived-usability-1',
  },
  {
    message: 'I found the conversation with the virtual agent confusing.',
    id: 'perceived-usability-2',
  },
  {
    message:
      'Having this conversation with the virtual agent was taxing (demanding).',
    id: 'perceived-usability-3',
  },
  {
    message: 'The conversation with the virtual agent was worthwhile.',
    id: 'endurability-1',
  },
  {
    message: 'The overall conversation was rewarding.',
    id: 'endurability-2',
  },
  {
    message:
      'I felt interested in having this conversation with the virtual agent.',
    id: 'endurability-3',
  },
  {
    message: 'I felt engaged in the conversation at all times.',
    id: 'felt-involvement-1',
  },
  {
    message: 'The conversation with the virtual agent was human-like.',
    id: 'felt-involvement-2',
  },
  {
    message: 'The actual conversation with the virtual agent was entertaining.',
    id: 'felt-involvement-3',
  },
  {
    message:
      'During the conversation I felt comfortable sharing personal information.',
    id: 'trust-1',
  },
  {
    message: 'During the conversation, I felt that I could be open.',
    id: 'trust-2',
  },
  {
    message: 'The virtual agent was trustworthy.',
    id: 'trust-3',
  },
  {
    message: 'The virtual agent was understanding.',
    id: 'trust-4',
  },
  {
    message: 'The virtual agent had good intentions.',
    id: 'trust-5',
  },
  {
    message:
      'During the conversation I was able to respond to the reactions of the virtual agent.',
    id: 'social-presence-1',
  },
  {
    message:
      'During the conversation, I felt that I was having a conversation with a social being.',
    id: 'social-presence-2',
  },
  {
    message:
      'During the conversation, the virtual agent reacted to my emotions.',
    id: 'social-presence-3',
  },
  {
    message: 'During the conversation I felt anonymous',
    id: 'anonimity-1',
  },
  {
    message:
      'During the conversation I felt like I could share more about myself because my conversation partner did not know me',
    id: 'anonimity-2',
  },
]

const describingTerms: string[] = [
  'Calm',
  'Clear',
  'Uninterested',
  'Formal',
  'Confident',
  'Kind',
  'Repetitive',
  'Annoying',
  'Chatty',
  'Humane',
  'Serious',
  'Boring',
  'Friendly',
  'Attentive',
  'Cold',
  'Inhumane',
  'Honest',
  'Interested',
  'Inattentive',
  'Limited',
  'Direct',
  'Likeable',
  'Disconnected',
  'Monotone',
  'Informative',
  'Sociable',
  'Superficial',
  'General',
  'Useful',
  'Optimistic',
  'Emotional',
  'Entertaining',
  'Respectful',
  'Positive',
  'Empathetic',
  'Compassionate',
  'Happy',
  'Interactive',
  'Trustworthy',
  'Joyful',
]

const openEndedQuestions: { text: string; id: string }[] = [
  {
    text: `How does a chatbot's ability to detect your emotions affect the conversations you have with it?`,
    id: 'open-ended-question-1',
  },
  {
    text: `How does a chatbot's ability to detect your emotions affect your perception of the bot?`,
    id: 'open-ended-question-2',
  },
  {
    text: ` How does a chatbot's ability to detect your emotions affect the topics you are willing to discuss with it?`,
    id: 'open-ended-question-3',
  },
]

export const Questionnaire = ({
  setPageState,
}: {
  setPageState: Dispatch<SetStateAction<string>>
}) => {
  const { supabase } = useSupabase()
  const { conversation } = useGlobalStore(state => ({
    conversation: state.conversation,
  }))
  const [countTerms, setCountTerms] = useState<string[]>([])
  let formAnswers: Record<string, string | string[]> = {}
  const submitQuestionnaire = async (e: any) => {
    e.preventDefault()
    const formId = document.getElementById('questionnaire') as HTMLFormElement
    const form = new FormData(formId)
    engagementStatements.forEach(statement => {
      formAnswers[statement.id] = form.get(statement.id) as string | string[]
    })

    formAnswers['describingTerms'] = form.getAll('describingTerms') as
      | string
      | string[]

    openEndedQuestions.forEach(question => {
      formAnswers[question.id] = form.get(question.id) as string | string[]
    })
    await supabase
      .from('questionnaire')
      .insert({ conversation_id: conversation.id, responses: formAnswers })
    setPageState('Finished')
  }

  const handleChange = (e: any) => {
    const formId = document.getElementById('questionnaire') as HTMLFormElement
    const form = new FormData(formId)
    const newTerms = form.getAll('describingTerms')
    if (countTerms.length === 5) {
      e.target.checked = false
      if (newTerms.length <= 5) {
        setCountTerms(newTerms as string[])
      }
    } else {
      setCountTerms(form.getAll('describingTerms') as string[])
    }
  }
  return (
    <>
      <p className=" rounded-full p-4 text-2xl font-extrabold self-start text-purple-500">
        Thank you for participating in the study!
      </p>
      <p className=" rounded-full py-2 text-lg font-semibold px-4 self-start ">
        The last step is to complete this questionnaire according to what your
        experienced during the conversation with the virtual agent.
      </p>
      <form
        onSubmit={submitQuestionnaire}
        className=" px-4 py-0 my-4"
        id="questionnaire"
      >
        <div className="flex flex-col justify-center my-6 gap-y-4">
          {engagementStatements.map(statement => (
            <LikertScaleQuestion
              key={statement.id}
              question={statement.message}
              id={statement.id}
            />
          ))}
          <div className="flex flex-col  justify-between py-2 px-2 lg:py-4 lg:px-8 hover:bg-slate-50 bg-white rounded-xl border border-gray-300 shadow-md ">
            <span className="flex-1 mb-4 lg:mr-8 self-start  font-semibold">
              Choose maximum five terms from the list to describe the perceived
              personality of the virtual agent
            </span>
            <div className="grid grid-cols-6 lg:grid-cols-8 gap-2 w-full lg:w-fit">
              {describingTerms.map(term => (
                <div
                  key={term}
                  className={`flex flex-row items-center p-2 justify-evenly rounded-md ${
                    countTerms.includes(term)
                      ? 'bg-purple-500 '
                      : 'bg-slate-100'
                  }`}
                >
                  <label
                    htmlFor={term}
                    className={`pr-2 text-gray-500 text-sm md:text-base text-center ${
                      countTerms.includes(term) ? '!text-white' : ''
                    } `}
                  >
                    {term}
                  </label>
                  <input
                    disabled={
                      countTerms.length === 5 && !countTerms.includes(term)
                        ? true
                        : false
                    }
                    type="checkbox"
                    id={term}
                    name="describingTerms"
                    value={term}
                    className={`focus:outline-none border-b w-fit placeholder-gray-500 accent-white`}
                    placeholder={term}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>
          </div>
          {openEndedQuestions.map(question => (
            <OpenEndedQuestion
              key={question.id}
              question={question.text}
              id={question.id}
            />
          ))}
          <button
            type="submit"
            className=" rounded-lg px-1 py-3 sm:w-56 bg-purple-500 text-white text-md font-semibold my-4"
          >
            Submit responses
          </button>
        </div>
      </form>
    </>
  )
}
