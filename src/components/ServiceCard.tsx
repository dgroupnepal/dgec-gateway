import { type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
}

const ServiceCard = ({ icon: Icon, title, description, ctaText = "Inquire Now", ctaLink = "/contact" }: ServiceCardProps) => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-all duration-200 group">
      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
        <Icon className="w-6 h-6 text-accent" />
      </div>
      <h3 className="font-display font-semibold text-lg text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-4">{description}</p>
      <Button variant="outline" size="sm" asChild>
        <Link to={ctaLink}>{ctaText}</Link>
      </Button>
    </div>
  );
};

export default ServiceCard;
