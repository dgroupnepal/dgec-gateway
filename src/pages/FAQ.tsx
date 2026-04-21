import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import CTASection from "@/components/CTASection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const faqCategories = [
  {
    title: "General Questions",
    faqs: [
      { q: "What is DGEC?", a: "D Group Education Consultancy Pvt. Ltd. (DGEC) is a Kathmandu-based education consultancy that helps Nepali students pursue higher education abroad, with a special focus on South Korea. We also provide visa support, documentation, air ticketing, hotel booking, and insurance services." },
      { q: "Where is the DGEC office located?", a: "Our office is located at Kalanki-14, Kathmandu, Nepal — just 60 meters straight from Nepal National Hospital. You can visit us during business hours (Sunday–Friday, 10:00 AM – 5:00 PM)." },
      { q: "How can I contact DGEC?", a: "You can reach us through multiple channels:\n• Phone (Nepal): +977-01-5927395, +977-015133395, +977-9763228221\n• Phone (Korea): +82-010-7529-2059\n• WhatsApp (Nepal): +977-9868780019\n• WhatsApp (Korea): +82-10-7529-2059\n• Email: info@dgroupeducation.com" },
      { q: "What are DGEC's business hours?", a: "We are open Sunday through Friday, 10:00 AM to 5:00 PM (Nepal Standard Time). Saturday is closed. For urgent inquiries, you can reach us via WhatsApp anytime." },
    ],
  },
  {
    title: "Study Abroad & Admissions",
    faqs: [
      { q: "How can I apply through DGEC?", a: "Start by filling out our online inquiry form, uploading your documents, or contacting us via WhatsApp or phone. Our counselors will guide you through consultation, document preparation, university selection, application, visa support, and departure preparation." },
      { q: "Which countries does DGEC support for study abroad?", a: "We primarily specialize in South Korea (D-4-1 language and D-2 degree programs). We also assist students interested in Japan, Australia, USA, UK, Canada, and other countries. Contact us for specific destination guidance." },
      { q: "What programs are available for studying in South Korea?", a: "South Korea offers Korean Language Programs (D-4-1 visa), Bachelor's/Master's/PhD programs (D-2 visa), exchange programs, and scholarship opportunities like KGSP (Korean Government Scholarship Program)." },
      { q: "Does DGEC help with university selection?", a: "Yes! Based on your academic background, budget, career goals, and language proficiency, our counselors recommend the most suitable universities and programs for you." },
      { q: "Can students from Nepal apply through DGEC?", a: "Absolutely! DGEC was founded specifically to help Nepali students pursue international education. We understand the unique needs, challenges, and documentation requirements for Nepali applicants." },
      { q: "Do I need TOPIK or IELTS to study in Korea?", a: "It depends on the program. Korean language programs (D-4-1) generally don't require TOPIK, but degree programs (D-2) may require TOPIK Level 3 or higher. Some English-taught programs accept IELTS/TOEFL instead. We can guide you on specific requirements." },
    ],
  },
  {
    title: "Visa & Documentation",
    faqs: [
      { q: "Does DGEC help with South Korea student visa?", a: "Yes! Korea visa support is one of our core services. We assist with documentation preparation, application filing, interview guidance, and submission support for D-4-1, D-2, and other visa categories." },
      { q: "What documents are required for a Korea student visa?", a: "Generally, you need: valid passport, academic transcripts, graduation certificates, language proficiency certificates (if applicable), financial statements (bank balance), Statement of Purpose, family relationship certificates, and passport-size photos. Requirements may vary by university and visa type." },
      { q: "Can I upload my documents online?", a: "Yes! We have a secure online document submission system. Visit our Documents page to upload your files in PDF, JPG, PNG, DOC, or ZIP format (up to 10MB). Our team will review them and contact you." },
      { q: "What are common reasons for visa rejection?", a: "Common reasons include: incomplete documentation, insufficient financial proof, inconsistent information, poor Statement of Purpose, lack of language proficiency evidence, and gaps in academic history. DGEC helps you avoid these issues through thorough document review." },
      { q: "How long does the visa process take?", a: "The Korea student visa process typically takes 2–4 months from initial consultation to visa issuance. Starting early (at least 4–6 months before intended intake) gives you the best chances and options." },
    ],
  },
  {
    title: "Travel & Other Services",
    faqs: [
      { q: "Does DGEC provide air ticketing services?", a: "Yes, we offer affordable domestic and international air ticketing services. We specialize in Nepal–Korea routes but can assist with flights to any destination worldwide at competitive prices." },
      { q: "Does DGEC help with hotel booking and insurance?", a: "Yes! We provide hotel reservation services for transit stays and temporary accommodation, as well as travel and health insurance support for your journey abroad." },
      { q: "What insurance do I need for studying abroad?", a: "Most countries require health insurance for international students. For South Korea, you'll need National Health Insurance (NHIS) enrollment after arrival. We also help arrange travel insurance for your journey." },
      { q: "Does DGEC provide pre-departure orientation?", a: "Yes, we conduct pre-departure briefings covering travel tips, cultural adjustment, essential Korean/Japanese phrases, what to pack, airport procedures, and what to expect upon arrival." },
    ],
  },
  {
    title: "Fees & Payments",
    faqs: [
      { q: "What are DGEC's consultancy fees?", a: "Our fee structure varies based on the services you need. We offer transparent pricing with no hidden charges. Contact us for a detailed fee breakdown based on your specific requirements." },
      { q: "Are there any scholarships available?", a: "Yes! Many Korean universities offer scholarships for international students, including tuition waivers, living stipends, and the Korean Government Scholarship Program (KGSP). We help identify and apply for scholarships you're eligible for." },
      { q: "What is the total cost of studying in Korea?", a: "Costs vary by university and program. Generally, tuition ranges from $2,000–$6,000 per semester for language programs and $3,000–$8,000 for degree programs. Living expenses are approximately $500–$800 per month. Contact us for a personalized cost breakdown." },
    ],
  },
];

const FAQ = () => {
  return (
    <>
      <Helmet>
        <title>FAQ - D Group Education Consultancy | Study Abroad Questions</title>
        <meta name="description" content="Find answers to common questions about studying in South Korea, visa process, documentation, fees, and DGEC services. Contact us for personalized guidance." />
      </Helmet>

      <section className="bg-primary section-padding">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent font-medium text-sm mb-4">FAQ</span>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-primary-foreground mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-primary-foreground/70 text-lg">
              Find answers to the most common questions about studying abroad, visa process, and DGEC services.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* FAQ Content */}
            <div className="lg:col-span-2 space-y-10">
              {faqCategories.map((cat, ci) => (
                <motion.div
                  key={ci}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="font-display font-bold text-xl mb-4 text-foreground">{cat.title}</h2>
                  <Accordion type="single" collapsible className="space-y-3">
                    {cat.faqs.map((f, i) => (
                      <AccordionItem key={i} value={`cat-${ci}-item-${i}`} className="bg-card rounded-xl shadow-card border-none px-6">
                        <AccordionTrigger className="font-display font-semibold text-sm hover:no-underline text-left">{f.q}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{f.a}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-card rounded-xl shadow-card p-6 sticky top-24">
                <h3 className="font-display font-bold text-lg mb-4">Still Have Questions?</h3>
                <p className="text-muted-foreground text-sm mb-6">Our team is ready to help you with personalized guidance.</p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-accent mt-1 shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium">Nepal Office</p>
                      <p className="text-muted-foreground">+977-01-5927395</p>
                      <p className="text-muted-foreground">+977-015133395</p>
                      <p className="text-muted-foreground">+977-9763228221</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-accent mt-1 shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium">Korea Office</p>
                      <p className="text-muted-foreground">+82-010-7529-2059</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-accent mt-1 shrink-0" />
                    <div className="text-sm">
                      <p className="text-muted-foreground">info@dgroupeducation.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-accent mt-1 shrink-0" />
                    <div className="text-sm">
                      <p className="text-muted-foreground">Kalanki-14, Kathmandu, Nepal</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full" asChild>
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                  <Button variant="outline" className="w-full gap-2" asChild>
                    <a href="https://wa.me/9779868780019" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-4 h-4" /> WhatsApp Nepal
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full gap-2" asChild>
                    <a href="https://wa.me/821075292059" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-4 h-4" /> WhatsApp Korea
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        headline="Ready to Start Your Study Abroad Journey?"
        description="Contact DGEC today for a free consultation. Our experienced counselors are here to guide you every step of the way."
        primaryCta={{ label: "Apply Now", link: "/student-inquiry" }}
        secondaryCta={{ label: "Upload Documents", link: "/documents" }}
      />
    </>
  );
};

export default FAQ;
