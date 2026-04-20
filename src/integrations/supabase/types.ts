export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ── Domain Types ──────────────────────────────────────────
export type UserRole = 'student' | 'staff' | 'admin' | 'super_admin'
export type ApplicationStatus =
  | 'inquiry' | 'documents_pending' | 'under_review'
  | 'approved' | 'rejected' | 'visa_processing' | 'completed' | 'cancelled'
export type DocumentStatus = 'pending' | 'approved' | 'rejected' | 'expired'
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled' | 'refunded'
export type NotificationType = 'application_update' | 'document_request' | 'message' | 'payment' | 'system'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  role: UserRole
  nationality: string | null
  passport_number: string | null
  date_of_birth: string | null
  address: string | null
  emergency_contact: string | null
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export interface Application {
  id: string
  student_id: string
  assigned_staff_id: string | null
  type: 'visa' | 'university' | 'insurance' | 'air_ticket' | 'other'
  destination_country: string
  university: string | null
  program: string | null
  intake: string | null
  status: ApplicationStatus
  priority: 'low' | 'normal' | 'high' | 'urgent'
  notes: string | null
  target_date: string | null
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface AppDocument {
  id: string
  student_id: string
  application_id: string | null
  uploaded_by: string | null
  document_type: string
  file_name: string
  file_size: number
  mime_type: string | null
  storage_path: string
  status: DocumentStatus
  rejection_reason: string | null
  expires_at: string | null
  verified_by: string | null
  verified_at: string | null
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface MessageThread {
  id: string
  student_id: string
  application_id: string | null
  subject: string
  status: 'open' | 'resolved' | 'archived'
  last_message_at: string | null
  created_at: string
  updated_at: string
  profiles?: Profile
  messages?: AppMessage[]
}

export interface AppMessage {
  id: string
  thread_id: string
  sender_id: string
  body: string
  attachments: Json
  read_by: Json
  created_at: string
  profiles?: Profile
}

export interface AppNotification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  body: string
  action_url: string | null
  read: boolean
  created_at: string
}

export interface Payment {
  id: string
  student_id: string
  application_id: string | null
  invoice_number: string
  description: string
  amount_npr: number
  amount_usd: number | null
  currency: 'NPR' | 'USD' | 'KRW' | 'JPY'
  payment_method: string | null
  status: PaymentStatus
  due_date: string | null
  paid_at: string | null
  receipt_path: string | null
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  profiles?: Profile
}

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      document_submissions: {
        Row: {
          created_at: string
          email: string | null
          file_key: string
          file_size: number | null
          file_type: string | null
          full_name: string | null
          id: string
          message: string | null
          original_file_name: string | null
          passport_number: string | null
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          file_key: string
          file_size?: number | null
          file_type?: string | null
          full_name?: string | null
          id?: string
          message?: string | null
          original_file_name?: string | null
          passport_number?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          file_key?: string
          file_size?: number | null
          file_type?: string | null
          full_name?: string | null
          id?: string
          message?: string | null
          original_file_name?: string | null
          passport_number?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
