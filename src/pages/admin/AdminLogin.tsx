import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loginPending, setLoginPending] = useState(false);

  const {
    signInWithEmail, isAuthenticated, isStaff, loading: authLoading,
  } = useAuth();
  const navigate = useNavigate();

  // Redirect already-authenticated users immediately
  useEffect(() => {
    if (!authLoading && isAuthenticated && !loginPending) {
      navigate(isStaff ? "/admin" : "/portal/dashboard", { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated]);

  // After fresh login, wait for profile then redirect by role
  useEffect(() => {
    if (loginPending && !authLoading && isAuthenticated) {
      setLoginPending(false);
      if (isStaff) {
        navigate("/admin", { replace: true });
      } else {
        toast.error("Access denied. This login is for staff only.");
        navigate("/portal/login", { replace: true });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginPending, authLoading, isAuthenticated, isStaff]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signInWithEmail(email, password);
    if (error) {
      toast.error(error);
      setSubmitting(false);
      return;
    }
    setLoginPending(true);
    setSubmitting(false);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="font-display font-bold text-2xl text-foreground">DGEC Admin</h1>
          <p className="text-muted-foreground text-sm mt-1">Staff access only</p>
        </div>

        <div className="bg-background rounded-2xl p-8 shadow-lg border border-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@dgroupeducation.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={submitting || loginPending}>
              {submitting || loginPending ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Are you a student?{" "}
            <Link to="/portal/login" className="text-primary font-medium hover:underline">
              Student login →
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default AdminLogin;
