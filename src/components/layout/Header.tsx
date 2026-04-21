import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, LogIn, ChevronDown, GraduationCap, ShieldCheck } from "lucide-react";
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

const loginItems = [
  { label: "Student Portal", path: "/portal/login", icon: GraduationCap, desc: "Access your dashboard & documents" },
  { label: "Admin / Staff Login", path: "/admin/login", icon: ShieldCheck, desc: "Staff and admin access" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [mobileLoginOpen, setMobileLoginOpen] = useState(false);
  const loginRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (loginRef.current && !loginRef.current.contains(e.target as Node)) {
        setLoginOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Top bar */}
      <div className="hidden lg:block bg-primary text-primary-foreground text-xs">
        <div className="container-custom flex items-center justify-between h-9">
          <div className="flex items-center gap-4">
            <a href="tel:+977015927395" className="hover:text-accent transition-colors">+977-01-5927395</a>
            <span className="text-primary-foreground/30">|</span>
            <a href="mailto:info@dgroupeducation.com" className="hover:text-accent transition-colors">info@dgroupeducation.com</a>
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
            {/* Login dropdown */}
            <div className="relative" ref={loginRef}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLoginOpen((v) => !v)}
                className="gap-1"
              >
                <LogIn className="w-4 h-4" />
                Login
                <ChevronDown className={`w-3 h-3 transition-transform ${loginOpen ? "rotate-180" : ""}`} />
              </Button>
              {loginOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50">
                  {loginItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setLoginOpen(false)}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-secondary/60 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-accent/20 transition-colors">
                        <item.icon className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

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
                {/* Mobile login accordion */}
                <button
                  className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg bg-secondary/40 hover:bg-secondary/70 transition-colors"
                  onClick={() => setMobileLoginOpen((v) => !v)}
                >
                  <span className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" /> Login
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileLoginOpen ? "rotate-180" : ""}`} />
                </button>
                {mobileLoginOpen && (
                  <div className="flex flex-col gap-1 pl-2">
                    {loginItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => { setMobileOpen(false); setMobileLoginOpen(false); }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg hover:bg-secondary/50 transition-colors"
                      >
                        <item.icon className="w-4 h-4 text-accent shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                )}

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
