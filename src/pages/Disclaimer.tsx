import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

const Disclaimer = () => (
  <>
    <Helmet>
      <title>Disclaimer - D Group Education Consultancy</title>
      <meta name="description" content="Read the disclaimer for D Group Education Consultancy Pvt. Ltd. (DGEC) website regarding the accuracy of information and services." />
    </Helmet>
    <section className="bg-primary section-padding">
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
          <h1 className="font-display font-bold text-3xl md:text-5xl text-primary-foreground mb-4">Disclaimer</h1>
          <p className="text-primary-foreground/70 text-lg">Last updated: March 2026</p>
        </motion.div>
      </div>
    </section>
    <section className="section-padding">
      <div className="container-custom max-w-3xl prose prose-neutral">
        <h2 className="font-display font-bold text-xl mb-3">General Information</h2>
        <p className="text-muted-foreground mb-6">The information provided on this website (dgroupeducation.com) by D Group Education Consultancy Pvt. Ltd. (DGEC) is for general informational purposes only. All information on the site is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.</p>

        <h2 className="font-display font-bold text-xl mb-3">Professional Disclaimer</h2>
        <p className="text-muted-foreground mb-6">DGEC provides education counseling, visa support guidance, and travel services. We are not a law firm and do not provide legal advice. Visa decisions are made solely by the respective embassies and immigration authorities. While we strive to provide accurate and up-to-date information, visa requirements and immigration policies may change without notice. We recommend verifying all information with the relevant embassy or official sources.</p>

        <h2 className="font-display font-bold text-xl mb-3">No Guarantee of Visa Approval</h2>
        <p className="text-muted-foreground mb-6">DGEC assists students with visa documentation and application preparation, but we do not guarantee visa approval. The final decision rests with the immigration authorities of the destination country. Our services are designed to help you submit the strongest possible application.</p>

        <h2 className="font-display font-bold text-xl mb-3">External Links</h2>
        <p className="text-muted-foreground mb-6">This website may contain links to external websites that are not provided or maintained by DGEC. We do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.</p>

        <h2 className="font-display font-bold text-xl mb-3">Errors and Omissions</h2>
        <p className="text-muted-foreground mb-6">While we have made every attempt to ensure that the information contained on this site is accurate, DGEC is not responsible for any errors or omissions, or for the results obtained from the use of this information. Information is provided "as is" with no guarantee of completeness, accuracy, or timeliness.</p>

        <h2 className="font-display font-bold text-xl mb-3">Fair Use</h2>
        <p className="text-muted-foreground mb-6">This website may contain copyrighted material, the use of which has not always been specifically authorized by the copyright owner. Such material is made available for educational and informational purposes only. We believe this constitutes "fair use" of any such copyrighted material.</p>

        <h2 className="font-display font-bold text-xl mb-3">Contact</h2>
        <p className="text-muted-foreground">If you have any questions about this Disclaimer, please contact us at:<br />Email: info@dgroupeducation.com<br />Phone: +977-01-5927395<br />Address: Kalanki-14, Kathmandu, Nepal</p>
      </div>
    </section>
  </>
);

export default Disclaimer;
