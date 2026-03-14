import { Link } from "react-router-dom";
import { GraduationCap, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-accent-foreground" />
              </div>
              <span className="font-display font-bold text-xl">DGEC</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-4">
              D Group Education Consultancy Pvt. Ltd. — Your trusted partner for study abroad counseling, Korea visa support, admissions, and travel services.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors" aria-label="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-base mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              {[
                { label: "Home", path: "/" },
                { label: "About Us", path: "/about" },
                { label: "Services", path: "/services" },
                { label: "Study in Korea", path: "/study-in-korea" },
                { label: "Contact", path: "/contact" },
                { label: "FAQ", path: "/faq" },
                { label: "Student Portal", path: "/portal" },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:text-accent transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-base mb-4">Our Services</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              {["Education Counseling", "Korea Visa Support", "University Admissions", "Documentation Support", "Air Ticketing", "Hotel Reservation", "Travel Insurance"].map((s) => (
                <li key={s}>
                  <Link to="/services" className="hover:text-accent transition-colors">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-base mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-accent" />
                <span>Kalanki-14, Kathmandu, Nepal<br />60m from Nepal National Hospital</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 shrink-0 text-accent" />
                <div>
                  <a href="tel:+977015927395" className="hover:text-accent transition-colors block">+977-015927395</a>
                  <a href="tel:+82-010-7529-2059" className="hover:text-accent transition-colors block">+82-010-7529-2059 (Korea)</a>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-accent" />
                <a href="mailto:info@dgroup.edu.np" className="hover:text-accent transition-colors">info@dgroup.edu.np</a>
              </li>
            </ul>
            <div className="mt-4 text-sm text-primary-foreground/70">
              <p>WhatsApp (Nepal): <a href="https://wa.me/9779868780019" className="hover:text-accent transition-colors">+977 9868780019</a></p>
              <p>WhatsApp (Korea): <a href="https://wa.me/821075292059" className="hover:text-accent transition-colors">+82 10-7529-2059</a></p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between text-xs text-primary-foreground/50 gap-2">
          <p>© {new Date().getFullYear()} D Group Education Consultancy Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-accent transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
