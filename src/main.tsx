import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { useGlobalStore } from './hooks/useGlobalStore'

window.addEventListener('message', e => {
  if (e?.data?.data?.user) {
    useGlobalStore.setState(state => {
      state.user.conversation_id = e?.data?.data?.user?.id
    })
  }
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />
)
