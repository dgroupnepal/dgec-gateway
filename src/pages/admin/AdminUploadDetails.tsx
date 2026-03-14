import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, type AdminUploadRecord, type UploadStatus } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const statuses: UploadStatus[] = ["new", "reviewing", "approved", "rejected", "completed"];

const AdminUploadDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [upload, setUpload] = useState<AdminUploadRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const result = await api.getAdminUploadById(id);
      if (result.success && result.data) {
        setUpload(result.data);
      }
      setLoading(false);
    };

    void load();
  }, [id]);

  const handleStatusChange = async (status: UploadStatus) => {
    if (!id) return;
    const result = await api.patchAdminUploadStatus(id, status);
    if (result.success && result.data) {
      setUpload(result.data);
      toast.success(`Status updated to ${status}`);
    } else {
      toast.error(result.message || "Unable to update status");
    }
  };

  if (loading) {
    return <section className="section-padding"><div className="container-custom">Loading upload details...</div></section>;
  }

  if (!upload) {
    return (
      <section className="section-padding">
        <div className="container-custom space-y-3">
          <p>Upload not found.</p>
          <Button asChild variant="outline"><Link to="/admin/uploads">Back to uploads</Link></Button>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding">
      <div className="container-custom space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-primary">Upload #{upload.id}</h1>
            <p className="text-muted-foreground">Detailed submission review and status control.</p>
          </div>
          <Button asChild variant="outline"><Link to="/admin/uploads">Back to uploads</Link></Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Submission Details</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
            <p><span className="font-medium">Full Name:</span> {upload.fullName || "-"}</p>
            <p><span className="font-medium">Email:</span> {upload.email || "-"}</p>
            <p><span className="font-medium">Phone:</span> {upload.phone || "-"}</p>
            <p><span className="font-medium">Passport Number:</span> {upload.passportNumber || "-"}</p>
            <p><span className="font-medium">Original File Name:</span> {upload.originalFileName || "-"}</p>
            <p><span className="font-medium">File Type:</span> {upload.fileType || "-"}</p>
            <p><span className="font-medium">File Size:</span> {upload.fileSize ? `${Math.round(upload.fileSize / 1024)} KB` : "-"}</p>
            <p><span className="font-medium">R2 File Key:</span> <code className="text-xs break-all">{upload.fileKey}</code></p>
            <p><span className="font-medium">Created At:</span> {new Date(upload.createdAt).toLocaleString()}</p>
            <p><span className="font-medium">Updated At:</span> {new Date(upload.updatedAt).toLocaleString()}</p>
            <p className="sm:col-span-2"><span className="font-medium">Message / Remarks:</span> {upload.message || "-"}</p>
            <div className="sm:col-span-2"><span className="font-medium">Current Status:</span> <Badge className="ml-2">{upload.status}</Badge></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Update Status</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <Button
                key={status}
                type="button"
                variant={upload.status === status ? "accent" : "outline"}
                onClick={() => handleStatusChange(status)}
              >
                {status}
              </Button>
            ))}
            <Button type="button" variant="secondary" asChild>
              <a href={`${import.meta.env.VITE_API_BASE_URL || "https://dgec-contact-api.dgroupofficial.workers.dev"}/admin/files/${encodeURIComponent(upload.fileKey)}`} target="_blank" rel="noreferrer">
                Open File
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AdminUploadDetails;
