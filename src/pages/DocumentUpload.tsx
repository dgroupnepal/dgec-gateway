import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SectionHeader from "@/components/SectionHeader";
import { Upload, Shield, FileText, Phone } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx", ".zip"];

const DocumentUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    studentFullName: "",
    phone: "",
    email: "",
    passportNumber: "",
    message: "",
    website: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter((f) => {
        if (f.size > MAX_FILE_SIZE) {
          toast.error(`${f.name} exceeds 10MB limit`);
          return false;
        }
        return true;
      });
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (files.length === 0) {
      toast.error("Please upload at least one document.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = new FormData();
      payload.append("studentFullName", form.studentFullName);
      payload.append("phone", form.phone);
      payload.append("email", form.email);
      payload.append("passportNumber", form.passportNumber);
      payload.append("message", form.message);
      payload.append("website", form.website);
      files.forEach((file) => payload.append("files", file));

      const result = await api.postDocumentUpload(payload);

      if (result.success) {
        toast.success(result.message || "Documents submitted successfully.");
        setFiles([]);
        setForm({ studentFullName: "", phone: "", email: "", passportNumber: "", message: "", website: "" });
      } else {
        toast.error(result.message || "Unable to upload documents right now.");
      }
    } catch {
      toast.error("Network error while uploading files.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="bg-primary section-padding">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent font-medium text-sm mb-4">Document Submission</span>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-primary-foreground mb-6">
              Upload Your Documents Securely
            </h1>
            <p className="text-primary-foreground/70 text-lg">
              Submit your documents online for review. Our team will assess them and get back to you promptly.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <SectionHeader badge="Secure Upload" title="Student Document Submission" description="Upload required files for faster admission support." />
          <div className="grid grid-cols-3 gap-4 mb-12">
            {[{ num: "1", text: "Fill the form & upload files" }, { num: "2", text: "Our team reviews your documents" }, { num: "3", text: "We contact you with next steps" }].map((s) => (
              <div key={s.num} className="text-center">
                <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground font-display font-bold flex items-center justify-center mx-auto mb-2">{s.num}</div>
                <p className="text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="text" className="hidden" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))} />
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input id="fullName" placeholder="Your full name" required maxLength={100} className="mt-1" value={form.studentFullName} onChange={(e) => setForm((prev) => ({ ...prev, studentFullName: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" type="tel" placeholder="+977 98XXXXXXXX" required maxLength={20} className="mt-1" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" type="email" placeholder="your@email.com" required maxLength={100} className="mt-1" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="passportNumber">Passport Number (Optional)</Label>
              <Input id="passportNumber" placeholder="Passport number" className="mt-1" maxLength={50} value={form.passportNumber} onChange={(e) => setForm((prev) => ({ ...prev, passportNumber: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="message">Message / Remarks</Label>
              <Textarea id="message" placeholder="Tell us about your requirements..." maxLength={1000} className="mt-1" rows={4} value={form.message} onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))} />
            </div>

            <div>
              <Label>Upload Documents</Label>
              <div className="mt-1 border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-accent/50 transition-colors">
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-2">Drag & drop files or click to browse</p>
                <p className="text-xs text-muted-foreground mb-4">Accepted: PDF, JPG, JPEG, PNG, DOC, DOCX, ZIP (max 10MB each)</p>
                <input type="file" multiple accept={ACCEPTED_TYPES.join(",")} onChange={handleFileChange} className="hidden" id="fileUpload" />
                <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("fileUpload")?.click()}>
                  Choose Files
                </Button>
              </div>
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((f, i) => (
                    <div key={`${f.name}-${i}`} className="flex items-center justify-between bg-card rounded-lg p-3 shadow-card">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-accent" />
                        <span className="text-sm truncate max-w-[200px]">{f.name}</span>
                        <span className="text-xs text-muted-foreground">({(f.size / 1024).toFixed(0)} KB)</span>
                      </div>
                      <button type="button" onClick={() => removeFile(i)} className="text-destructive text-xs hover:underline">Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-start gap-3 bg-success/10 rounded-lg p-4">
              <Shield className="w-5 h-5 text-success shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">Your documents are handled securely and reviewed only by our authorized team members.</p>
            </div>

            <Button variant="accent" size="lg" type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Uploading..." : "Submit Documents"}
            </Button>
          </form>

          <div className="mt-12 bg-card rounded-xl p-6 shadow-card text-center">
            <Phone className="w-8 h-8 text-accent mx-auto mb-3" />
            <h3 className="font-display font-semibold text-lg mb-2">Need Help?</h3>
            <p className="text-muted-foreground text-sm mb-4">Contact our team for assistance with document submission.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="whatsapp" size="sm" asChild>
                <a href="https://wa.me/9779868780019" target="_blank" rel="noopener noreferrer">WhatsApp (Nepal)</a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:info@dgroup.edu.np">Email Us</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DocumentUpload;
