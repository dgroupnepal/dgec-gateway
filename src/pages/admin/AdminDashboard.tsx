import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Files, CheckCircle2, Clock3, AlertCircle, ListChecks } from "lucide-react";
import { api, type AdminUploadRecord } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const [uploads, setUploads] = useState<AdminUploadRecord[]>([]);
  const [summary, setSummary] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await api.getAdminUploads({});
      if (res.success && res.data) {
        setUploads(res.data.uploads);
        setSummary(res.data.summary);
      }
      setLoading(false);
    };

    load();
  }, []);

  const cards = useMemo(
    () => [
      { label: "Total Uploads", value: uploads.length, icon: Files },
      { label: "New", value: summary.new || 0, icon: Clock3 },
      { label: "Reviewing", value: summary.reviewing || 0, icon: ListChecks },
      { label: "Approved", value: summary.approved || 0, icon: CheckCircle2 },
      { label: "Rejected", value: summary.rejected || 0, icon: AlertCircle },
    ],
    [summary, uploads.length],
  );

  return (
    <section className="section-padding">
      <div className="container-custom space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-primary">DGEC Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage uploaded student documents and review progress.</p>
          </div>
          <Button asChild variant="accent">
            <Link to="/admin/uploads">View all uploads</Link>
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {cards.map((card) => (
            <Card key={card.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.label}</CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "..." : card.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Uploads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploads.slice(0, 5).map((upload) => (
                <div key={upload.id} className="flex flex-col md:flex-row md:items-center md:justify-between border rounded-lg p-3 gap-2">
                  <div>
                    <p className="font-medium">{upload.fullName || "Unknown Student"}</p>
                    <p className="text-sm text-muted-foreground">{upload.email || "No email"} · {upload.originalFileName || "Unnamed file"}</p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/admin/uploads/${upload.id}`}>View details</Link>
                  </Button>
                </div>
              ))}
              {!loading && uploads.length === 0 && <p className="text-sm text-muted-foreground">No uploads found yet.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AdminDashboard;
