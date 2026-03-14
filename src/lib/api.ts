export type ApiResult<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
};

const CONTACT_API_URL = "https://dgec-contact-api.dgroupofficial.workers.dev";

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
    apiFetch<{ id: string }>(`${CONTACT_API_URL}/document-upload`, {
      method: "POST",
      body: formData,
    }),
};
