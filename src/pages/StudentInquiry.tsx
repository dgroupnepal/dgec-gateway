import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SectionHeader from "@/components/SectionHeader";
import { toast } from "sonner";
import { api } from "@/lib/api";

const StudentInquiry = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    country: "South Korea",
    currentEducation: "",
    interestedCourse: "",
    interestedUniversity: "",
    preferredIntake: "",
    message: "",
    honeypot: "",
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const result = await api.postStudentInquiry(form);
      if (result.success) {
        toast.success(result.message || "Inquiry submitted successfully.");
        setForm({
          fullName: "",
          phone: "",
          email: "",
          country: "South Korea",
          currentEducation: "",
          interestedCourse: "",
          interestedUniversity: "",
          preferredIntake: "",
          message: "",
          honeypot: "",
        });
      } else {
        toast.error(result.message || "Unable to submit inquiry.");
      }
    } catch {
      toast.error("Network error while submitting inquiry.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="bg-primary section-padding">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent font-medium text-sm mb-4">Student Inquiry</span>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-primary-foreground mb-6">Apply for Study Consultation</h1>
            <p className="text-primary-foreground/70 text-lg">Share your study goal and our counselors will guide your university, visa, and document plan.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <SectionHeader badge="Admissions" title="Tell us about your study plan" />
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" className="hidden" value={form.honeypot} onChange={(e) => setForm((p) => ({ ...p, honeypot: e.target.value }))} />
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Full Name *</Label><Input required value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} /></div>
              <div><Label>Phone *</Label><Input required value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} /></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Email *</Label><Input type="email" required value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} /></div>
              <div><Label>Country *</Label><Input required value={form.country} onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))} /></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Current Education *</Label><Input required value={form.currentEducation} onChange={(e) => setForm((p) => ({ ...p, currentEducation: e.target.value }))} /></div>
              <div><Label>Interested Course *</Label><Input required value={form.interestedCourse} onChange={(e) => setForm((p) => ({ ...p, interestedCourse: e.target.value }))} /></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Interested University</Label><Input value={form.interestedUniversity} onChange={(e) => setForm((p) => ({ ...p, interestedUniversity: e.target.value }))} /></div>
              <div><Label>Preferred Intake *</Label><Input required value={form.preferredIntake} onChange={(e) => setForm((p) => ({ ...p, preferredIntake: e.target.value }))} /></div>
            </div>
            <div><Label>Message *</Label><Textarea required value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} rows={5} /></div>
            <Button type="submit" variant="accent" disabled={isLoading}>{isLoading ? "Submitting..." : "Submit Inquiry"}</Button>
          </form>
        </div>
      </section>
    </>
  );
};

export default StudentInquiry;
