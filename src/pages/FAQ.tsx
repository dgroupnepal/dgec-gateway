import { motion } from "framer-motion";
import SectionHeader from "@/components/SectionHeader";
import CTASection from "@/components/CTASection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "How can I apply through DGEC?", a: "You can start by filling out our online inquiry form, uploading your documents, or contacting us directly via WhatsApp or phone. Our counselors will guide you through the entire process from consultation to departure." },
  { q: "Does DGEC help with South Korea student visa support?", a: "Yes! South Korea visa support is one of our core services. We help with documentation, application preparation, interview guidance, and submission support. Note: We provide guidance and support, not legal advice." },
  { q: "What documents are required?", a: "Required documents vary by program and destination. Generally, you'll need your passport, academic transcripts, language proficiency certificates, financial statements, and a Statement of Purpose. Visit our Document Upload page to submit your files for review." },
  { q: "Can I upload my documents online?", a: "Absolutely! We have a secure online document submission system. Visit our Documents page to upload your files in PDF, JPG, PNG, DOC, or ZIP format. Our team will review them and contact you." },
  { q: "Does DGEC provide air ticketing services?", a: "Yes, we offer affordable domestic and international air ticketing services. We specialize in Nepal-Korea routes but can assist with flights to any destination worldwide." },
  { q: "How long does the process take?", a: "The timeline varies depending on the destination and program. For South Korea, the process typically takes 2-4 months from initial consultation to departure. Starting early gives you the best options." },
  { q: "Can students from Nepal apply through DGEC?", a: "Yes! DGEC was founded specifically to help Nepali students pursue international education. We understand the unique needs and challenges faced by students from Nepal." },
  { q: "Does DGEC help with hotel booking and insurance?", a: "Yes, we provide hotel reservation services for transit stays and temporary accommodation, as well as travel and health insurance support for your journey." },
  { q: "How can I contact DGEC quickly?", a: "The fastest way is through WhatsApp. Nepal: +977 9868780019, Korea: +82 10-7529-2059. You can also call us at +977-015133395 or email info@dgroup.edu.np." },
];

const FAQ = () => {
  return (
    <>
      <section className="bg-primary section-padding">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent font-medium text-sm mb-4">FAQ</span>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-primary-foreground mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-primary-foreground/70 text-lg">
              Find answers to the most common questions about our services, processes, and support.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-card rounded-xl shadow-card border-none px-6">
                <AccordionTrigger className="font-display font-semibold text-sm hover:no-underline text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <CTASection
        headline="Still Have Questions?"
        description="Our team is ready to help. Reach out via WhatsApp, phone, or email."
        primaryCta={{ label: "Contact Us", link: "/contact" }}
      />
    </>
  );
};

export default FAQ;
