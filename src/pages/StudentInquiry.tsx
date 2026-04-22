import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SectionHeader from "@/components/SectionHeader";
import { toast } from "sonner";
import { api } from "@/lib/api";
import TurnstileWidget from "@/components/TurnstileWidget";

const EMPTY_FORM = {
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
};

const StudentInquiry = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [turnstileToken, setTurnstileToken] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
    if (siteKey && !turnstileToken) {
      toast.error("Please complete the security check.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await api.postStudentInquiry({ ...form, turnstileToken });
      if (result.success) {
        toast.success(result.message || "Inquiry submitted successfully.");
        setForm(EMPTY_FORM);
        setTurnstileToken("");
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
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent font-medium text-sm mb-4">
              Student Inquiry
            </span>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-primary-foreground mb-6">
              Apply for Study Consultation
            </h1>
            <p className="text-primary-foreground/70 text-lg">
              Share your study goal and our counselors will guide your university, visa, and document plan.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <SectionHeader badge="Admissions" title="Tell us about your study plan" />
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot — must stay hidden, bots fill this */}
            <input
              type="text"
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              value={form.honeypot}
              onChange={(e) => setForm((p) => ({ ...p, honeypot: e.target.value }))}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Full Name *</Label>
                <Input required maxLength={100} value={form.fullName}
                  onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} />
              </div>
              <div>
                <Label>Phone *</Label>
                <Input required maxLength={20} value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Email *</Label>
                <Input type="email" required maxLength={100} value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
              </div>
              <div>
                <Label>Destination Country *</Label>
                <Input required value={form.country}
                  onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Current Education *</Label>
                <Input required value={form.currentEducation}
                  onChange={(e) => setForm((p) => ({ ...p, currentEducation: e.target.value }))} />
              </div>
              <div>
                <Label>Interested Course *</Label>
                <Input required value={form.interestedCourse}
                  onChange={(e) => setForm((p) => ({ ...p, interestedCourse: e.target.value }))} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Interested University</Label>
                <Input value={form.interestedUniversity}
                  onChange={(e) => setForm((p) => ({ ...p, interestedUniversity: e.target.value }))} />
              </div>
              <div>
                <Label>Preferred Intake *</Label>
                <Input required value={form.preferredIntake}
                  onChange={(e) => setForm((p) => ({ ...p, preferredIntake: e.target.value }))} />
              </div>
            </div>

            <div>
              <Label>Message *</Label>
              <Textarea required maxLength={2000} value={form.message} rows={5}
                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} />
            </div>

            <TurnstileWidget onVerify={setTurnstileToken} />

            <Button type="submit" variant="accent" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Inquiry"}
            </Button>
          </form>
        </div>
      </section>
    </>
  );
};

export default StudentInquiry;
