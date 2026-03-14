import { z } from "zod";
import { phoneRegex } from "./security";

const requiredString = (max: number) => z.string().min(1).max(max);

export const contactSchema = z.object({
  fullName: requiredString(100),
  phone: z.string().min(7).max(20).regex(phoneRegex, "Invalid phone format"),
  email: z.string().email().max(100),
  subject: z.string().max(200).optional().default("General inquiry"),
  message: requiredString(2000),
  honeypot: z.string().optional(),
});

export const studentInquirySchema = z.object({
  fullName: requiredString(100),
  phone: z.string().min(7).max(20).regex(phoneRegex, "Invalid phone format"),
  email: z.string().email().max(100),
  country: requiredString(80),
  currentEducation: requiredString(150),
  interestedCourse: requiredString(150),
  interestedUniversity: z.string().max(150).optional().default("Not specified"),
  preferredIntake: requiredString(80),
  message: requiredString(2000),
  honeypot: z.string().optional(),
});

export const adminStatusSchema = z.object({
  type: z.enum(["contact", "student_inquiry", "document_upload"]),
  status: z.enum(["new", "contacted", "in_progress", "completed", "rejected"]),
  adminNotes: z.string().max(1000).optional(),
});
