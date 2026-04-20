import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Layout from "@/components/layout/Layout";
import ScrollToTop from "@/components/ScrollToTop";

// Public pages
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import StudyInKorea from "./pages/StudyInKorea";
import TravelServices from "./pages/TravelServices";
import DocumentUpload from "./pages/DocumentUpload";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import StudentInquiry from "./pages/StudentInquiry";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import Disclaimer from "./pages/Disclaimer";
import NotFound from "./pages/NotFound";

// Student Portal
import PortalLogin from "./pages/portal/PortalLogin";
import PortalDashboard from "./pages/portal/PortalDashboard";
import PortalProfile from "./pages/portal/PortalProfile";
import PortalDocuments from "./pages/portal/PortalDocuments";
import PortalMessages from "./pages/portal/PortalMessages";
import PortalPayments from "./pages/portal/PortalPayments";

// Admin Portal
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminPipeline from "./pages/admin/AdminPipeline";
import AdminDocVerification from "./pages/admin/AdminDocVerification";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminAuditLog from "./pages/admin/AdminAuditLog";
import AdminUploads from "./pages/admin/AdminUploads";
import AdminUploadDetails from "./pages/admin/AdminUploadDetails";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

/** Thin wrapper: public page inside the main site layout */
const PL = ({ page: Page }: { page: React.ComponentType }) => (
  <Layout><Page /></Layout>
);

/** Portal page: auth-gated, inside main layout */
const PortalPage = ({ page: Page }: { page: React.ComponentType }) => (
  <ProtectedRoute>
    <Layout><Page /></Layout>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            {/* ── Public marketing site ── */}
            <Route path="/"                element={<PL page={Index} />} />
            <Route path="/about"           element={<PL page={About} />} />
            <Route path="/services"        element={<PL page={Services} />} />
            <Route path="/study-in-korea"  element={<PL page={StudyInKorea} />} />
            <Route path="/travel-services" element={<PL page={TravelServices} />} />
            <Route path="/documents"       element={<PL page={DocumentUpload} />} />
            <Route path="/blog"            element={<PL page={Blog} />} />
            <Route path="/blog/:slug"      element={<PL page={BlogPost} />} />
            <Route path="/faq"             element={<PL page={FAQ} />} />
            <Route path="/contact"         element={<PL page={Contact} />} />
            <Route path="/student-inquiry" element={<PL page={StudentInquiry} />} />
            <Route path="/privacy"         element={<PL page={PrivacyPolicy} />} />
            <Route path="/terms"           element={<PL page={TermsConditions} />} />
            <Route path="/disclaimer"      element={<PL page={Disclaimer} />} />

            {/* ── Student Portal ── */}
            <Route path="/portal"               element={<Navigate to="/portal/login" replace />} />
            <Route path="/portal/login"         element={<PortalLogin />} />
            <Route path="/portal/dashboard"     element={<PortalPage page={PortalDashboard} />} />
            <Route path="/portal/profile"       element={<PortalPage page={PortalProfile} />} />
            <Route path="/portal/documents"     element={<PortalPage page={PortalDocuments} />} />
            <Route path="/portal/messages"      element={<PortalPage page={PortalMessages} />} />
            <Route path="/portal/payments"      element={<PortalPage page={PortalPayments} />} />

            {/* ── Admin Portal ── */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireStaff>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index             element={<AdminAnalytics />} />
              <Route path="students"   element={<AdminStudents />} />
              <Route path="pipeline"   element={<AdminPipeline />} />
              <Route path="documents"  element={<AdminDocVerification />} />
              <Route path="messages"   element={<AdminMessages />} />
              <Route path="payments"   element={<AdminPayments />} />
              <Route path="audit"      element={<AdminAuditLog />} />
              <Route path="uploads"    element={<AdminUploads />} />
              <Route path="uploads/:id" element={<AdminUploadDetails />} />
            </Route>

            <Route path="*" element={<PL page={NotFound} />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
