import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SectionHeader from "@/components/SectionHeader";
import { Link } from "react-router-dom";
import {
  User, FileText, MessageSquare, CreditCard, LayoutDashboard,
  Upload, ClipboardList, Settings, Bell, LogIn
} from "lucide-react";

const dashboardCards = [
  { icon: ClipboardList, title: "Application Status", desc: "Track your admission and visa application progress in real-time.", status: "2 Active" },
  { icon: FileText, title: "Documents", desc: "View and manage all your uploaded documents.", status: "5 Files" },
  { icon: MessageSquare, title: "Messages", desc: "Communicate directly with your DGEC counselor.", status: "3 Unread" },
  { icon: CreditCard, title: "Payments", desc: "View payment history and pending invoices.", status: "Paid" },
];

const StudentPortal = () => {
  return (
    <>
      <section className="bg-primary section-padding">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent font-medium text-sm mb-4">Coming Soon</span>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-primary-foreground mb-6">
              Student Portal
            </h1>
            <p className="text-primary-foreground/70 text-lg">
              A preview of our upcoming student portal — track applications, manage documents, communicate with counselors, and more.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-secondary">
        <div className="container-custom max-w-5xl">
          {/* Login / Register */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-background rounded-xl p-8 shadow-card">
              <div className="flex items-center gap-2 mb-6">
                <LogIn className="w-5 h-5 text-accent" />
                <h2 className="font-display font-bold text-xl">Student Login</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="loginEmail">Email</Label>
                  <Input id="loginEmail" type="email" placeholder="student@email.com" className="mt-1" maxLength={100} />
                </div>
                <div>
                  <Label htmlFor="loginPass">Password</Label>
                  <Input id="loginPass" type="password" placeholder="••••••••" className="mt-1" maxLength={100} />
                </div>
                <Button variant="accent" className="w-full">Login</Button>
                <p className="text-xs text-muted-foreground text-center">Forgot password?</p>
              </div>
            </div>
            <div className="bg-background rounded-xl p-8 shadow-card">
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-accent" />
                <h2 className="font-display font-bold text-xl">Register</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="regName">Full Name</Label>
                  <Input id="regName" placeholder="Your full name" className="mt-1" maxLength={100} />
                </div>
                <div>
                  <Label htmlFor="regEmail">Email</Label>
                  <Input id="regEmail" type="email" placeholder="student@email.com" className="mt-1" maxLength={100} />
                </div>
                <div>
                  <Label htmlFor="regPass">Password</Label>
                  <Input id="regPass" type="password" placeholder="Create password" className="mt-1" maxLength={100} />
                </div>
                <Button variant="default" className="w-full">Create Account</Button>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <SectionHeader badge="Dashboard Preview" title="Your Student Dashboard" description="A glimpse of what you'll have access to as a DGEC student." />
          
          {/* Stats bar */}
          <div className="bg-background rounded-xl p-4 shadow-card mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <User className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-display font-semibold text-sm">Welcome, Student</p>
                <p className="text-xs text-muted-foreground">Last login: Today</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
              </button>
              <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                <Settings className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {dashboardCards.map((card) => (
              <div key={card.title} className="bg-background rounded-xl p-6 shadow-card">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <card.icon className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="font-display font-semibold">{card.title}</h3>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-success/10 text-success">{card.status}</span>
                </div>
                <p className="text-muted-foreground text-sm">{card.desc}</p>
              </div>
            ))}
          </div>

          {/* Application Status */}
          <div className="bg-background rounded-xl p-6 shadow-card mb-6">
            <h3 className="font-display font-semibold text-lg mb-4">Application Progress</h3>
            <div className="space-y-4">
              {[
                { step: "Document Submission", status: "completed" },
                { step: "Application Review", status: "completed" },
                { step: "Admission Confirmation", status: "current" },
                { step: "Visa Processing", status: "pending" },
                { step: "Travel Preparation", status: "pending" },
              ].map((s) => (
                <div key={s.step} className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full shrink-0 ${
                    s.status === "completed" ? "bg-success" : s.status === "current" ? "bg-accent animate-pulse" : "bg-border"
                  }`} />
                  <span className={`text-sm ${s.status === "pending" ? "text-muted-foreground" : "text-foreground font-medium"}`}>{s.step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Placeholder */}
          <div className="bg-background rounded-xl p-6 shadow-card border-2 border-dashed border-border text-center">
            <LayoutDashboard className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-display font-semibold text-lg mb-2">Admin Dashboard</h3>
            <p className="text-muted-foreground text-sm mb-4">Admin panel for managing students, applications, and documents — coming soon.</p>
            <span className="px-4 py-1.5 rounded-full bg-accent/10 text-accent font-medium text-xs">In Development</span>
          </div>
        </div>
      </section>
    </>
  );
};

export default StudentPortal;
