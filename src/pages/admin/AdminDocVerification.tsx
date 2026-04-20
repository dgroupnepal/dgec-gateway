import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { AppDocument } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileText, CheckCircle2, XCircle, Clock, Eye, Download, Search } from "lucide-react";

const DOCUMENT_LABELS: Record<string, string> = {
  passport: "Passport", photo: "Photo", transcript: "Transcript",
  diploma: "Diploma", bank_statement: "Bank Statement", medical: "Medical",
  police_clearance: "Police Clearance", language_cert: "Language Cert",
  recommendation: "Recommendation", birth_certificate: "Birth Certificate",
  employment_letter: "Employment Letter", other: "Other",
};

type DocWithProfile = AppDocument & { profiles?: { full_name: string | null; email: string } };

const AdminDocVerification = () => {
  const { profile } = useAuth();
  const [docs, setDocs] = useState<DocWithProfile[]>([]);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<DocWithProfile | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    let q = supabase
      .from("documents")
      .select("*, profiles!student_id(full_name, email)")
      .order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter);
    const { data } = await q;
    let items = (data ?? []) as DocWithProfile[];
    if (search) {
      const s = search.toLowerCase();
      items = items.filter((d) =>
        d.file_name.toLowerCase().includes(s) ||
        (d.profiles?.full_name ?? "").toLowerCase().includes(s) ||
        (d.profiles?.email ?? "").toLowerCase().includes(s)
      );
    }
    setDocs(items);
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter, search]);

  const updateStatus = async (doc: DocWithProfile, status: "approved" | "rejected") => {
    if (status === "rejected" && !rejectReason.trim()) {
      toast.error("Please provide a rejection reason.");
      return;
    }
    const { error } = await supabase
      .from("documents")
      .update({
        status,
        verified_by: profile?.id,
        verified_at: new Date().toISOString(),
        ...(status === "rejected" ? { rejection_reason: rejectReason } : { rejection_reason: null }),
      })
      .eq("id", doc.id);

    if (error) { toast.error("Update failed."); return; }

    // Notify student
    await supabase.from("notifications").insert({
      user_id: doc.student_id,
      type: "document_request",
      title: `Document ${status}`,
      body: `Your ${DOCUMENT_LABELS[doc.document_type] ?? doc.document_type} has been ${status}${status === "rejected" ? `: ${rejectReason}` : "."}.`,
    });

    toast.success(`Document ${status}`);
    setSelected(null);
    setRejectReason("");
    await load();
  };

  const handleDownload = async (doc: DocWithProfile) => {
    const { data } = await supabase.storage.from("documents").createSignedUrl(doc.storage_path, 60);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
    else toast.error("Could not generate link.");
  };

  const statusBadge = (status: string) => {
    if (status === "approved") return <Badge className="bg-green-100 text-green-800 text-xs">Approved</Badge>;
    if (status === "rejected") return <Badge className="bg-red-100 text-red-800 text-xs">Rejected</Badge>;
    return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Pending</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Document Verification</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Review and verify student documents.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search student, file…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {(["pending", "approved", "rejected", "all"] as const).map((f) => (
            <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)} className="capitalize">{f}</Button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="p-4 font-medium">Student</th>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium hidden md:table-cell">File</th>
                  <th className="p-4 font-medium hidden md:table-cell">Size</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr><td colSpan={7} className="p-4 text-center text-muted-foreground">Loading…</td></tr>
                ) : docs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-40" />
                      <p className="text-muted-foreground">No documents found.</p>
                    </td>
                  </tr>
                ) : (
                  docs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-muted/40">
                      <td className="p-4">
                        <p className="font-medium">{doc.profiles?.full_name ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">{doc.profiles?.email ?? "—"}</p>
                      </td>
                      <td className="p-4 text-xs">{DOCUMENT_LABELS[doc.document_type] ?? doc.document_type}</td>
                      <td className="p-4 hidden md:table-cell text-xs text-muted-foreground max-w-[120px] truncate">{doc.file_name}</td>
                      <td className="p-4 hidden md:table-cell text-xs">{(doc.file_size / 1024).toFixed(0)} KB</td>
                      <td className="p-4">{statusBadge(doc.status)}</td>
                      <td className="p-4 text-xs text-muted-foreground">{new Date(doc.created_at).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => handleDownload(doc)}>
                            <Download className="w-3 h-3" />
                          </Button>
                          {doc.status === "pending" && (
                            <Button size="sm" variant="outline" onClick={() => setSelected(doc)}>
                              Review
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Review Sheet */}
      <Sheet open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <SheetContent className="w-full md:max-w-md">
          <SheetHeader>
            <SheetTitle>Review Document</SheetTitle>
          </SheetHeader>
          {selected && (
            <div className="space-y-4 mt-4">
              <div>
                <p className="font-semibold">{selected.profiles?.full_name ?? "—"}</p>
                <p className="text-sm text-muted-foreground">{DOCUMENT_LABELS[selected.document_type] ?? selected.document_type}</p>
                <p className="text-xs text-muted-foreground mt-1">{selected.file_name} · {(selected.file_size / 1024).toFixed(0)} KB</p>
              </div>

              <Button variant="outline" className="w-full" onClick={() => handleDownload(selected)}>
                <Eye className="w-3 h-3 mr-2" /> View Document
              </Button>

              <div className="space-y-2">
                <p className="text-sm font-medium">Rejection Reason (if rejecting)</p>
                <Textarea
                  placeholder="e.g. Document is blurry, please re-upload…"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => updateStatus(selected, "approved")}>
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                </Button>
                <Button variant="destructive" className="flex-1" onClick={() => updateStatus(selected, "rejected")}>
                  <XCircle className="w-4 h-4 mr-2" /> Reject
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminDocVerification;
