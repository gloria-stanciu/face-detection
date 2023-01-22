export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      conversation: {
        Row: {
          created_at: string | null
          id: number
          user_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          user_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          user_id?: number | null
        }
      }
      recording: {
        Row: {
          age: number
          angry: number
          conversation_id: number | null
          disgusted: number
          fearful: number
          gender: string
          gender_probability: number
          happy: number
          id: number
          neutral: number
          sad: number
          surprised: number
          timestamp: string | null
        }
        Insert: {
          age: number
          angry: number
          conversation_id?: number | null
          disgusted: number
          fearful: number
          gender: string
          gender_probability: number
          happy: number
          id?: number
          neutral: number
          sad: number
          surprised: number
          timestamp?: string | null
        }
        Update: {
          age?: number
          angry?: number
          conversation_id?: number | null
          disgusted?: number
          fearful?: number
          gender?: string
          gender_probability?: number
          happy?: number
          id?: number
          neutral?: number
          sad?: number
          surprised?: number
          timestamp?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
