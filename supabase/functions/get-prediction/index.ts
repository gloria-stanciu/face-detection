import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
}

console.log(`Function "get-prediction"!`)

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

    const { prediction_category, conversation_id } = await req.json()

    // // And we can run queries in the context of our authenticated user
    const { data, error } = await supabaseClient.from('recording').select( `${prediction_category}, timestamp, conversation_id`).eq('conversation_id', `${conversation_id}`).order('timestamp', {ascending: false}).limit(50)
    if (error) throw error

    console.log(data)
    return new Response(JSON.stringify({ user }), {
      headers: { ...corsHeaders },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders },
      status: 400,
    })
  }
})
