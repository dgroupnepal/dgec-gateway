import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Users, FileText, CreditCard, MessageSquare, TrendingUp, CheckCircle2 } from "lucide-react";

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

const AdminAnalytics = () => {
  const [stats, setStats] = useState({
    totalStudents: 0, totalApplications: 0, pendingDocuments: 0,
    openMessages: 0, totalRevenue: 0, completedApplications: 0,
  });
  const [appsByStatus, setAppsByStatus] = useState<{ status: string; count: number }[]>([]);
  const [appsByType, setAppsByType] = useState<{ type: string; count: number }[]>([]);
  const [revenueByMonth, setRevenueByMonth] = useState<{ month: string; amount: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [studentsRes, appsRes, docsRes, threadsRes, paymentsRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact" }).eq("role", "student"),
        supabase.from("applications").select("status, type"),
        supabase.from("documents").select("id", { count: "exact" }).eq("status", "pending"),
        supabase.from("message_threads").select("id", { count: "exact" }).eq("status", "open"),
        supabase.from("payments").select("amount_npr, status, created_at"),
      ]);

      const studentCount = studentsRes.count ?? 0;
      type AppRow = { status: string; type: string };
      type PayRow = { amount_npr: number; status: string; created_at: string };

      const apps = (appsRes.data ?? []) as AppRow[];
      const docCount = docsRes.count ?? 0;
      const threadCount = threadsRes.count ?? 0;
      const payments = (paymentsRes.data ?? []) as PayRow[];

      const totalRevenue = payments
        .filter((p) => p.status === "paid")
        .reduce((sum, p) => sum + (p.amount_npr ?? 0), 0);

      const completedApps = apps.filter((a) => a.status === "completed").length;

      setStats({
        totalStudents: studentCount,
        totalApplications: apps.length,
        pendingDocuments: docCount,
        openMessages: threadCount,
        totalRevenue,
        completedApplications: completedApps,
      });

      // Status breakdown
      const statusCounts: Record<string, number> = {};
      apps.forEach((a) => { statusCounts[a.status] = (statusCounts[a.status] ?? 0) + 1; });
      setAppsByStatus(Object.entries(statusCounts).map(([status, count]) => ({ status, count })));

      // Type breakdown
      const typeCounts: Record<string, number> = {};
      apps.forEach((a) => { typeCounts[a.type] = (typeCounts[a.type] ?? 0) + 1; });
      setAppsByType(Object.entries(typeCounts).map(([type, count]) => ({ type, count })));

      // Revenue by month (last 6 months)
      const months: Record<string, number> = {};
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months[d.toLocaleString("default", { month: "short" })] = 0;
      }
      payments
        .filter((p) => p.status === "paid")
        .forEach((p) => {
          const month = new Date(p.created_at).toLocaleString("default", { month: "short" });
          if (month in months) months[month] += p.amount_npr ?? 0;
        });
      setRevenueByMonth(Object.entries(months).map(([month, amount]) => ({ month, amount })));

      setLoading(false);
    };
    load();
  }, []);

  const statCards = [
    { label: "Total Students",    value: stats.totalStudents,       icon: Users,         color: "text-blue-600",   bg: "bg-blue-50" },
    { label: "Applications",      value: stats.totalApplications,   icon: FileText,      color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Pending Docs",      value: stats.pendingDocuments,    icon: FileText,      color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Open Messages",     value: stats.openMessages,        icon: MessageSquare, color: "text-green-600",  bg: "bg-green-50" },
    { label: "Completed",         value: stats.completedApplications, icon: CheckCircle2, color: "text-teal-600", bg: "bg-teal-50" },
    { label: "Revenue (NPR)",     value: `${(stats.totalRevenue / 1000).toFixed(0)}K`, icon: CreditCard, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-0.5">DGEC operations overview.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="p-4">
              <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center mb-2`}>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <p className="text-2xl font-bold">{loading ? "…" : card.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Monthly Revenue (NPR)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: number) => [`NPR ${v.toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Application Status Pie */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Application Status</CardTitle>
          </CardHeader>
          <CardContent>
            {appsByStatus.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">No data</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={appsByStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                    {appsByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Applications by Type */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Applications by Type</CardTitle>
          </CardHeader>
          <CardContent>
            {appsByType.length === 0 ? (
              <div className="h-[160px] flex items-center justify-center text-muted-foreground text-sm">No data</div>
            ) : (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={appsByType} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="type" type="category" tick={{ fontSize: 11 }} width={80} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: "Review Pending Documents", to: "/admin/documents", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
              { label: "Open Support Threads",     to: "/admin/messages",  color: "bg-green-50 text-green-700 border-green-200" },
              { label: "Overdue Payments",         to: "/admin/payments",  color: "bg-red-50 text-red-700 border-red-200" },
              { label: "View Pipeline",            to: "/admin/pipeline",  color: "bg-blue-50 text-blue-700 border-blue-200" },
            ].map((item) => (
              <a
                key={item.to}
                href={item.to}
                className={`block text-sm px-3 py-2.5 rounded-lg border font-medium transition-opacity hover:opacity-80 ${item.color}`}
              >
                {item.label} →
              </a>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
