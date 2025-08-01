import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
}

if (!supabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: number
          title: string
          description: string
          tech_stack: string[]
          github_url: string
          demo_url: string | null
          image_url: string | null
          author: string
          created_at: string
          contract_address: string | null
          twitter_url: string | null
        }
        Insert: {
          title: string
          description: string
          tech_stack: string[]
          github_url: string
          demo_url?: string | null
          image_url?: string | null
          author: string
          contract_address?: string | null
          twitter_url?: string | null
        }
        Update: {
          title?: string
          description?: string
          tech_stack?: string[]
          github_url?: string
          demo_url?: string | null
          image_url?: string | null
          author?: string
          contract_address?: string | null
          twitter_url?: string | null
        }
      }
    }
  }
}
