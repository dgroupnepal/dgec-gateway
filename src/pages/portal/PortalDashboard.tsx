import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Application, AppNotification, Payment } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText, Bell, CreditCard, MessageSquare, Upload,
  CheckCircle2, Clock, AlertCircle, XCircle, ArrowRight,
  GraduationCap, Plane, Shield
} from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  inquiry: { label: "Inquiry", color: "bg-blue-100 text-blue-800", icon: Clock },
  documents_pending: { label: "Docs Needed", color: "bg-yellow-100 text-yellow-800", icon: AlertCircle },
  under_review: { label: "Under Review", color: "bg-purple-100 text-purple-800", icon: Clock },
  approved: { label: "Approved", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800", icon: XCircle },
  visa_processing: { label: "Visa Processing", color: "bg-indigo-100 text-indigo-800", icon: Clock },
  completed: { label: "Completed", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-800", icon: XCircle },
};

const typeIcons: Record<string, React.ElementType> = {
  visa: Shield,
  university: GraduationCap,
  air_ticket: Plane,
  insurance: Shield,
  other: FileText,
};

const PortalDashboard = () => {
  const { profile } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    const load = async () => {
      const [appsRes, notifRes, payRes] = await Promise.all([
        supabase.from("applications").select("*").eq("student_id", profile.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("notifications").select("*").eq("user_id", profile.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("payments").select("*").eq("student_id", profile.id).order("created_at", { ascending: false }).limit(4),
      ]);
      if (appsRes.data) setApplications(appsRes.data as Application[]);
      if (notifRes.data) setNotifications(notifRes.data as AppNotification[]);
      if (payRes.data) setPayments(payRes.data as Payment[]);
      setLoading(false);
    };
    load();
  }, [profile]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const pendingPayments = payments.filter((p) => p.status === "pending" || p.status === "overdue");

  const quickLinks = [
    { label: "My Documents", to: "/portal/documents", icon: Upload, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Messages", to: "/portal/messages", icon: MessageSquare, color: "text-green-600", bg: "bg-green-50" },
    { label: "Payments", to: "/portal/payments", icon: CreditCard, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "My Profile", to: "/portal/profile", icon: FileText, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="space-y-6 section-padding">
      <div className="container-custom">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Welcome back, {profile?.full_name?.split(" ")[0] ?? "Student"} 👋
            </h1>
            <p className="text-muted-foreground mt-1">Track your applications and stay updated.</p>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <Badge className="bg-primary text-primary-foreground">
                <Bell className="w-3 h-3 mr-1" /> {unreadCount} new
              </Badge>
            )}
            <Button asChild>
              <Link to="/portal/messages">
                <MessageSquare className="w-4 h-4 mr-2" /> Contact DGEC
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {quickLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="flex flex-col items-center justify-center p-4 gap-2 text-center">
                  <div className={`w-10 h-10 rounded-xl ${link.bg} flex items-center justify-center`}>
                    <link.icon className={`w-5 h-5 ${link.color}`} />
                  </div>
                  <span className="text-sm font-medium">{link.label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Applications */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">My Applications</h2>
              <Link to="/portal/applications" className="text-primary text-sm flex items-center gap-1 hover:underline">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i}><CardContent className="p-4 h-20 animate-pulse bg-muted rounded-lg" /></Card>
                ))}
              </div>
            ) : applications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <GraduationCap className="w-12 h-12 text-muted-foreground mb-3" />
                  <p className="font-medium text-foreground">No applications yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Submit an inquiry to start your journey.</p>
                  <Button asChild className="mt-4">
                    <Link to="/student-inquiry">Start Application</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => {
                  const cfg = statusConfig[app.status] ?? statusConfig.inquiry;
                  const Icon = typeIcons[app.type] ?? FileText;
                  const StatusIcon = cfg.icon;
                  return (
                    <motion.div key={app.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="flex items-center gap-4 p-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {app.type.replace("_", " ").toUpperCase()} — {app.destination_country}
                            </p>
                            {app.university && (
                              <p className="text-xs text-muted-foreground truncate">{app.university}</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {new Date(app.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 shrink-0 ${cfg.color}`}>
                            <StatusIcon className="w-3 h-3" /> {cfg.label}
                          </span>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Notifications */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell className="w-4 h-4" /> Notifications
                  {unreadCount > 0 && <Badge className="ml-auto">{unreadCount}</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No notifications</p>
                ) : (
                  notifications.slice(0, 4).map((n) => (
                    <div key={n.id} className={`text-sm p-2 rounded-lg border ${!n.read ? "bg-primary/5 border-primary/20" : "border-transparent"}`}>
                      <p className="font-medium text-xs">{n.title}</p>
                      <p className="text-muted-foreground text-xs mt-0.5 line-clamp-2">{n.body}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Payments Due */}
            {pendingPayments.length > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2 text-orange-700">
                    <CreditCard className="w-4 h-4" /> Payment Due
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {pendingPayments.map((p) => (
                    <div key={p.id} className="text-sm">
                      <p className="font-medium text-orange-800">{p.description}</p>
                      <p className="text-orange-600 font-bold">NPR {p.amount_npr.toLocaleString()}</p>
                      {p.due_date && (
                        <p className="text-xs text-orange-500">Due: {new Date(p.due_date).toLocaleDateString()}</p>
                      )}
                    </div>
                  ))}
                  <Button asChild size="sm" className="w-full mt-2">
                    <Link to="/portal/payments">View Payments</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalDashboard;
