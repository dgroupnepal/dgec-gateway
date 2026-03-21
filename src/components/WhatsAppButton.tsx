import { MessageCircle } from "lucide-react";
import { useState } from "react";

const whatsappLinks = [
  { label: "Nepal", href: "https://wa.me/9779868780019", flag: "🇳🇵" },
  { label: "Korea", href: "https://wa.me/821075292059", flag: "🇰🇷" },
];

const WhatsAppButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="flex flex-col gap-2 mb-1 animate-fade-in-up">
          {whatsappLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-success text-success-foreground text-sm font-medium shadow-lg hover:scale-105 transition-transform whitespace-nowrap"
            >
              <span>{link.flag}</span> WhatsApp {link.label}
            </a>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-success text-success-foreground flex items-center justify-center shadow-xl hover:scale-110 transition-transform ring-4 ring-success/20"
        aria-label="Chat with DGEC on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </button>
    </div>
  );
};

export default WhatsAppButton;
