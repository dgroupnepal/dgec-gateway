export type ApiResult<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const apiFetch = async <T>(path: string, init: RequestInit): Promise<ApiResult<T>> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
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
    apiFetch<{ id: string }>("/api/contact", { method: "POST", body: JSON.stringify(body) }),

  postStudentInquiry: (body: Record<string, unknown>) =>
    apiFetch<{ id: string }>("/api/student-inquiry", { method: "POST", body: JSON.stringify(body) }),

  postDocumentUpload: (formData: FormData) =>
    apiFetch<{ id: string }>("/api/document-upload", { method: "POST", body: formData }),
};
