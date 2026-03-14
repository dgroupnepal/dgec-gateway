export type ApiResult<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  key?: string;
  recordId?: number;
};

export type UploadStatus = "new" | "reviewing" | "approved" | "rejected" | "completed";

export type AdminUploadRecord = {
  id: number;
  fullName: string | null;
  phone: string | null;
  email: string | null;
  passportNumber: string | null;
  message: string | null;
  fileKey: string;
  originalFileName: string | null;
  fileType: string | null;
  fileSize: number | null;
  status: UploadStatus;
  createdAt: string;
  updatedAt: string;
};

const CONTACT_API_URL = import.meta.env.VITE_API_BASE_URL || "https://dgec-contact-api.dgroupofficial.workers.dev";

const apiFetch = async <T>(url: string, init: RequestInit): Promise<ApiResult<T>> => {
  const response = await fetch(url, {
    ...init,
    headers: {
      ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...init.headers,
    },
  });

  const payload = (await response.json()) as ApiResult<T>;
  return payload;
};

export const api = {
  postContact: (body: Record<string, unknown>) =>
    apiFetch<{ id: string }>(`${CONTACT_API_URL}/contact`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  postStudentInquiry: (body: Record<string, unknown>) =>
    apiFetch<{ id: string }>(`${CONTACT_API_URL}/student-inquiry`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  postDocumentUpload: (formData: FormData) =>
    apiFetch<{ id?: string }>(`${CONTACT_API_URL}/document-upload`, {
      method: "POST",
      body: formData,
    }),

  getAdminUploads: ({ search, status }: { search?: string; status?: string }) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status && status !== "all") params.set("status", status);

    return apiFetch<{ uploads: AdminUploadRecord[]; summary: Record<string, number> }>(
      `${CONTACT_API_URL}/admin/uploads${params.toString() ? `?${params.toString()}` : ""}`,
      { method: "GET" },
    );
  },

  getAdminUploadById: (id: string) => apiFetch<AdminUploadRecord>(`${CONTACT_API_URL}/admin/uploads/${id}`, { method: "GET" }),

  patchAdminUploadStatus: (id: string, status: UploadStatus) =>
    apiFetch<AdminUploadRecord>(`${CONTACT_API_URL}/admin/uploads/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};
