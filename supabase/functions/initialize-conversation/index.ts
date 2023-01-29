import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
}

console.log(`Function "initialize-conversation"!`)

serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method !== 'POST') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )
    // Now we can get the session or user object
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    const { conversation_id } = await req.json()
    // And we can run queries in the context of our authenticated user
    const { data, error } = await supabaseClient.from('conversation').upsert({conversation_id})
    if (error) throw error

    return new Response(JSON.stringify({ user, data }), {
      headers: { ...corsHeaders },
      status: 200,
    })
  } catch (error) {
    console.log({error})
    return new Response(JSON.stringify({ error: error.message }), {
      headers: corsHeaders,
      status: 400,
    })
  }
})

// To invoke:
// curl -i --location --request POST 'https://bibmytmkipilvlznixwo.supabase.co/functions/v1/initialize-conversation' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpYm15dG1raXBpbHZsem5peHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQxNjQwMjksImV4cCI6MTk4OTc0MDAyOX0.s9kvf9TCRfyr4s1RcH20oC3-PUMbFyWhagoAsAhDywI' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'