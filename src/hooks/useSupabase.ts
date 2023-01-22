import { createClient } from '@supabase/supabase-js'
import { Database } from '../database.types'

export const useSupabase = () => {
  const supabase = createClient<Database>(
    import.meta.env.VITE_SUPABASE_PROJECT,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  )
  return { supabase }
}
