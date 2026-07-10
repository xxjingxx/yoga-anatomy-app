export type UserRole = 'free' | 'premium' | 'admin'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          avatar_url: string | null
          role: UserRole
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          avatar_url?: string | null
          role?: UserRole
        }
        Update: {
          display_name?: string | null
          avatar_url?: string | null
          role?: UserRole
          updated_at?: string
        }
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string
          item_type: 'muscle' | 'pose'
          item_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          item_type: 'muscle' | 'pose'
          item_id: string
        }
        Update: {
          id?: string
          user_id?: string
          item_type?: 'muscle' | 'pose'
          item_id?: string
        }
      }
      muscles: {
        Row: {
          id: string
          name: string
          latin_name: string | null
          region: string
          area: string
          origin: string[]
          insertion: string[]
          actions: string[]
          antagonists: string[] | null
          innervation: string | null
          description: string
          teaching_tip: string
        }
        Insert: {
          id: string
          name: string
          latin_name?: string | null
          region: string
          area: string
          origin: string[]
          insertion: string[]
          actions: string[]
          antagonists?: string[] | null
          innervation?: string | null
          description: string
          teaching_tip: string
        }
        Update: {
          name?: string
          latin_name?: string | null
          region?: string
          area?: string
          origin?: string[]
          insertion?: string[]
          actions?: string[]
          antagonists?: string[] | null
          innervation?: string | null
          description?: string
          teaching_tip?: string
        }
      }
      poses: {
        Row: {
          id: string
          name: string
          sanskrit: string
          category: string
          level: string
          description: string
          breath_cue: string | null
          contraindications: string[] | null
        }
        Insert: {
          id: string
          name: string
          sanskrit: string
          category: string
          level: string
          description: string
          breath_cue?: string | null
          contraindications?: string[] | null
        }
        Update: {
          name?: string
          sanskrit?: string
          category?: string
          level?: string
          description?: string
          breath_cue?: string | null
          contraindications?: string[] | null
        }
      }
      muscle_pose_activations: {
        Row: {
          muscle_id: string
          pose_id: string
          activation: string
          muscle_cue: string | null
          pose_notes: string | null
        }
        Insert: {
          muscle_id: string
          pose_id: string
          activation: string
          muscle_cue?: string | null
          pose_notes?: string | null
        }
        Update: {
          activation?: string
          muscle_cue?: string | null
          pose_notes?: string | null
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: { user_role: UserRole }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Bookmark = Database['public']['Tables']['bookmarks']['Row']
