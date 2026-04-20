import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import SocialIcons from "@/components/SocialIcons";

const navItems = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Study in Korea", path: "/study-in-korea" },
  { label: "Travel Services", path: "/travel-services" },
  { label: "Blog", path: "/blog" },
  { label: "FAQ", path: "/faq" },
  { label: "Contact", path: "/contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Top bar with social icons & contact */}
      <div className="hidden lg:block bg-primary text-primary-foreground text-xs">
        <div className="container-custom flex items-center justify-between h-9">
          <div className="flex items-center gap-4">
            <a href="tel:+977015927395" className="hover:text-accent transition-colors">+977-01-5927395</a>
            <span className="text-primary-foreground/30">|</span>
            <a href="mailto:info@dgroup.edu.np" className="hover:text-accent transition-colors">info@dgroup.edu.np</a>
          </div>
          <SocialIcons variant="light" size="sm" />
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
        <div className="container-custom flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/images/dgec-logo.png" alt="DGEC Logo" className="h-12 md:h-14 w-auto" />
            <div>
              <span className="font-display font-bold text-lg leading-tight text-primary block">DGEC</span>
              <span className="text-[10px] text-muted-foreground leading-none hidden sm:block">D Group Education Consultancy</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === item.path
                    ? "bg-secondary text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/portal">
                <LogIn className="w-4 h-4 mr-1" /> Student Portal
              </Link>
            </Button>
            <Button variant="accent" size="sm" asChild>
              <Link to="/student-inquiry">Apply Now</Link>
            </Button>
            <Button variant="whatsapp" size="sm" asChild>
              <a href="https://wa.me/9779868780019" target="_blank" rel="noopener noreferrer">
                <Phone className="w-4 h-4" /> WhatsApp
              </a>
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-md text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-background">
            <nav className="container-custom py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? "bg-secondary text-primary"
                      : "text-muted-foreground hover:bg-secondary/50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/portal" onClick={() => setMobileOpen(false)}>
                    <LogIn className="w-4 h-4 mr-1" /> Student Portal
                  </Link>
                </Button>
                <Button variant="accent" size="sm" className="w-full" asChild>
                  <Link to="/student-inquiry" onClick={() => setMobileOpen(false)}>Apply Now</Link>
                </Button>
                <Button variant="whatsapp" size="sm" className="w-full" asChild>
                  <a href="https://wa.me/9779868780019" target="_blank" rel="noopener noreferrer">WhatsApp Us</a>
                </Button>
                <div className="flex justify-center pt-2">
                  <SocialIcons variant="dark" size="sm" />
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
