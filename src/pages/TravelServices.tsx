import { motion } from "framer-motion";
import SectionHeader from "@/components/SectionHeader";
import ServiceCard from "@/components/ServiceCard";
import CTASection from "@/components/CTASection";
import { Plane, Hotel, Shield, Globe, DollarSign, HeadphonesIcon } from "lucide-react";

const travelServices = [
  { icon: Plane, title: "International Air Ticketing", description: "Book affordable international flights — Nepal to Korea, Korea to Nepal, and multi-country routes." },
  { icon: Globe, title: "Nepal-Korea Flight Support", description: "Specialized flight booking assistance for the Nepal-Korea route with competitive fares." },
  { icon: Hotel, title: "Hotel Reservation", description: "Convenient hotel and accommodation booking for transit stays and temporary housing." },
  { icon: Shield, title: "Travel Insurance", description: "Comprehensive travel and health insurance arrangements for your safety abroad." },
  { icon: DollarSign, title: "Affordable Fare Assistance", description: "We compare and find the most affordable travel options for students and families." },
  { icon: HeadphonesIcon, title: "Travel Consultation", description: "Complete travel planning support including itinerary, visas, and logistics." },
];

const TravelServices = () => {
  return (
    <>
      <section className="bg-primary section-padding">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent font-medium text-sm mb-4">Travel Services</span>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-primary-foreground mb-6">
              Complete Travel & Ticketing Services
            </h1>
            <p className="text-primary-foreground/70 text-lg">
              From flight bookings to hotel reservations and travel insurance — DGEC provides reliable and affordable travel support for students and travelers.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <SectionHeader title="Our Travel Services" description="Affordable, reliable, and student-friendly travel services from Nepal." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {travelServices.map((s, i) => (
              <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.1 }}>
                <ServiceCard {...s} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        headline="Need Help with Travel Booking?"
        description="Contact us for affordable flight tickets, hotel bookings, and travel insurance."
        primaryCta={{ label: "Get a Quote", link: "/contact" }}
        secondaryCta={{ label: "WhatsApp Us", link: "https://wa.me/9779868780019" }}
      />
    </>
  );
};

export default TravelServices;
