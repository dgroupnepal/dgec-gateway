import { motion } from "framer-motion";
import SectionHeader from "@/components/SectionHeader";
import CTASection from "@/components/CTASection";
import { Target, Eye, Heart, Award, Users, Globe, MessageCircle } from "lucide-react";
import teamDipesh from "/images/team-dipesh.jpg";
import teamCounselor from "/images/team-counselor.jpg";
import teamOperations from "/images/team-operations.jpg";

const team = [
  {
    name: "Dipesh Bohara",
    role: "Founder & CEO",
    image: teamDipesh,
    description: "Visionary leader of DGEC with expertise in student counseling and visa services.",
    whatsapp: "https://wa.me/9779868780019",
  },
  {
    name: "Education Counselor",
    role: "Senior Student Counselor",
    image: teamCounselor,
    description: "Guides students for Korea, Japan, and international study programs.",
    whatsapp: "https://wa.me/9779868780019",
  },
  {
    name: "Operations Manager",
    role: "Admin & Operations Manager",
    image: teamOperations,
    description: "Handles documentation, coordination, and daily operations.",
    whatsapp: "https://wa.me/9779868780019",
  },
];

const milestones = [
  { year: "2014", text: "DGEC founded in Kathmandu, Nepal" },
  { year: "2016", text: "Partnership with Korean language institutes" },
  { year: "2018", text: "Expanded to full travel & ticketing services" },
  { year: "2020", text: "500+ students successfully placed abroad" },
  { year: "2023", text: "Korea office support established" },
];

const values = [
  { icon: Heart, title: "Student-Centered", desc: "Every decision we make puts our students' success and well-being first." },
  { icon: Award, title: "Transparency", desc: "No hidden fees, no false promises. We believe in honest, straightforward guidance." },
  { icon: Users, title: "Personalized Support", desc: "We treat every student as an individual, not a number. Your goals shape our approach." },
  { icon: Globe, title: "Global Network", desc: "Strong relationships with universities and institutions across South Korea and beyond." },
];

const About = () => {
  return (
    <>
      {/* Hero */}
      <section className="bg-primary section-padding">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent font-medium text-sm mb-4">About DGEC</span>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-primary-foreground mb-6">
              Building Futures Through Education & Trust
            </h1>
            <p className="text-primary-foreground/70 text-lg leading-relaxed">
              D Group Education Consultancy Pvt. Ltd. was founded with a single mission: to provide Nepali students with reliable, transparent, and professional support for studying abroad and international travel.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding">
        <div className="container-custom grid md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-card rounded-xl p-8 shadow-card">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-accent" />
            </div>
            <h2 className="font-display font-bold text-2xl mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              To empower students from Nepal with comprehensive, honest, and professional education consulting and travel services — making international education accessible, affordable, and stress-free.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-card rounded-xl p-8 shadow-card">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-accent" />
            </div>
            <h2 className="font-display font-bold text-2xl mb-4">Our Vision</h2>
            <p className="text-muted-foreground leading-relaxed">
              To become Nepal's most trusted education and travel consultancy — recognized for integrity, student success, and building bridges between Nepal and the world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <SectionHeader badge="Our Values" title="What Drives Us Every Day" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-background rounded-xl p-6 shadow-card text-center">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-display font-semibold text-base mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeader badge="Our Journey" title="Milestones That Define Us" />
          <div className="max-w-2xl mx-auto space-y-6">
            {milestones.map((m, i) => (
              <motion.div key={m.year} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-6 items-start">
                <span className="font-display font-bold text-xl text-accent shrink-0 w-16">{m.year}</span>
                <div className="pb-6 border-l-2 border-accent/20 pl-6 relative">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-accent" />
                  <p className="text-foreground">{m.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        headline="Ready to Start Your Journey?"
        description="Get in touch with our experienced counselors today."
        primaryCta={{ label: "Contact Us", link: "/contact" }}
        secondaryCta={{ label: "View Services", link: "/services" }}
      />
    </>
  );
};

export default About;
