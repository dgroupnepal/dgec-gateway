import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Application, ApplicationStatus } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { GraduationCap, Plane, Shield, FileText, Plus, MoreVertical, ChevronRight } from "lucide-react";

type Column = { status: ApplicationStatus; label: string; color: string };

const COLUMNS: Column[] = [
  { status: "inquiry",           label: "Inquiry",          color: "border-blue-200 bg-blue-50/50" },
  { status: "documents_pending", label: "Docs Needed",      color: "border-yellow-200 bg-yellow-50/50" },
  { status: "under_review",      label: "Under Review",     color: "border-purple-200 bg-purple-50/50" },
  { status: "approved",          label: "Approved",         color: "border-green-200 bg-green-50/50" },
  { status: "visa_processing",   label: "Visa Processing",  color: "border-indigo-200 bg-indigo-50/50" },
  { status: "completed",         label: "Completed",        color: "border-teal-200 bg-teal-50/50" },
];

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "bg-red-100 text-red-700",
  high:   "bg-orange-100 text-orange-700",
  normal: "bg-gray-100 text-gray-600",
  low:    "bg-green-100 text-green-700",
};

const typeIcons: Record<string, React.ElementType> = {
  visa: Shield, university: GraduationCap, air_ticket: Plane, other: FileText,
};

const AdminPipeline = () => {
  const { profile } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selected, setSelected] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const dragApp = useRef<Application | null>(null);

  const load = async () => {
    const { data } = await supabase
      .from("applications")
      .select("*, profiles!student_id(full_name, email)")
      .order("created_at", { ascending: false });
    if (data) setApplications(data as Application[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const byStatus = (status: ApplicationStatus) =>
    applications.filter((a) => a.status === status);

  const moveApp = async (app: Application, newStatus: ApplicationStatus) => {
    const old = app.status;
    setApplications((prev) => prev.map((a) => a.id === app.id ? { ...a, status: newStatus } : a));
    const { error } = await supabase.from("applications").update({ status: newStatus }).eq("id", app.id);
    if (error) {
      setApplications((prev) => prev.map((a) => a.id === app.id ? { ...a, status: old } : a));
      toast.error("Failed to update status.");
      return;
    }
    // Log timeline event
    await supabase.from("application_timeline").insert({
      application_id: app.id,
      actor_id: profile?.id,
      event: "status_changed",
      description: `Status changed from ${old} to ${newStatus}`,
      status_from: old,
      status_to: newStatus,
    });
    if (selected?.id === app.id) setSelected({ ...selected, status: newStatus });
    toast.success(`Moved to ${newStatus.replace("_", " ")}`);
  };

  const handleDragStart = (app: Application) => { dragApp.current = app; };
  const handleDrop = (status: ApplicationStatus) => {
    if (dragApp.current && dragApp.current.status !== status) moveApp(dragApp.current, status);
    dragApp.current = null;
  };

  return (
    <div className="space-y-4 -mx-6 px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Application Pipeline</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Drag cards to move applications between stages.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading pipeline…</div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: "calc(100vh - 200px)" }}>
          {COLUMNS.map((col) => {
            const cards = byStatus(col.status);
            return (
              <div
                key={col.status}
                className="flex-shrink-0 w-64"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(col.status)}
              >
                <div className={`rounded-xl border-2 ${col.color} p-3 h-full flex flex-col gap-2`}>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-sm">{col.label}</h3>
                    <Badge variant="secondary" className="text-xs">{cards.length}</Badge>
                  </div>

                  <div className="flex-1 space-y-2 overflow-y-auto max-h-[calc(100vh-280px)]">
                    {cards.map((app) => {
                      const student = app.profiles as any;
                      const Icon = typeIcons[app.type] ?? FileText;
                      return (
                        <div
                          key={app.id}
                          draggable
                          onDragStart={() => handleDragStart(app)}
                          onClick={() => setSelected(app)}
                          className="bg-background border border-border rounded-lg p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                              <span className="text-xs font-medium truncate">{app.destination_country}</span>
                            </div>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 font-medium ${PRIORITY_COLORS[app.priority]}`}>
                              {app.priority}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {student?.full_name ?? "Unknown"}
                          </p>
                          {app.university && (
                            <p className="text-xs text-muted-foreground truncate">{app.university}</p>
                          )}
                          <p className="text-[10px] text-muted-foreground mt-1.5">
                            {new Date(app.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      );
                    })}
                    {cards.length === 0 && (
                      <div className="text-xs text-muted-foreground text-center py-4 opacity-60">Drop here</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Application detail sheet */}
      <Sheet open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <SheetContent className="w-full md:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Application Details</SheetTitle>
          </SheetHeader>
          {selected && (
            <div className="space-y-4 mt-4">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">Student</p>
                <p className="font-semibold">{(selected.profiles as any)?.full_name ?? "—"}</p>
                <p className="text-sm text-muted-foreground">{(selected.profiles as any)?.email ?? "—"}</p>
              </div>

              {[
                { label: "Type",        value: selected.type.replace("_", " ").toUpperCase() },
                { label: "Destination", value: selected.destination_country },
                { label: "University",  value: selected.university },
                { label: "Program",     value: selected.program },
                { label: "Intake",      value: selected.intake },
                { label: "Priority",    value: selected.priority },
              ].filter((r) => r.value).map((row) => (
                <div key={row.label} className="flex gap-3 text-sm">
                  <span className="text-muted-foreground w-24 shrink-0">{row.label}</span>
                  <span className="font-medium">{row.value}</span>
                </div>
              ))}

              {selected.notes && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm bg-muted rounded-lg p-3">{selected.notes}</p>
                </div>
              )}

              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground font-medium mb-2">Move to Stage</p>
                <div className="grid grid-cols-2 gap-2">
                  {COLUMNS.filter((c) => c.status !== selected.status).map((col) => (
                    <Button
                      key={col.status}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => moveApp(selected, col.status)}
                    >
                      <ChevronRight className="w-3 h-3 mr-1" /> {col.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminPipeline;
