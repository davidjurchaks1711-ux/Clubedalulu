import { createClient } from '@supabase/supabase-js'

const env = (import.meta as ImportMeta & { env: Record<string, string | undefined> }).env
const url = env.VITE_SUPABASE_URL
const key = env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY

// Reutiliza a sessão persistida pelo Supabase, sem outro fluxo de autenticação.
// Somente a chave pública: todas as operações estão sujeitas às políticas RLS.
export const supabase = url && key ? createClient(url, key) : null
