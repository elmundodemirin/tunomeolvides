import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cliente público: usa la clave anon + RLS para controlar acceso
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
