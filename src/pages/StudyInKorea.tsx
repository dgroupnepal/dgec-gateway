import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/SectionHeader";
import CTASection from "@/components/CTASection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle, BookOpen, GraduationCap, FileText, Globe, Languages, Home, Briefcase, ArrowRight } from "lucide-react";

const benefits = [
  "World-class universities with globally recognized degrees",
  "Affordable tuition compared to Western countries",
  "Generous scholarship opportunities for international students",
  "Part-time work opportunities while studying",
  "Rich culture, advanced technology, and safe living environment",
  "Growing demand for Korean-speaking professionals worldwide",
];

const pathways = [
  { icon: Languages, title: "Korean Language Program", desc: "Learn Korean at university-affiliated language institutes before starting your degree program." },
  { icon: GraduationCap, title: "Undergraduate Studies", desc: "Bachelor's degree programs across engineering, business, arts, and sciences at top Korean universities." },
  { icon: BookOpen, title: "Graduate Programs", desc: "Master's and PhD programs with research opportunities and scholarship support." },
  { icon: Briefcase, title: "Vocational Training", desc: "Practical skill-building programs in technology, hospitality, and other in-demand fields." },
];

const documents = [
  "Valid passport (with at least 6 months validity)",
  "Academic transcripts and certificates",
  "Korean language proficiency certificate (TOPIK, if applicable)",
  "English proficiency test scores (IELTS/TOEFL, if applicable)",
  "Statement of Purpose (SOP)",
  "Financial proof / bank statements",
  "Passport-size photographs",
  "Health certificate / medical report",
  "Recommendation letters (if required)",
];

const faqs = [
  { q: "Do I need to speak Korean to study in South Korea?", a: "Not necessarily. Many universities offer programs in English. However, learning Korean can significantly enhance your experience and employment prospects. DGEC can guide you to Korean language programs." },
  { q: "How much does it cost to study in South Korea?", a: "Tuition fees vary by university and program but are generally more affordable than Western countries. Many scholarships are available for international students. Contact DGEC for personalized cost guidance." },
  { q: "Can I work while studying in South Korea?", a: "Yes, international students with valid visas can work part-time (up to 20 hours/week during semesters). DGEC can provide more details about work regulations." },
  { q: "How long does the admission process take?", a: "The process typically takes 2-4 months from application to admission letter. Starting early gives you the best chances. DGEC helps you stay on track with deadlines." },
];

const StudyInKorea = () => {
  return (
    <>
      <section className="bg-primary section-padding">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent font-medium text-sm mb-4">🇰🇷 Study in South Korea</span>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-primary-foreground mb-6">
              Your Complete Guide to Studying in South Korea from Nepal
            </h1>
            <p className="text-primary-foreground/70 text-lg">
              South Korea offers world-class education, vibrant culture, and incredible opportunities. DGEC is your trusted partner for making your Korean study dream a reality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeader badge="Why Korea?" title="Why Study in South Korea?" description="South Korea is one of the fastest-growing education destinations for Nepali students." />
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {benefits.map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-start gap-3 bg-card rounded-lg p-4 shadow-card">
                <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <span className="text-sm">{b}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pathways */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <SectionHeader badge="Study Pathways" title="Popular Study Pathways in Korea" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pathways.map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-background rounded-xl p-6 shadow-card text-center">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <p.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-display font-semibold text-base mb-2">{p.title}</h3>
                <p className="text-muted-foreground text-sm">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeader badge="Checklist" title="Required Documents" description="Here's a general checklist of documents typically required for studying in South Korea. DGEC will guide you on specifics." />
          <div className="max-w-2xl mx-auto space-y-3">
            {documents.map((d, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }} className="flex items-center gap-3 bg-card rounded-lg p-4 shadow-card">
                <FileText className="w-5 h-5 text-accent shrink-0" />
                <span className="text-sm">{d}</span>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="accent" size="lg" asChild>
              <Link to="/documents">Upload Your Documents <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* DGEC Support Process */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <SectionHeader badge="DGEC Support" title="How DGEC Helps You Study in Korea" description="Our end-to-end support system makes your journey smooth and stress-free." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Globe, title: "University Selection", desc: "We help you find the best-fit university based on your goals and budget." },
              { icon: FileText, title: "Application Support", desc: "Complete assistance with admission applications, SOPs, and forms." },
              { icon: Languages, title: "Korean Language Prep", desc: "Guidance on Korean language programs and TOPIK preparation." },
              { icon: Briefcase, title: "Visa Guidance", desc: "Step-by-step support for visa documentation and submission." },
              { icon: Home, title: "Accommodation Help", desc: "Assistance finding suitable student housing in South Korea." },
              { icon: GraduationCap, title: "Pre-Departure Briefing", desc: "Everything you need to know before you fly — culture, logistics, and more." },
            ].map((s, i) => (
              <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-background rounded-xl p-6 shadow-card">
                <s.icon className="w-8 h-8 text-accent mb-3" />
                <h3 className="font-display font-semibold text-base mb-1">{s.title}</h3>
                <p className="text-muted-foreground text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <SectionHeader badge="FAQ" title="Frequently Asked Questions" />
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-card rounded-xl shadow-card border-none px-6">
                <AccordionTrigger className="font-display font-semibold text-sm hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <CTASection
        headline="Ready to Study in South Korea?"
        description="Let DGEC guide you from application to arrival. Start your journey today."
        primaryCta={{ label: "Apply Now", link: "/contact" }}
        secondaryCta={{ label: "WhatsApp Us", link: "https://wa.me/9779868780019" }}
      />
    </>
  );
};

export default StudyInKorea;
