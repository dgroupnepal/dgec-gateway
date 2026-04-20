import { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, Users, GitBranch, FileText, MessageSquare,
  CreditCard, Menu, X, LogOut, ChevronDown, Shield, Bell, ClipboardList
} from "lucide-react";
import WhatsAppWidget from "@/components/WhatsAppWidget";

const navItems = [
  { to: "/admin",            label: "Dashboard",  icon: LayoutDashboard, exact: true },
  { to: "/admin/students",   label: "Students",   icon: Users },
  { to: "/admin/pipeline",   label: "Pipeline",   icon: GitBranch },
  { to: "/admin/documents",  label: "Documents",  icon: FileText },
  { to: "/admin/messages",   label: "Messages",   icon: MessageSquare },
  { to: "/admin/payments",   label: "Payments",   icon: CreditCard },
  { to: "/admin/audit",      label: "Audit Log",  icon: ClipboardList },
];

const AdminLayout = () => {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const initials = profile?.full_name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "AD";

  const isActive = (item: typeof navItems[0]) =>
    item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-background border-r border-border z-50 flex flex-col
        transition-transform duration-300 md:static md:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-foreground">DGEC Admin</p>
              <p className="text-xs text-muted-foreground capitalize">{profile?.role}</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="md:hidden text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2 mb-2 px-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={profile?.avatar_url ?? undefined} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{profile?.full_name ?? "Admin"}</p>
              <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground hover:text-foreground" onClick={handleSignOut}>
            <LogOut className="w-3 h-3 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 border-b border-border flex items-center gap-3 px-4 bg-background shrink-0">
          <button
            onClick={() => setOpen(true)}
            className="md:hidden text-muted-foreground hover:text-foreground p-1"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Bell className="w-4 h-4" />
          </Button>
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
            ← Main Site
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      <WhatsAppWidget />
    </div>
  );
};

export default AdminLayout;
