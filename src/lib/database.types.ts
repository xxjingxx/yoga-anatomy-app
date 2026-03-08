// Auto-generated Supabase types — regenerate with:
// npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts

export type UserRole = 'free' | 'premium' | 'admin'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string               // matches auth.users.id
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
          user_id: string
          item_type: 'muscle' | 'pose'
          item_id: string
        }
        Update: never
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      user_role: UserRole
    }
  }
}

// Convenience row types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Bookmark = Database['public']['Tables']['bookmarks']['Row']
