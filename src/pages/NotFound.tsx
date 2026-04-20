import { Link, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, MessageCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  // Redirect sub-portal paths to the portal entry point gracefully
  if (location.pathname.startsWith("/portal/")) {
    return <Navigate to="/portal" replace />;
  }

  return (
    <section className="min-h-[70vh] flex items-center justify-center section-padding">
      <div className="container-custom text-center max-w-lg">
        <p className="font-display font-bold text-8xl text-accent mb-4">404</p>
        <h1 className="font-display font-bold text-2xl md:text-3xl mb-3">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved. Let us help you find what you need.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="accent" size="lg" asChild>
            <Link to="/"><Home className="w-4 h-4" /> Go to Home</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/contact"><ArrowLeft className="w-4 h-4" /> Contact Us</Link>
          </Button>
          <Button variant="whatsapp" size="lg" asChild>
            <a href="https://wa.me/9779868780019" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
