import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Supabase automatically exchanges the code/token from the URL.
    // We just need to wait for the session to be established, then redirect by role.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        // Fetch profile to determine role
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          setError("Failed to load your profile. Please try again.");
          return;
        }
        const role = profile?.role ?? "student";
        if (["admin", "super_admin", "staff"].includes(role)) {
          navigate("/admin", { replace: true });
        } else {
          navigate("/portal/dashboard", { replace: true });
        }
      } else if (event === "SIGNED_OUT") {
        navigate("/portal/login", { replace: true });
      }
    });

    // Handle error in URL (e.g. user denied Google permission)
    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const err = params.get("error_description") || hashParams.get("error_description");
    if (err) setError(err);

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
        <div className="bg-background rounded-2xl p-8 shadow-lg border border-border max-w-sm w-full text-center">
          <p className="text-destructive font-medium mb-4">Login failed</p>
          <p className="text-sm text-muted-foreground mb-6">{error}</p>
          <a href="/portal/login" className="text-primary text-sm hover:underline">
            ← Back to login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Completing sign in…</p>
      </div>
    </div>
  );
};

export default AuthCallback;
