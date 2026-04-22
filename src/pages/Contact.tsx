import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import TurnstileWidget from "@/components/TurnstileWidget";
import { useSuccessPopup } from "@/hooks/useSuccessPopup";

const contactInfo = [
  {
    icon: MapPin,
    title: "Office Address",
    lines: ["Kalanki-14, Kathmandu, Nepal", "60m from Nepal National Hospital"],
  },
  {
    icon: Phone,
    title: "Phone Numbers",
    lines: ["+977-1-5927395", "+82-010-7529-2059 (Korea)"],
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["info@dgroupeducation.com"],
  },
  {
    icon: Clock,
    title: "Business Hours",
    lines: ["Sun–Fri: 10:00 AM – 5:00 PM", "Saturday: Closed"],
  },
];

const EMPTY_FORM = {
  fullName: "",
  phone: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [turnstileToken, setTurnstileToken] = useState("");
  const { showPopup, popup } = useSuccessPopup(() => {
    setForm(EMPTY_FORM);
    setTurnstileToken("");
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
    if (siteKey && !turnstileToken) {
      toast.error("Please complete the security check.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await api.postContact({
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        subject: form.subject,
        message: form.message,
        website: form.website,
        turnstileToken,
      });

      if (!result.success) throw new Error(result.message || "Unable to send message right now.");

      showPopup({ name: form.fullName, email: form.email });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="bg-primary section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent font-medium text-sm mb-4">
              Contact Us
            </span>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-primary-foreground mb-6">
              Get in Touch with DGEC
            </h1>
            <p className="text-primary-foreground/70 text-lg">
              Have questions? Ready to start your journey? We're here to help.
              Reach out via the form below or contact us directly.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3">
              <h2 className="font-display font-bold text-2xl mb-6">
                Send Us a Message
              </h2>

              <form id="contact-form" onSubmit={handleSubmit} className="space-y-5">
                {/* Honeypot — must stay hidden, bots fill this */}
                <input
                  type="text"
                  name="website"
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Your name"
                      required
                      maxLength={100}
                      className="mt-1"
                      value={form.fullName}
                      onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+977 98XXXXXXXX"
                      required
                      maxLength={20}
                      className="mt-1"
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    maxLength={100}
                    className="mt-1"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="How can we help?"
                    maxLength={200}
                    className="mt-1"
                    value={form.subject}
                    onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your inquiry..."
                    required
                    maxLength={2000}
                    rows={5}
                    className="mt-1"
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  />
                </div>

                <TurnstileWidget onVerify={setTurnstileToken} />

                <Button
                  variant="accent"
                  size="lg"
                  type="submit"
                  className="w-full md:w-auto"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-6">
              {contactInfo.map((c) => (
                <div key={c.title} className="bg-card rounded-xl p-5 shadow-card">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <c.icon className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="font-display font-semibold">{c.title}</h3>
                  </div>
                  {c.lines.map((line, i) => (
                    <p key={i} className="text-muted-foreground text-sm ml-[52px]">
                      {line}
                    </p>
                  ))}
                </div>
              ))}

              <div className="bg-success/10 rounded-xl p-5">
                <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-success" /> Quick WhatsApp
                </h3>
                <div className="space-y-2">
                  <Button variant="whatsapp" size="sm" className="w-full" asChild>
                    <a href="https://wa.me/9779868780019" target="_blank" rel="noopener noreferrer">
                      Nepal: +977 9868780019
                    </a>
                  </Button>
                  <Button variant="whatsapp" size="sm" className="w-full" asChild>
                    <a href="https://wa.me/821075292059" target="_blank" rel="noopener noreferrer">
                      Korea: +82 10-7529-2059
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="font-display font-bold text-2xl mb-6">Find Us on Map</h2>
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.7481108693123!2d85.27938207532326!3d27.694179076190125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f824de877ec60ef%3A0xe2e57e0e03903119!2sD%20Group%20Education%20Consultancy%20Pvt.%20Ltd.!5e0!3m2!1sen!2skr!4v1774111293411!5m2!1sen!2skr"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="DGEC Office Location"
                className="w-full"
              />
              <div className="p-5 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-display font-semibold">DGEC Office</p>
                  <p className="text-muted-foreground text-sm">
                    Kalanki-14, Kathmandu, Nepal — 60m from Nepal National Hospital
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {popup}
    </>
  );
};

export default Contact;
