import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/layout/Layout";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import StudyInKorea from "./pages/StudyInKorea";
import TravelServices from "./pages/TravelServices";
import DocumentUpload from "./pages/DocumentUpload";
import Blog from "./pages/Blog";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import StudentPortal from "./pages/StudentPortal";
import StudentInquiry from "./pages/StudentInquiry";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/study-in-korea" element={<StudyInKorea />} />
            <Route path="/travel-services" element={<TravelServices />} />
            <Route path="/documents" element={<DocumentUpload />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/student-inquiry" element={<StudentInquiry />} />
            <Route path="/portal" element={<StudentPortal />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
