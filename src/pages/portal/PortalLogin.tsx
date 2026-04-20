import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Eye, EyeOff, Chrome } from "lucide-react";
import { toast } from "sonner";

const PortalLogin = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/portal/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "login") {
      const { error } = await signInWithEmail(email, password);
      if (error) { toast.error(error); setLoading(false); return; }
      navigate(from, { replace: true });
    } else {
      if (!fullName.trim()) { toast.error("Full name is required"); setLoading(false); return; }
      const { error } = await signUpWithEmail(email, password, fullName);
      if (error) { toast.error(error); setLoading(false); return; }
      toast.success("Account created! Check your email to confirm.");
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    const { error } = await signInWithGoogle();
    if (error) toast.error(error);
  };

  return (
    <section className="min-h-[80vh] flex items-center justify-center section-padding bg-secondary">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
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
            {mode === "login" ? "Welcome back! Sign in to continue." : "Create your DGEC account."}
          </p>
        </div>

        <div className="bg-background rounded-2xl p-8 shadow-lg border border-border">
          <div className="flex rounded-lg bg-secondary p-1 mb-6">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === m ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Ram Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@example.com"
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
                  minLength={8}
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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs text-muted-foreground">
              <span className="bg-background px-2">or continue with</span>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={handleGoogle}>
            <Chrome className="w-4 h-4 mr-2" />
            Google
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Need help?{" "}
            <Link to="/contact" className="text-primary font-medium hover:underline">
              Contact DGEC
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default PortalLogin;
