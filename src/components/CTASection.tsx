import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface CTASectionProps {
  headline: string;
  description?: string;
  primaryCta: { label: string; link: string };
  secondaryCta?: { label: string; link: string };
}

const CTASection = ({ headline, description, primaryCta, secondaryCta }: CTASectionProps) => {
  return (
    <section className="bg-primary section-padding">
      <div className="container-custom text-center">
        <h2 className="font-display font-bold text-2xl md:text-4xl text-primary-foreground mb-4">{headline}</h2>
        {description && <p className="text-primary-foreground/70 max-w-2xl mx-auto mb-8 text-lg">{description}</p>}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="accent" size="lg" asChild>
            <Link to={primaryCta.link}>{primaryCta.label}</Link>
          </Button>
          {secondaryCta && (
            <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link to={secondaryCta.link}>{secondaryCta.label}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
