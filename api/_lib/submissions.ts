import { supabase } from "./supabase";

export const submissionsRepo = {
  async createContact(payload: Record<string, unknown>) {
    return supabase.from("contact_submissions").insert(payload).select("id, created_at").single();
  },
  async createStudentInquiry(payload: Record<string, unknown>) {
    return supabase.from("student_inquiries").insert(payload).select("id, created_at").single();
  },
  async createDocumentUpload(payload: Record<string, unknown>) {
    return supabase.from("document_uploads").insert(payload).select("id, created_at").single();
  },
  async createUploadedFiles(payload: Record<string, unknown>[]) {
    return supabase.from("uploaded_files").insert(payload).select("id, file_name, file_path");
  },
  async createDocumentSubmission(payload: Record<string, unknown>) {
    return supabase.from("document_submissions").insert(payload).select("id, created_at").single();
  },
};

export const adminRepo = {
  async listAll(filters: Record<string, string>) {
    const { type, search, status, from, to, limit = "50", offset = "0" } = filters;

    const builders: Promise<{ type: string; data: unknown; error: unknown }>[] = [];

    const applyFilters = (query: ReturnType<typeof supabase.from>, label: string) => {
      let q = query.select("*").order("created_at", { ascending: false }).range(Number(offset), Number(offset) + Number(limit) - 1);
      if (status) q = q.eq("status", status);
      if (from) q = q.gte("created_at", from);
      if (to) q = q.lte("created_at", to);
      if (search) q = q.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
      builders.push(q.then(({ data, error }) => ({ type: label, data, error })));
    };

    if (!type || type === "contact") applyFilters(supabase.from("contact_submissions"), "contact");
    if (!type || type === "student_inquiry") applyFilters(supabase.from("student_inquiries"), "student_inquiry");
    if (!type || type === "document_upload") applyFilters(supabase.from("document_uploads"), "document_upload");

    return Promise.all(builders);
  },

  async getById(type: string, id: string) {
    const map: Record<string, string> = {
      contact: "contact_submissions",
      student_inquiry: "student_inquiries",
      document_upload: "document_uploads",
    };
    return supabase.from(map[type]).select("*").eq("id", id).single();
  },

  async updateStatus(type: string, id: string, status: string, adminNotes?: string) {
    const map: Record<string, string> = {
      contact: "contact_submissions",
      student_inquiry: "student_inquiries",
      document_upload: "document_uploads",
    };
    return supabase
      .from(map[type])
      .update({ status, admin_notes: adminNotes || null, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("id, status, updated_at")
      .single();
  },
};
