import { config } from "./config";

type EmailPayload = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
};

const sendWithResend = async (payload: EmailPayload) => {
  if (!config.resendApiKey) {
    return { success: false, message: "RESEND_API_KEY is not configured" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: config.emailFrom,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    }),
  });

  if (!response.ok) {
    const raw = await response.text();
    return { success: false, message: `Email API failed: ${raw}` };
  }

  return { success: true, message: "Email sent" };
};

const wrapHtml = (title: string, body: string) => `
  <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;padding:20px;border:1px solid #e5e7eb;border-radius:8px;">
    <h2 style="color:#0f172a;margin-bottom:16px;">${title}</h2>
    <div style="color:#334155;line-height:1.6;">${body}</div>
    <hr style="margin:24px 0;border:none;border-top:1px solid #e2e8f0;" />
    <p style="font-size:12px;color:#64748b;">D Group Education Consultancy Pvt. Ltd., Kalanki-14, Kathmandu, Nepal</p>
  </div>
`;

export const emailService = {
  sendContactNotification: (details: Record<string, string>) =>
    sendWithResend({
      to: [config.adminEmail, config.founderEmail].filter(Boolean) as string[],
      subject: `New contact submission: ${details.subject}`,
      html: wrapHtml(
        "New Contact Form Submission",
        `<p><strong>Name:</strong> ${details.fullName}</p><p><strong>Email:</strong> ${details.email}</p><p><strong>Phone:</strong> ${details.phone}</p><p><strong>Subject:</strong> ${details.subject}</p><p><strong>Message:</strong><br/>${details.message}</p>`,
      ),
      text: `New contact submission\nName: ${details.fullName}\nEmail: ${details.email}\nPhone: ${details.phone}\nSubject: ${details.subject}\nMessage: ${details.message}`,
    }),

  sendStudentInquiryNotification: (details: Record<string, string>) =>
    sendWithResend({
      to: [config.adminEmail, config.founderEmail].filter(Boolean) as string[],
      subject: `New student inquiry: ${details.fullName}`,
      html: wrapHtml(
        "New Student Inquiry",
        `<p><strong>Name:</strong> ${details.fullName}</p><p><strong>Email:</strong> ${details.email}</p><p><strong>Phone:</strong> ${details.phone}</p><p><strong>Country:</strong> ${details.country}</p><p><strong>Current Education:</strong> ${details.currentEducation}</p><p><strong>Interested Course:</strong> ${details.interestedCourse}</p><p><strong>Interested University:</strong> ${details.interestedUniversity}</p><p><strong>Preferred Intake:</strong> ${details.preferredIntake}</p><p><strong>Message:</strong><br/>${details.message}</p>`,
      ),
      text: `New student inquiry from ${details.fullName}`,
    }),

  sendDocumentUploadNotification: (details: Record<string, string>) =>
    sendWithResend({
      to: [config.adminEmail, config.founderEmail].filter(Boolean) as string[],
      subject: `New document upload: ${details.studentFullName}`,
      html: wrapHtml(
        "New Document Upload",
        `<p><strong>Name:</strong> ${details.studentFullName}</p><p><strong>Email:</strong> ${details.email}</p><p><strong>Phone:</strong> ${details.phone}</p><p><strong>Passport Number:</strong> ${details.passportNumber || "N/A"}</p><p><strong>Remarks:</strong> ${details.message || "N/A"}</p><p><strong>Uploaded Files:</strong><br/>${details.files}</p>`,
      ),
      text: `New document upload from ${details.studentFullName}\nFiles: ${details.files}`,
    }),

  sendUserConfirmation: (email: string, fullName: string, type: "contact" | "student" | "documents") =>
    sendWithResend({
      to: email,
      subject: "DGEC received your submission",
      html: wrapHtml(
        "Thank you for contacting DGEC",
        `<p>Dear ${fullName},</p><p>We have received your ${type} submission. Our team will contact you soon.</p><p>Regards,<br/>DGEC Support Team</p>`,
      ),
      text: `Dear ${fullName}, we have received your ${type} submission.`,
    }),
};
