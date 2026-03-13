import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  User, FileText, MessageSquare, CreditCard, LayoutDashboard,
  Upload, ClipboardList, Settings, Bell, LogIn, Eye, EyeOff,
  CheckCircle2, Clock, AlertCircle, Send, Paperclip, Search,
  TrendingUp, GraduationCap, Plane, Calendar, ChevronRight,
  Shield, Download, Trash2, Plus, BarChart3, Users, Globe, Filter
} from "lucide-react";

/* ─── Auth View ─── */
const AuthView = ({ onLogin }: { onLogin: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);

  return (
    <section className="min-h-[80vh] flex items-center justify-center section-padding bg-secondary">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
            Student Portal
          </h1>
          <p className="text-muted-foreground mt-2">
            {isLogin ? "Welcome back! Sign in to continue." : "Create your account to get started."}
          </p>
        </div>

        <div className="bg-background rounded-2xl p-8 shadow-elevated">
          <div className="flex rounded-lg bg-secondary p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${
                isLogin ? "bg-background shadow-card text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${
                !isLogin ? "bg-background shadow-card text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Register
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "register"}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {!isLogin && (
                <div>
                  <Label htmlFor="regName">Full Name</Label>
                  <Input id="regName" placeholder="Your full name" className="mt-1" maxLength={100} />
                </div>
              )}
              <div>
                <Label htmlFor="authEmail">Email Address</Label>
                <Input id="authEmail" type="email" placeholder="student@email.com" className="mt-1" maxLength={100} />
              </div>
              {!isLogin && (
                <div>
                  <Label htmlFor="regPhone">Phone Number</Label>
                  <Input id="regPhone" type="tel" placeholder="+977 98XXXXXXXX" className="mt-1" maxLength={20} />
                </div>
              )}
              <div>
                <Label htmlFor="authPass">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="authPass"
                    type={showPass ? "text" : "password"}
                    placeholder={isLogin ? "••••••••" : "Create a strong password"}
                    maxLength={100}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {isLogin && (
                <p className="text-xs text-accent cursor-pointer hover:underline text-right">Forgot password?</p>
              )}
              <Button variant="accent" className="w-full" size="lg" onClick={onLogin}>
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-background px-3 text-muted-foreground">or continue with</span></div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button variant="outline" size="default" className="w-full">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google
              </Button>
              <Button variant="outline" size="default" className="w-full">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                Apple
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-center mt-6 text-xs text-muted-foreground">
          <Shield className="w-3.5 h-3.5" />
          <span>Your data is encrypted and securely stored</span>
        </div>
      </motion.div>
    </section>
  );
};

/* ─── Dashboard View ─── */
const statsCards = [
  { icon: ClipboardList, label: "Applications", value: "2", sub: "1 in progress", color: "text-accent" },
  { icon: FileText, label: "Documents", value: "8", sub: "2 pending review", color: "text-success" },
  { icon: MessageSquare, label: "Messages", value: "3", sub: "unread", color: "text-destructive" },
  { icon: CreditCard, label: "Payments", value: "₹45,000", sub: "last payment", color: "text-accent" },
];

const applications = [
  { id: "APP-2024-001", university: "Korea University", program: "Computer Science", status: "in-progress", progress: 65, date: "2024-12-15" },
  { id: "APP-2024-002", university: "Yonsei University", program: "Business Admin", status: "submitted", progress: 40, date: "2024-12-20" },
];

const documents = [
  { name: "Passport Copy.pdf", size: "2.4 MB", date: "Dec 10, 2024", status: "approved" },
  { name: "Academic Transcript.pdf", size: "1.8 MB", date: "Dec 12, 2024", status: "approved" },
  { name: "SOP Draft.docx", size: "245 KB", date: "Dec 14, 2024", status: "pending" },
  { name: "Recommendation Letter.pdf", size: "890 KB", date: "Dec 15, 2024", status: "pending" },
  { name: "Bank Statement.pdf", size: "3.1 MB", date: "Dec 16, 2024", status: "rejected" },
];

const messages = [
  { sender: "Counselor Priya", time: "2 hrs ago", preview: "Your Korea University application looks great! Just need the updated bank statement.", unread: true },
  { sender: "Admin Team", time: "1 day ago", preview: "Your document 'Academic Transcript' has been verified and approved.", unread: true },
  { sender: "Counselor Priya", time: "3 days ago", preview: "Welcome to DGEC! I'll be your dedicated counselor for your Korea application.", unread: false },
];

const payments = [
  { id: "PAY-001", desc: "Counseling Fee", amount: "NPR 15,000", date: "Dec 1, 2024", status: "paid" },
  { id: "PAY-002", desc: "Application Processing", amount: "NPR 20,000", date: "Dec 10, 2024", status: "paid" },
  { id: "PAY-003", desc: "Visa Documentation", amount: "NPR 10,000", date: "Pending", status: "pending" },
];

const adminStats = [
  { icon: Users, label: "Total Students", value: "1,247" },
  { icon: ClipboardList, label: "Active Applications", value: "342" },
  { icon: Globe, label: "Countries", value: "8" },
  { icon: TrendingUp, label: "Success Rate", value: "94%" },
];

const statusIcon = (status: string) => {
  switch (status) {
    case "approved": case "paid": case "completed": return <CheckCircle2 className="w-4 h-4 text-success" />;
    case "pending": case "in-progress": case "submitted": return <Clock className="w-4 h-4 text-accent" />;
    case "rejected": return <AlertCircle className="w-4 h-4 text-destructive" />;
    default: return <Clock className="w-4 h-4 text-muted-foreground" />;
  }
};

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    "approved": "bg-success/10 text-success",
    "paid": "bg-success/10 text-success",
    "completed": "bg-success/10 text-success",
    "pending": "bg-accent/10 text-accent",
    "in-progress": "bg-accent/10 text-accent",
    "submitted": "bg-primary/10 text-primary",
    "rejected": "bg-destructive/10 text-destructive",
  };
  return map[status] || "bg-muted text-muted-foreground";
};

const DashboardView = ({ onLogout }: { onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <section className="bg-secondary min-h-screen">
      {/* Top Bar */}
      <div className="bg-background border-b border-border sticky top-0 z-30">
        <div className="container-custom flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-display font-semibold text-sm leading-tight">DGEC Portal</p>
              <p className="text-xs text-muted-foreground">Student Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
            </button>
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="w-px h-6 bg-border mx-1" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <User className="w-4 h-4 text-accent" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium leading-tight">Aarav Sharma</p>
                <p className="text-xs text-muted-foreground">Student</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-muted-foreground ml-1">
              <LogIn className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container-custom py-6 md:py-8">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
            Welcome back, Aarav 👋
          </h1>
          <p className="text-muted-foreground mt-1">Here's an overview of your applications and activity.</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-background rounded-xl p-5 shadow-card"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="font-display font-bold text-2xl">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label} · {s.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start bg-background rounded-xl p-1 shadow-card mb-6 h-auto flex-wrap">
            {[
              { value: "overview", icon: LayoutDashboard, label: "Overview" },
              { value: "documents", icon: FileText, label: "Documents" },
              { value: "messages", icon: MessageSquare, label: "Messages" },
              { value: "payments", icon: CreditCard, label: "Payments" },
              { value: "admin", icon: BarChart3, label: "Admin" },
            ].map((t) => (
              <TabsTrigger key={t.value} value={t.value} className="flex items-center gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 py-2">
                <t.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{t.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            {/* Application Progress */}
            <div className="bg-background rounded-xl shadow-card">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="font-display font-semibold text-lg">Application Progress</h2>
                <Badge variant="outline" className="text-xs">2 Active</Badge>
              </div>
              <div className="divide-y divide-border">
                {applications.map((app) => (
                  <div key={app.id} className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-semibold">{app.university}</h3>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusBadge(app.status)}`}>
                            {app.status.replace("-", " ")}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{app.program} · {app.id}</p>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Applied: {app.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={app.progress} className="flex-1 h-2" />
                      <span className="text-sm font-medium text-accent">{app.progress}%</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      {["Document Submitted", "Under Review", "Admission", "Visa", "Travel"].map((step, i) => (
                        <div key={step} className="flex-1 text-center">
                          <div className={`w-full h-1.5 rounded-full mb-1.5 ${
                            i < Math.floor(app.progress / 20) ? "bg-success" :
                            i === Math.floor(app.progress / 20) ? "bg-accent" : "bg-border"
                          }`} />
                          <p className="text-[10px] text-muted-foreground leading-tight hidden md:block">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: Upload, title: "Upload Document", desc: "Submit required documents", color: "bg-accent/10 text-accent" },
                { icon: MessageSquare, title: "Message Counselor", desc: "Get help from your advisor", color: "bg-success/10 text-success" },
                { icon: Plane, title: "Travel Planning", desc: "Pre-departure checklist", color: "bg-primary/10 text-primary" },
              ].map((a) => (
                <button key={a.title} className="bg-background rounded-xl p-5 shadow-card text-left hover:shadow-elevated transition-shadow group">
                  <div className={`w-10 h-10 rounded-lg ${a.color} flex items-center justify-center mb-3`}>
                    <a.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-semibold text-sm">{a.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
                </button>
              ))}
            </div>
          </TabsContent>

          {/* DOCUMENTS TAB */}
          <TabsContent value="documents" className="space-y-6">
            <div className="bg-background rounded-xl shadow-card">
              <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="font-display font-semibold text-lg">My Documents</h2>
                <div className="flex gap-2">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search documents..." className="pl-9 h-9" />
                  </div>
                  <Button variant="accent" size="sm">
                    <Plus className="w-4 h-4 mr-1" /> Upload
                  </Button>
                </div>
              </div>

              {/* Upload area */}
              <div className="p-6 border-b border-border">
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-accent/50 transition-colors">
                  <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-medium text-foreground mb-1">Drag & drop files here</p>
                  <p className="text-xs text-muted-foreground mb-3">PDF, JPG, PNG, DOC, DOCX up to 10MB</p>
                  <Button variant="outline" size="sm">Browse Files</Button>
                </div>
              </div>

              {/* Document list */}
              <div className="divide-y divide-border">
                {documents.map((doc) => (
                  <div key={doc.name} className="p-4 px-6 flex items-center justify-between hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.size} · {doc.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge(doc.status)}`}>
                        {statusIcon(doc.status)}
                        <span className="capitalize">{doc.status}</span>
                      </span>
                      <div className="flex gap-1">
                        <button className="p-1.5 rounded-md hover:bg-secondary transition-colors">
                          <Download className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* MESSAGES TAB */}
          <TabsContent value="messages" className="space-y-6">
            <div className="grid lg:grid-cols-5 gap-6">
              {/* Message List */}
              <div className="lg:col-span-2 bg-background rounded-xl shadow-card">
                <div className="p-4 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search messages..." className="pl-9 h-9" />
                  </div>
                </div>
                <div className="divide-y divide-border">
                  {messages.map((m, i) => (
                    <button
                      key={i}
                      className={`w-full text-left p-4 hover:bg-secondary/50 transition-colors ${
                        i === 0 ? "bg-accent/5" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold truncate">{m.sender}</p>
                            <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{m.time}</span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{m.preview}</p>
                        </div>
                        {m.unread && <span className="w-2 h-2 rounded-full bg-accent shrink-0 mt-2" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Detail */}
              <div className="lg:col-span-3 bg-background rounded-xl shadow-card flex flex-col min-h-[400px]">
                <div className="p-4 border-b border-border flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Counselor Priya</p>
                    <p className="text-xs text-success">Online</p>
                  </div>
                </div>
                <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                  <div className="flex justify-start">
                    <div className="bg-secondary rounded-2xl rounded-tl-md px-4 py-3 max-w-[80%]">
                      <p className="text-sm">Welcome to DGEC! I'll be your dedicated counselor. How can I help you today?</p>
                      <p className="text-[10px] text-muted-foreground mt-1">3 days ago</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-md px-4 py-3 max-w-[80%]">
                      <p className="text-sm">Hi! I need help with my Korea University application documents.</p>
                      <p className="text-[10px] text-primary-foreground/60 mt-1">3 days ago</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-secondary rounded-2xl rounded-tl-md px-4 py-3 max-w-[80%]">
                      <p className="text-sm">Your application looks great! Just need the updated bank statement. Can you upload it through the documents tab?</p>
                      <p className="text-[10px] text-muted-foreground mt-1">2 hrs ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                      <Paperclip className="w-5 h-5 text-muted-foreground" />
                    </button>
                    <Input placeholder="Type your message..." className="flex-1" />
                    <Button variant="accent" size="icon">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* PAYMENTS TAB */}
          <TabsContent value="payments" className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4 mb-2">
              <div className="bg-background rounded-xl p-5 shadow-card">
                <p className="text-xs text-muted-foreground mb-1">Total Paid</p>
                <p className="font-display font-bold text-2xl text-success">NPR 35,000</p>
              </div>
              <div className="bg-background rounded-xl p-5 shadow-card">
                <p className="text-xs text-muted-foreground mb-1">Pending</p>
                <p className="font-display font-bold text-2xl text-accent">NPR 10,000</p>
              </div>
              <div className="bg-background rounded-xl p-5 shadow-card">
                <p className="text-xs text-muted-foreground mb-1">Next Due</p>
                <p className="font-display font-bold text-2xl text-foreground">Jan 15, 2025</p>
              </div>
            </div>

            <div className="bg-background rounded-xl shadow-card">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="font-display font-semibold text-lg">Payment History</h2>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" /> Export
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">ID</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Description</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Amount</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Date</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                        <td className="p-4 text-sm font-mono text-muted-foreground">{p.id}</td>
                        <td className="p-4 text-sm font-medium">{p.desc}</td>
                        <td className="p-4 text-sm font-semibold">{p.amount}</td>
                        <td className="p-4 text-sm text-muted-foreground">{p.date}</td>
                        <td className="p-4">
                          <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full w-fit ${statusBadge(p.status)}`}>
                            {statusIcon(p.status)}
                            <span className="capitalize">{p.status}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-6 border-t border-border text-center">
                <Button variant="accent" size="lg">
                  <CreditCard className="w-4 h-4 mr-2" /> Make Payment
                </Button>
                <p className="text-xs text-muted-foreground mt-2">Secure payment powered by trusted gateway</p>
              </div>
            </div>
          </TabsContent>

          {/* ADMIN TAB */}
          <TabsContent value="admin" className="space-y-6">
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-center gap-3">
              <Shield className="w-5 h-5 text-accent shrink-0" />
              <p className="text-sm text-foreground">
                <strong>Admin Dashboard Preview</strong> — This is a UI concept for authorized administrators. Full functionality coming soon.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {adminStats.map((s) => (
                <div key={s.label} className="bg-background rounded-xl p-5 shadow-card">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <s.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="font-display font-bold text-2xl">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Applications */}
              <div className="bg-background rounded-xl shadow-card">
                <div className="p-5 border-b border-border flex items-center justify-between">
                  <h3 className="font-display font-semibold">Recent Applications</h3>
                  <Button variant="ghost" size="sm"><Filter className="w-4 h-4 mr-1" /> Filter</Button>
                </div>
                <div className="divide-y divide-border">
                  {[
                    { name: "Aarav Sharma", country: "South Korea", status: "in-progress" },
                    { name: "Sita Gurung", country: "Japan", status: "approved" },
                    { name: "Bikash Thapa", country: "South Korea", status: "pending" },
                    { name: "Anita Rai", country: "Australia", status: "submitted" },
                  ].map((a) => (
                    <div key={a.name} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                          <User className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{a.name}</p>
                          <p className="text-xs text-muted-foreground">{a.country}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusBadge(a.status)}`}>
                        {a.status.replace("-", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Admin Actions */}
              <div className="bg-background rounded-xl shadow-card">
                <div className="p-5 border-b border-border">
                  <h3 className="font-display font-semibold">Quick Actions</h3>
                </div>
                <div className="p-5 grid grid-cols-2 gap-3">
                  {[
                    { icon: Users, label: "Manage Students" },
                    { icon: FileText, label: "Review Documents" },
                    { icon: MessageSquare, label: "All Messages" },
                    { icon: CreditCard, label: "Payment Reports" },
                    { icon: BarChart3, label: "Analytics" },
                    { icon: Settings, label: "Settings" },
                  ].map((a) => (
                    <button key={a.label} className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-secondary transition-colors text-left">
                      <a.icon className="w-4 h-4 text-accent" />
                      <span className="text-sm font-medium">{a.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

/* ─── Main Component ─── */
const StudentPortal = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  return loggedIn ? (
    <DashboardView onLogout={() => setLoggedIn(false)} />
  ) : (
    <AuthView onLogin={() => setLoggedIn(true)} />
  );
};

export default StudentPortal;
