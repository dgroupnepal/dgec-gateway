import { Link } from "react-router-dom";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";
import SocialIcons from "@/components/SocialIcons";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/images/dgec-logo.png" alt="DGEC Logo" className="h-12 w-auto brightness-0 invert" />
              <span className="font-display font-bold text-xl">DGEC</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-4">
              D Group Education Consultancy Pvt. Ltd. — Your trusted partner for study abroad counseling, Korea visa support, admissions, and travel services.
            </p>
            <h4 className="font-display font-semibold text-sm mb-2">Follow Us</h4>
            <SocialIcons variant="light" />
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
                  <a href="tel:+977015927395" className="hover:text-accent transition-colors block">+977-01-5927395</a>
                  <a href="tel:+977015133395" className="hover:text-accent transition-colors block">+977-01-5133395</a>
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

      {/* Mini Map */}
      <div className="border-t border-primary-foreground/10">
        <div className="container-custom py-8">
          <h4 className="font-display font-semibold text-base mb-4 text-center">Find Us on Map</h4>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.7481108693123!2d85.27938207532326!3d27.694179076190125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f824de877ec60ef%3A0xe2e57e0e03903119!2sD%20Group%20Education%20Consultancy%20Pvt.%20Ltd.!5e0!3m2!1sen!2skr!4v1774111293411!5m2!1sen!2skr"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="DGEC Office Location"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between text-xs text-primary-foreground/50 gap-2">
          <p>© 2026 D Group Education Consultancy Pvt. Ltd. All rights reserved.</p>
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
