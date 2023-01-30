export const fetchOpenAI = async () => {
  const res = await fetch(
    'https://bibmytmkipilvlznixwo.functions.supabase.co/create-completion-open-ai',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        name: 'Functions',
        prompt: 'The AI must make the human angry! Use emoji while doing this.',
      }),
    }
  )

  console.log(await res.json())
}
