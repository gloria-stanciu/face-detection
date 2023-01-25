import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { useGlobalStore } from './hooks/useGlobalStore'

window.addEventListener('message', e => {
  console.log(e.data)
  const userId = e?.data?.data?.messages?.[0]?.metadata?.chatter?.id
  if (userId) {
    console.log({ userId })
    useGlobalStore.setState({ conversation_id: userId })
  }
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />
)
