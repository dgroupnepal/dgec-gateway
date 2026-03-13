import { motion } from "framer-motion";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  centered?: boolean;
}

const SectionHeader = ({ badge, title, description, centered = true }: SectionHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mb-12 ${centered ? "text-center" : ""}`}
    >
      {badge && (
        <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent font-medium text-sm mb-4">
          {badge}
        </span>
      )}
      <h2 className="font-display font-bold text-2xl md:text-4xl text-foreground">{title}</h2>
      {description && (
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">{description}</p>
      )}
    </motion.div>
  );
};

export default SectionHeader;
