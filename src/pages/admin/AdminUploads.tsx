import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api, type AdminUploadRecord, type UploadStatus } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const statusOptions: Array<{ label: string; value: "all" | UploadStatus }> = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Reviewing", value: "reviewing" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Completed", value: "completed" },
];

const AdminUploads = () => {
  const [uploads, setUploads] = useState<AdminUploadRecord[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<(typeof statusOptions)[number]["value"]>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const response = await api.getAdminUploads({ search, status });
      if (response.success && response.data) {
        setUploads(response.data.uploads);
      }
      setLoading(false);
    };

    void load();
  }, [search, status]);

  const normalized = useMemo(() => uploads, [uploads]);

  return (
    <section className="section-padding">
      <div className="container-custom space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">Document Uploads</h1>
          <p className="text-muted-foreground">Search and manage student submissions by name, email, or passport number.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-3">
            <Input
              placeholder="Search name, email, passport number"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={status === option.value ? "accent" : "outline"}
                  size="sm"
                  onClick={() => setStatus(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uploads ({loading ? "..." : normalized.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-2 pr-4">Student</th>
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">Phone</th>
                    <th className="py-2 pr-4">Passport</th>
                    <th className="py-2 pr-4">File</th>
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {normalized.map((upload) => (
                    <tr key={upload.id} className="border-b align-top">
                      <td className="py-3 pr-4 font-medium">{upload.fullName || "-"}</td>
                      <td className="py-3 pr-4">{upload.email || "-"}</td>
                      <td className="py-3 pr-4">{upload.phone || "-"}</td>
                      <td className="py-3 pr-4">{upload.passportNumber || "-"}</td>
                      <td className="py-3 pr-4">{upload.originalFileName || "-"}</td>
                      <td className="py-3 pr-4">{new Date(upload.createdAt).toLocaleString()}</td>
                      <td className="py-3 pr-4"><Badge>{upload.status}</Badge></td>
                      <td className="py-3"><Button size="sm" variant="outline" asChild><Link to={`/admin/uploads/${upload.id}`}>View</Link></Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!loading && normalized.length === 0 && <p className="text-sm text-muted-foreground mt-3">No uploads matched your filters.</p>}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AdminUploads;
