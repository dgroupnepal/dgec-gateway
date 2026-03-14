import { motion } from "framer-motion";

const TermsConditions = () => (
  <>
    <section className="bg-primary section-padding">
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
          <h1 className="font-display font-bold text-3xl md:text-5xl text-primary-foreground mb-4">Terms & Conditions</h1>
          <p className="text-primary-foreground/70 text-lg">Last updated: March 2026</p>
        </motion.div>
      </div>
    </section>
    <section className="section-padding">
      <div className="container-custom max-w-3xl prose prose-neutral">
        <h2 className="font-display font-bold text-xl mb-3">1. Services</h2>
        <p className="text-muted-foreground mb-6">D Group Education Consultancy Pvt. Ltd. (DGEC) provides education counseling, university admission assistance, visa guidance, document preparation support, air ticketing, hotel reservation, and travel insurance services. Our services are advisory in nature — we assist and guide but do not guarantee admission, visa approval, or any specific outcome.</p>

        <h2 className="font-display font-bold text-xl mb-3">2. Eligibility</h2>
        <p className="text-muted-foreground mb-6">By using our services, you confirm that all information provided is accurate, complete, and truthful. You must be at least 16 years of age or have parental consent to use our services.</p>

        <h2 className="font-display font-bold text-xl mb-3">3. Fees and Payments</h2>
        <p className="text-muted-foreground mb-6">Service fees are communicated upfront before any engagement. Fees for third-party services (university application fees, visa fees, flight tickets) are separate and payable directly. Refund policies vary by service and will be explained before engagement.</p>

        <h2 className="font-display font-bold text-xl mb-3">4. Limitation of Liability</h2>
        <p className="text-muted-foreground mb-6">DGEC is not responsible for decisions made by universities, embassies, airlines, or other third-party organizations. We provide guidance and support but cannot guarantee specific results. We are not liable for any delays, rejections, or losses arising from third-party decisions.</p>

        <h2 className="font-display font-bold text-xl mb-3">5. Document Handling</h2>
        <p className="text-muted-foreground mb-6">Documents submitted through our website or in-person are handled with care and confidentiality. We are not responsible for documents lost during submission to third parties (universities, embassies). We recommend keeping copies of all submitted documents.</p>

        <h2 className="font-display font-bold text-xl mb-3">6. Intellectual Property</h2>
        <p className="text-muted-foreground mb-6">All content on this website, including text, images, logos, and design elements, is the property of D Group Education Consultancy Pvt. Ltd. and is protected by applicable copyright laws.</p>

        <h2 className="font-display font-bold text-xl mb-3">7. Changes to Terms</h2>
        <p className="text-muted-foreground mb-6">DGEC reserves the right to update these Terms & Conditions at any time. Continued use of our services after changes constitutes acceptance of the updated terms.</p>

        <h2 className="font-display font-bold text-xl mb-3">8. Contact</h2>
        <p className="text-muted-foreground">For questions about these terms, contact us at:<br />Email: info@dgroup.edu.np<br />Phone: +977-015927395<br />Address: Kalanki-14, Kathmandu, Nepal</p>
      </div>
    </section>
  </>
);

export default TermsConditions;
