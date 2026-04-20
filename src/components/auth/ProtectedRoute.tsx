import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  children: React.ReactNode;
  requireStaff?: boolean;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireStaff = false, requireAdmin = false }: Props) => {
  const { isAuthenticated, isStaff, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/portal/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/portal/dashboard" replace />;
  }

  if (requireStaff && !isStaff) {
    return <Navigate to="/portal/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
