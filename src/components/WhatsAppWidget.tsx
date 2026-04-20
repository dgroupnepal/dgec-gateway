import { useState, useRef, useEffect } from "react";
import { X, MessageCircle } from "lucide-react";

const NEPAL_NUMBER = "9779868780019";
const KOREA_NUMBER = "821075292059";
const PRE_FILLED_MSG = encodeURIComponent(
  "Hello DGEC! 👋 I'm interested in your study abroad / visa services. Can you help me?"
);

const contacts = [
  {
    label: "Nepal Office",
    number: "+977 9868-780019",
    flag: "🇳🇵",
    href: `https://wa.me/${NEPAL_NUMBER}?text=${PRE_FILLED_MSG}`,
  },
  {
    label: "Korea Office",
    number: "+82 10-7529-2059",
    flag: "🇰🇷",
    href: `https://wa.me/${KOREA_NUMBER}?text=${PRE_FILLED_MSG}`,
  },
];

const WhatsAppWidget = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat popup */}
      {open && (
        <div className="w-[300px] bg-background rounded-2xl shadow-2xl border border-border overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200">
          {/* Header */}
          <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] rounded-full border-2 border-[#075E54]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm leading-tight">DGEC Support</p>
              <p className="text-white/70 text-xs">D Group Education Consultancy</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white transition-colors p-1 rounded-full"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-[#ECE5DD]">
            {/* Chat bubble */}
            <div className="bg-white rounded-xl rounded-tl-sm p-3 shadow-sm max-w-[85%] mb-4">
              <p className="text-sm text-gray-800 leading-relaxed">
                👋 Hi there! How can we help you today?
              </p>
              <p className="text-[10px] text-gray-400 mt-1 text-right">DGEC Team</p>
            </div>

            {/* Business hours */}
            <p className="text-xs text-gray-500 text-center mb-4">
              🕐 Sun–Fri 10 AM – 5 PM (NPT) · Typically replies within minutes
            </p>
          </div>

          {/* Contact buttons */}
          <div className="p-3 bg-background space-y-2">
            <p className="text-xs text-muted-foreground font-medium px-1 mb-2">Choose an office:</p>
            {contacts.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white transition-colors group"
                onClick={() => setOpen(false)}
              >
                <span className="text-xl">{c.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-tight">{c.label}</p>
                  <p className="text-white/80 text-xs">{c.number}</p>
                </div>
                <MessageCircle className="w-4 h-4 text-white/80 group-hover:text-white shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Floating trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat with DGEC on WhatsApp"
        className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-95"
        style={{ backgroundColor: "#25D366" }}
      >
        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ backgroundColor: "#25D366" }} />
        )}
        {open ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        )}
      </button>
    </div>
  );
};

export default WhatsAppWidget;
