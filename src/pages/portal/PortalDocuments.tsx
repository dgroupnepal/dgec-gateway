import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { AppDocument } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, FileText, CheckCircle2, XCircle, Clock, Trash2, Download, Eye } from "lucide-react";

const DOCUMENT_TYPES = [
  { value: "passport", label: "Passport" },
  { value: "photo", label: "Passport Photo" },
  { value: "transcript", label: "Academic Transcript" },
  { value: "diploma", label: "Diploma / Certificate" },
  { value: "bank_statement", label: "Bank Statement" },
  { value: "medical", label: "Medical Certificate" },
  { value: "police_clearance", label: "Police Clearance" },
  { value: "language_cert", label: "Language Certificate" },
  { value: "recommendation", label: "Recommendation Letter" },
  { value: "birth_certificate", label: "Birth Certificate" },
  { value: "employment_letter", label: "Employment Letter" },
  { value: "other", label: "Other" },
];

const statusBadge = (status: string) => {
  const map: Record<string, { label: string; className: string; icon: React.ElementType }> = {
    pending:  { label: "Pending Review", className: "bg-yellow-100 text-yellow-800", icon: Clock },
    approved: { label: "Approved",        className: "bg-green-100 text-green-800",  icon: CheckCircle2 },
    rejected: { label: "Rejected",        className: "bg-red-100 text-red-800",      icon: XCircle },
    expired:  { label: "Expired",         className: "bg-gray-100 text-gray-600",    icon: XCircle },
  };
  return map[status] ?? map.pending;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

const PortalDocuments = () => {
  const { profile } = useAuth();
  const [documents, setDocuments] = useState<AppDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState("passport");
  const fileRef = useRef<HTMLInputElement>(null);

  const loadDocuments = useCallback(async () => {
    if (!profile) return;
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("student_id", profile.id)
      .order("created_at", { ascending: false });
    if (!error && data) setDocuments(data as AppDocument[]);
    setLoading(false);
  }, [profile]);

  useEffect(() => { loadDocuments(); }, [loadDocuments]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only PDF, JPEG, PNG, and WebP files are allowed.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be under 10 MB.");
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${profile.id}/${docType}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(path, file, { contentType: file.type, upsert: false });

    if (uploadError) {
      toast.error("Upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { error: dbError } = await supabase.from("documents").insert({
      student_id: profile.id,
      uploaded_by: profile.id,
      document_type: docType,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
      storage_path: path,
      status: "pending",
    });

    if (dbError) {
      toast.error("Failed to save record: " + dbError.message);
    } else {
      toast.success("Document uploaded successfully!");
      await loadDocuments();
    }

    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDelete = async (doc: AppDocument) => {
    await supabase.storage.from("documents").remove([doc.storage_path]);
    await supabase.from("documents").delete().eq("id", doc.id);
    setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
    toast.success("Document deleted.");
  };

  const handleDownload = async (doc: AppDocument) => {
    const { data } = await supabase.storage
      .from("documents")
      .createSignedUrl(doc.storage_path, 60);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
    else toast.error("Could not generate download link.");
  };

  return (
    <div className="section-padding">
      <div className="container-custom max-w-4xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl md:text-3xl font-bold">My Documents</h1>
          <p className="text-muted-foreground mt-1">Upload and manage your application documents.</p>
        </motion.div>

        {/* Upload Card */}
        <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
              <div className="space-y-1.5 flex-1">
                <label className="text-sm font-medium">Document Type</label>
                <Select value={docType} onValueChange={setDocType}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  className="hidden"
                  id="file-upload"
                  onChange={handleUpload}
                  disabled={uploading}
                />
                <label htmlFor="file-upload" className="cursor-pointer block">
                  <Button asChild variant="default" disabled={uploading} className="w-full md:w-auto">
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? "Uploading…" : "Choose File & Upload"}
                    </span>
                  </Button>
                </label>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Accepted: PDF, JPEG, PNG, WebP · Max size: 10 MB
            </p>
          </CardContent>
        </Card>

        {/* Document List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Uploaded Documents ({documents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />)}
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p>No documents uploaded yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => {
                  const s = statusBadge(doc.status);
                  const StatusIcon = s.icon;
                  const label = DOCUMENT_TYPES.find((t) => t.value === doc.document_type)?.label ?? doc.document_type;
                  return (
                    <motion.div key={doc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/40 transition-colors">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{label}</p>
                          <p className="text-xs text-muted-foreground truncate">{doc.file_name} · {(doc.file_size / 1024).toFixed(0)} KB</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${s.className}`}>
                          <StatusIcon className="w-3 h-3" /> {s.label}
                        </span>
                        {doc.rejection_reason && (
                          <p className="text-xs text-red-500 hidden md:block max-w-[120px] truncate" title={doc.rejection_reason}>
                            {doc.rejection_reason}
                          </p>
                        )}
                        <div className="flex gap-1 shrink-0">
                          <Button size="icon" variant="ghost" className="w-7 h-7" onClick={() => handleDownload(doc)}>
                            <Download className="w-3 h-3" />
                          </Button>
                          <Button size="icon" variant="ghost" className="w-7 h-7 text-red-500 hover:text-red-600" onClick={() => handleDelete(doc)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PortalDocuments;
