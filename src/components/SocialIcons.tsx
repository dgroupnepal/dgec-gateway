import { Facebook, Instagram, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";

const socials = [
  { icon: Facebook, href: "https://www.facebook.com/dgroupeducation", label: "Facebook" },
  {
    icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1-.15z" />
      </svg>
    ),
    href: "https://www.tiktok.com/@dgroupeducation",
    label: "TikTok",
  },
  { icon: Instagram, href: "https://www.instagram.com/dgroupeducation/", label: "Instagram" },
  { icon: Youtube, href: "https://www.youtube.com/@DTechnologyOffice", label: "YouTube" },
];

interface SocialIconsProps {
  variant?: "light" | "dark";
  size?: "sm" | "md";
  className?: string;
}

const SocialIcons = ({ variant = "dark", size = "md", className }: SocialIconsProps) => {
  const baseClasses = size === "sm" ? "w-7 h-7" : "w-9 h-9";
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {socials.map((s) => {
        const Icon = s.icon;
        return (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className={cn(
              "rounded-lg flex items-center justify-center transition-colors",
              baseClasses,
              variant === "light"
                ? "bg-primary-foreground/10 text-primary-foreground hover:bg-accent hover:text-accent-foreground"
                : "bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground"
            )}
          >
            <Icon className={iconSize} />
          </a>
        );
      })}
    </div>
  );
};

export default SocialIcons;
