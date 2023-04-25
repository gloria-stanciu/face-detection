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
          conversation_id: string
          created_at: string | null
          study_type: string | null
        }
        Insert: {
          conversation_id: string
          created_at?: string | null
          study_type?: string | null
        }
        Update: {
          conversation_id?: string
          created_at?: string | null
          study_type?: string | null
        }
      }
      message: {
        Row: {
          content: string | null
          conversation_id: string | null
          id: number
          participant: boolean | null
          timestamp: string | null
        }
        Insert: {
          content?: string | null
          conversation_id?: string | null
          id?: number
          participant?: boolean | null
          timestamp?: string | null
        }
        Update: {
          content?: string | null
          conversation_id?: string | null
          id?: number
          participant?: boolean | null
          timestamp?: string | null
        }
      }
      recording: {
        Row: {
          age: number
          angry: number
          conversation_id: string
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
          conversation_id: string
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
          conversation_id?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
