import { MessageCircle } from "lucide-react";
import { useState } from "react";

const WhatsAppButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <a
      href="https://wa.me/9779868780019"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Chat with DGEC on WhatsApp"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {showTooltip && (
        <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-medium whitespace-nowrap shadow-lg">
          Chat with DGEC
        </span>
      )}
      <div className="w-14 h-14 rounded-full bg-success text-success-foreground flex items-center justify-center shadow-xl hover:scale-110 transition-transform ring-4 ring-success/20">
        <MessageCircle className="w-7 h-7" />
      </div>
    </a>
  );
};

export default WhatsAppButton;
