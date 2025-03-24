export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'devotee' | 'pandit' | 'admin'
          name: string
          avatar_url: string | null
          phone: string | null
          location: string | null
          created_at: string
          updated_at: string
          experience: number | null
          languages: string[] | null
          specializations: string[] | null
          specialization_costs: Json | null
          bio: string | null
          rating: number | null
          review_count: number
        }
        Insert: {
          id: string
          role?: 'devotee' | 'pandit' | 'admin'
          name: string
          avatar_url?: string | null
          phone?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
          experience?: number | null
          languages?: string[] | null
          specializations?: string[] | null
          specialization_costs?: Json | null
          bio?: string | null
          rating?: number | null
          review_count?: number
        }
        Update: {
          id?: string
          role?: 'devotee' | 'pandit' | 'admin'
          name?: string
          avatar_url?: string | null
          phone?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
          experience?: number | null
          languages?: string[] | null
          specializations?: string[] | null
          specialization_costs?: Json | null
          bio?: string | null
          rating?: number | null
          review_count?: number
        }
      }
      bookings: {
        Row: {
          id: string
          pandit_id: string
          devotee_id: string
          ceremony: string
          ceremony_date: string
          ceremony_time: string
          location: string
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          cost: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pandit_id: string
          devotee_id: string
          ceremony: string
          ceremony_date: string
          ceremony_time: string
          location: string
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          cost: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          pandit_id?: string
          devotee_id?: string
          ceremony?: string
          ceremony_date?: string
          ceremony_time?: string
          location?: string
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          cost?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          pandit_id: string
          devotee_id: string
          booking_id: string | null
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          pandit_id: string
          devotee_id: string
          booking_id?: string | null
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          pandit_id?: string
          devotee_id?: string
          booking_id?: string | null
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          booking_id: string
          sender_id: string
          content: string
          created_at: string
          read_at: string | null
        }
        Insert: {
          id?: string
          booking_id: string
          sender_id: string
          content: string
          created_at?: string
          read_at?: string | null
        }
        Update: {
          id?: string
          booking_id?: string
          sender_id?: string
          content?: string
          created_at?: string
          read_at?: string | null
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
      user_role: 'devotee' | 'pandit' | 'admin'
      booking_status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
    }
  }
}