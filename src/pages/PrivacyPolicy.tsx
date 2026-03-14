import { motion } from "framer-motion";

const PrivacyPolicy = () => (
  <>
    <section className="bg-primary section-padding">
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
          <h1 className="font-display font-bold text-3xl md:text-5xl text-primary-foreground mb-4">Privacy Policy</h1>
          <p className="text-primary-foreground/70 text-lg">Last updated: March 2026</p>
        </motion.div>
      </div>
    </section>
    <section className="section-padding">
      <div className="container-custom max-w-3xl prose prose-neutral">
        <h2 className="font-display font-bold text-xl mb-3">1. Information We Collect</h2>
        <p className="text-muted-foreground mb-6">We collect personal information you provide when using our services, including your full name, phone number, email address, passport details, academic records, and any documents you upload through our portal. We also collect usage data such as browser type, IP address, and pages visited.</p>

        <h2 className="font-display font-bold text-xl mb-3">2. How We Use Your Information</h2>
        <p className="text-muted-foreground mb-6">Your information is used to provide education counseling, process university applications, assist with visa documentation, book travel services, and communicate with you about your inquiries. We do not sell your personal data to third parties.</p>

        <h2 className="font-display font-bold text-xl mb-3">3. Data Sharing</h2>
        <p className="text-muted-foreground mb-6">We may share your information with partner universities, embassy/visa offices, and travel service providers solely for the purpose of fulfilling the services you requested. All sharing is done with appropriate safeguards.</p>

        <h2 className="font-display font-bold text-xl mb-3">4. Data Security</h2>
        <p className="text-muted-foreground mb-6">We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Documents uploaded to our system are stored securely and accessible only by authorized team members.</p>

        <h2 className="font-display font-bold text-xl mb-3">5. Your Rights</h2>
        <p className="text-muted-foreground mb-6">You have the right to access, correct, or request deletion of your personal data. To exercise these rights, please contact us at info@dgroup.edu.np.</p>

        <h2 className="font-display font-bold text-xl mb-3">6. Cookies</h2>
        <p className="text-muted-foreground mb-6">Our website may use cookies to improve your browsing experience. You can control cookie preferences through your browser settings.</p>

        <h2 className="font-display font-bold text-xl mb-3">7. Contact Us</h2>
        <p className="text-muted-foreground">If you have questions about this Privacy Policy, contact us at:<br />Email: info@dgroup.edu.np<br />Phone: +977-015927395<br />Address: Kalanki-14, Kathmandu, Nepal</p>
      </div>
    </section>
  </>
);

export default PrivacyPolicy;
