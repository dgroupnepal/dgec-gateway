import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList } from "lucide-react";

interface AuditEntry {
  id: string;
  actor_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  ip_address: string | null;
  created_at: string;
  profiles?: { full_name: string | null; email: string };
}

const AdminAuditLog = () => {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("audit_logs")
      .select("*, profiles!actor_id(full_name, email)")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data }) => {
        if (data) setLogs(data as AuditEntry[]);
        setLoading(false);
      });
  }, []);

  const actionColor = (action: string) => {
    if (action.includes("delete") || action.includes("reject")) return "bg-red-100 text-red-700";
    if (action.includes("approve") || action.includes("paid")) return "bg-green-100 text-green-700";
    if (action.includes("create") || action.includes("insert")) return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Audit Log</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Track all admin actions for accountability.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="p-4 font-medium">Time</th>
                  <th className="p-4 font-medium">Actor</th>
                  <th className="p-4 font-medium">Action</th>
                  <th className="p-4 font-medium hidden md:table-cell">Resource</th>
                  <th className="p-4 font-medium hidden lg:table-cell">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">Loading…</td></tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-40 text-muted-foreground" />
                      <p className="text-muted-foreground">No audit entries yet.</p>
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/40">
                      <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <p className="text-xs font-medium">{log.profiles?.full_name ?? "System"}</p>
                        <p className="text-xs text-muted-foreground">{log.profiles?.email ?? "—"}</p>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${actionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4 hidden md:table-cell text-xs">
                        <span className="text-muted-foreground">{log.resource_type}</span>
                        {log.resource_id && <span className="ml-1 font-mono">{log.resource_id.slice(0, 8)}…</span>}
                      </td>
                      <td className="p-4 hidden lg:table-cell text-xs text-muted-foreground">{log.ip_address ?? "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuditLog;
