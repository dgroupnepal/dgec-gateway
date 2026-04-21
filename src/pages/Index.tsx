import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/SectionHeader";
import ServiceCard from "@/components/ServiceCard";
import CTASection from "@/components/CTASection";
import heroBg from "@/assets/hero-bg.jpg";
import {
  GraduationCap, FileText, Plane, Hotel, Shield, BookOpen,
  Users, CheckCircle, Star, ArrowRight, Globe, MessageCircle,
  ClipboardCheck, HeadphonesIcon, Briefcase, Phone
} from "lucide-react";

const highlights = [
  { icon: GraduationCap, label: "Study Abroad" },
  { icon: FileText, label: "Korea Visa Support" },
  { icon: BookOpen, label: "Admissions" },
  { icon: ClipboardCheck, label: "Documentation" },
  { icon: Plane, label: "Air Ticketing" },
  { icon: Hotel, label: "Hotel Booking" },
  { icon: Shield, label: "Insurance" },
];

const services = [
  { icon: GraduationCap, title: "Education Counseling", description: "Expert guidance to help you choose the right program, university, and country for your academic goals." },
  { icon: Globe, title: "Study Abroad Guidance", description: "Comprehensive support for international study opportunities across South Korea, Japan, and more." },
  { icon: FileText, title: "Visa Processing Support", description: "Step-by-step assistance with visa documentation, application, and interview preparation." },
  { icon: Plane, title: "Air Ticketing", description: "Affordable international flight booking services for students and travelers." },
  { icon: Hotel, title: "Hotel Reservation", description: "Convenient hotel booking assistance for transit stays and accommodation abroad." },
  { icon: Shield, title: "Insurance Services", description: "Travel and health insurance support to keep you protected throughout your journey." },
];

const whyChoose = [
  "Trusted student guidance with years of experience",
  "Transparent and honest process from start to finish",
  "Personalized consultation tailored to your goals",
  "End-to-end admission and visa support",
  "Travel and education services under one roof",
  "Dedicated support for Nepali students",
];

const steps = [
  { num: "01", title: "Inquiry", desc: "Reach out to us via phone, WhatsApp, or our contact form." },
  { num: "02", title: "Counseling", desc: "Get personalized guidance on the best study options for you." },
  { num: "03", title: "Document Review", desc: "We review and organize all required documents." },
  { num: "04", title: "Admission Application", desc: "We help submit your application to the right institution." },
  { num: "05", title: "Visa Guidance", desc: "Complete visa application support and interview prep." },
  { num: "06", title: "Travel Preparation", desc: "Air tickets, accommodation, and pre-departure briefing." },
  { num: "07", title: "Departure Support", desc: "Final checks and support until you board your flight." },
];

const testimonials = [
  { name: "Aarav Shrestha", text: "DGEC made my dream of studying in South Korea a reality. Their team guided me through every step, from admission to visa.", rating: 5 },
  { name: "Sita Gurung", text: "Professional, transparent, and truly caring. I felt supported throughout my entire journey. Highly recommend DGEC!", rating: 5 },
  { name: "Rajan Thapa", text: "The air ticketing and travel support was excellent. They found me affordable flights and handled everything smoothly.", rating: 5 },
];

const destinations = [
  { name: "South Korea", flag: "🇰🇷", desc: "Top destination for Nepali students with world-class universities and vibrant culture.", link: "/study-in-korea" },
  { name: "Japan", flag: "🇯🇵", desc: "Excellent education system with scholarship opportunities for international students.", link: "/contact" },
  { name: "Other Countries", flag: "🌍", desc: "Explore study opportunities in Australia, USA, UK, Canada, and more.", link: "/contact" },
];

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Study Abroad from Nepal | Korea, UK, Australia, Japan & More | DGEC</title>
        <meta name="description" content="D Group Education Consultancy Pvt. Ltd. helps students from Nepal study in South Korea, Japan, and other countries with affordable services, visa guidance, and expert support." />
        <link rel="canonical" href="https://dgroupeducation.com/" />
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org","@type":"EducationalOrganization",
          "name":"D Group Education Consultancy Pvt. Ltd.","alternateName":"DGEC",
          "url":"https://dgroupeducation.com","email":"info@dgroupeducation.com",
          "telephone":"+977-015927395",
          "address":{"@type":"PostalAddress","streetAddress":"Kalanki-14, 60m from Nepal National Hospital","addressLocality":"Kathmandu","addressCountry":"NP"},
          "sameAs":["https://wa.me/9779868780019"]
        })}</script>
      </Helmet>
      {/* Hero */}
      <section className="relative min-h-[600px] md:min-h-[700px] flex items-center">
        <div className="absolute inset-0">
          <img src={heroBg} alt="Nepali students studying abroad in South Korea" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-primary/75" />
        </div>
        <div className="relative container-custom py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl text-primary-foreground leading-tight mb-6">
              Study in South Korea from Nepal — Visa, Admission & Study Abroad Experts
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
              D Group Education Consultancy (DGEC) helps Nepali students with Korea student visa, university admissions, Japan visa, documentation, and complete travel support — all under one roof.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" asChild>
                <Link to="/contact">Apply Now <ArrowRight className="w-5 h-5" /></Link>
              </Button>
              <Button variant="hero" className="bg-primary-foreground/10 backdrop-blur hover:bg-primary-foreground/20" asChild>
                <Link to="/contact">Free Consultation</Link>
              </Button>
              <Button variant="whatsapp" size="lg" asChild>
                <a href="https://wa.me/9779868780019" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" /> WhatsApp Us
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Highlights */}
      <section className="bg-secondary py-8">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {highlights.map((h) => (
              <div key={h.label} className="flex items-center gap-2 text-sm font-medium text-foreground">
                <h.icon className="w-5 h-5 text-accent" />
                <span>{h.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <SectionHeader badge="About DGEC" title="Committed to Your Success Abroad" centered={false} />
              <p className="text-muted-foreground leading-relaxed mb-4">
                D Group Education Consultancy Pvt. Ltd. (DGEC) is committed to helping students and travelers with reliable, transparent, and professional support — from initial consultation to final travel preparation.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Based in Kathmandu, Nepal, we specialize in South Korea study programs, visa guidance, university admissions, and comprehensive travel services including air ticketing and hotel reservations.
              </p>
              <Button variant="outline" asChild>
                <Link to="/about">Learn More About Us <ArrowRight className="w-4 h-4" /></Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { num: "500+", label: "Students Guided" },
                { num: "50+", label: "Partner Universities" },
                { num: "98%", label: "Visa Success Rate" },
                { num: "10+", label: "Years of Trust" },
              ].map((stat) => (
                <div key={stat.label} className="bg-card rounded-xl p-6 shadow-card text-center">
                  <p className="font-display font-bold text-3xl text-accent">{stat.num}</p>
                  <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <SectionHeader badge="Destinations" title="Popular Study Destinations" description="Explore top countries for your international education journey." />
          <div className="grid md:grid-cols-3 gap-6">
            {destinations.map((d) => (
              <motion.div
                key={d.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-background rounded-xl p-8 shadow-card hover:shadow-elevated transition-all text-center group"
              >
                <span className="text-5xl block mb-4">{d.flag}</span>
                <h3 className="font-display font-semibold text-xl mb-2">{d.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{d.desc}</p>
                <Button variant="outline" size="sm" asChild>
                  <Link to={d.link}>Learn More</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose DGEC */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeader badge="Why DGEC" title="Why Students Trust DGEC" description="We go beyond consultation — we become your partner in achieving your study abroad dreams." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {whyChoose.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 bg-card rounded-lg p-4 shadow-card"
              >
                <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <SectionHeader badge="Our Services" title="Comprehensive Education & Travel Services" description="From counseling to departure — we handle it all so you can focus on your future." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <ServiceCard {...s} />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button variant="default" size="lg" asChild>
              <Link to="/services">View All Services <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeader badge="Our Process" title="Your Journey with DGEC" description="A clear, step-by-step process from your first inquiry to your departure." />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.slice(0, 4).map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-card rounded-xl p-6 shadow-card"
              >
                <span className="font-display font-bold text-4xl text-accent/20">{step.num}</span>
                <h3 className="font-display font-semibold text-base mt-2 mb-1">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-6 max-w-4xl mx-auto">
            {steps.slice(4).map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i + 4) * 0.1 }}
                className="relative bg-card rounded-xl p-6 shadow-card"
              >
                <span className="font-display font-bold text-4xl text-accent/20">{step.num}</span>
                <h3 className="font-display font-semibold text-base mt-2 mb-1">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <SectionHeader badge="Testimonials" title="What Our Students Say" description="Real stories from students who trusted DGEC with their study abroad journey." />
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-background rounded-xl p-6 shadow-card"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <p className="font-display font-semibold text-sm">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        headline="Start Your Abroad Journey with DGEC Today"
        description="Whether you're planning to study in South Korea or need travel assistance, we're here to help you every step of the way."
        primaryCta={{ label: "Book Free Counseling", link: "/contact" }}
        secondaryCta={{ label: "Upload Documents", link: "/documents" }}
      />
    </>
  );
};

export default Index;
