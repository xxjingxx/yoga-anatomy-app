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
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: { user_role: UserRole }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Bookmark = Database['public']['Tables']['bookmarks']['Row']
