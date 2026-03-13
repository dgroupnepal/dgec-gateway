import { motion } from "framer-motion";
import SectionHeader from "@/components/SectionHeader";
import ServiceCard from "@/components/ServiceCard";
import CTASection from "@/components/CTASection";
import {
  GraduationCap, Globe, FileText, BookOpen, ClipboardCheck, Mic,
  Plane, Hotel, Shield, Briefcase, HeadphonesIcon, FileCheck
} from "lucide-react";

const allServices = [
  { icon: GraduationCap, title: "Education Counseling", description: "Expert academic guidance to choose the right program and university matching your career goals and budget." },
  { icon: Globe, title: "Study Abroad Guidance", description: "Comprehensive support for international education in South Korea, Japan, Australia, and other countries." },
  { icon: FileText, title: "South Korea Student Visa Support", description: "Complete visa application guidance including documentation, preparation, and submission support." },
  { icon: BookOpen, title: "University Admission Assistance", description: "From university research to application submission, we handle the entire admission process for you." },
  { icon: ClipboardCheck, title: "Document Preparation Support", description: "Professional help with organizing, verifying, and preparing all required documents for admission and visa." },
  { icon: FileCheck, title: "SOP & Application Support", description: "Expert guidance on crafting compelling statements of purpose and completing application forms." },
  { icon: Mic, title: "Interview Guidance", description: "Mock interviews and preparation tips to help you confidently face visa and admission interviews." },
  { icon: Briefcase, title: "Travel Assistance", description: "Complete travel planning support including itinerary, accommodations, and pre-departure orientation." },
  { icon: Plane, title: "Air Ticketing", description: "Affordable domestic and international flight booking with flexible options for students and travelers." },
  { icon: Hotel, title: "Hotel Reservation", description: "Convenient hotel and accommodation booking for transit stays, visits, and temporary housing abroad." },
  { icon: Shield, title: "Insurance Services", description: "Travel and health insurance arrangements to ensure you're protected throughout your journey." },
  { icon: HeadphonesIcon, title: "Ongoing Student Support", description: "We stay connected even after you arrive — providing guidance, support, and assistance as needed." },
];

const Services = () => {
  return (
    <>
      <section className="bg-primary section-padding">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent font-medium text-sm mb-4">Our Services</span>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-primary-foreground mb-6">
              Everything You Need for Your Education & Travel Journey
            </h1>
            <p className="text-primary-foreground/70 text-lg">
              From your first consultation to landing at your destination, DGEC provides comprehensive support every step of the way.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allServices.map((s, i) => (
              <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.1 }}>
                <ServiceCard {...s} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        headline="Need Help Choosing the Right Service?"
        description="Our counselors are ready to guide you. Get a free consultation today."
        primaryCta={{ label: "Get Free Consultation", link: "/contact" }}
        secondaryCta={{ label: "Upload Documents", link: "/documents" }}
      />
    </>
  );
};

export default Services;
