import {createClient} from '@supabase/supabase-js'

const url = process.env.EXPO_PUBLIC_PROJECT_URL
const key = process.env.EXPO_PUBLIC_ANON_KEY

const supabase = createClient(url as string, key as string)
export default supabase