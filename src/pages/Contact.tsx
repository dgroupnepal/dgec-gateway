import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SectionHeader from "@/components/SectionHeader";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { toast } from "sonner";

const contactInfo = [
  { icon: MapPin, title: "Office Address", lines: ["Kalanki-14, Kathmandu, Nepal", "60m from Nepal National Hospital"] },
  { icon: Phone, title: "Phone Numbers", lines: ["+977-015133395", "+977-015927395", "+977-060405912", "+82-010-7529-2059 (Korea)"] },
  { icon: Mail, title: "Email", lines: ["info@dgroup.edu.np"] },
  { icon: Clock, title: "Business Hours", lines: ["Sun–Fri: 10:00 AM – 5:00 PM", "Saturday: Closed"] },
];

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you within 24 hours.");
  };

  return (
    <>
      <section className="bg-primary section-padding">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent font-medium text-sm mb-4">Contact Us</span>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-primary-foreground mb-6">
              Get in Touch with DGEC
            </h1>
            <p className="text-primary-foreground/70 text-lg">
              Have questions? Ready to start your journey? We're here to help. Reach out via the form below or contact us directly.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Form */}
            <div className="lg:col-span-3">
              <h2 className="font-display font-bold text-2xl mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" placeholder="Your name" required maxLength={100} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" type="tel" placeholder="+977 98XXXXXXXX" required maxLength={20} className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="your@email.com" required maxLength={100} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" maxLength={200} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea id="message" placeholder="Tell us about your inquiry..." required maxLength={2000} rows={5} className="mt-1" />
                </div>
                <Button variant="accent" size="lg" type="submit" className="w-full md:w-auto">Send Message</Button>
              </form>
            </div>

            {/* Contact Info */}
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
                    <p key={i} className="text-muted-foreground text-sm ml-[52px]">{line}</p>
                  ))}
                </div>
              ))}

              {/* WhatsApp Quick */}
              <div className="bg-success/10 rounded-xl p-5">
                <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-success" /> Quick WhatsApp
                </h3>
                <div className="space-y-2">
                  <Button variant="whatsapp" size="sm" className="w-full" asChild>
                    <a href="https://wa.me/9779868780019" target="_blank" rel="noopener noreferrer">Nepal: +977 9868780019</a>
                  </Button>
                  <Button variant="whatsapp" size="sm" className="w-full" asChild>
                    <a href="https://wa.me/821075292059" target="_blank" rel="noopener noreferrer">Korea: +82 10-7529-2059</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="mt-12 bg-card rounded-xl shadow-card overflow-hidden">
            <div className="h-64 md:h-80 bg-secondary flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-accent mx-auto mb-3" />
                <p className="font-display font-semibold">DGEC Office</p>
                <p className="text-muted-foreground text-sm">Kalanki-14, Kathmandu, Nepal</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
