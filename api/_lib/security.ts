export const sanitizeText = (value: string) =>
  value
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export const isAllowedFile = (fileName: string) => {
  const allowed = ["pdf", "jpg", "jpeg", "png", "doc", "docx", "zip"];
  const extension = fileName.toLowerCase().split(".").pop() || "";
  return allowed.includes(extension);
};

export const phoneRegex = /^\+?[0-9\s().-]{7,20}$/;

export const hasHoneypot = (value: unknown) => typeof value === "string" && value.trim().length > 0;
