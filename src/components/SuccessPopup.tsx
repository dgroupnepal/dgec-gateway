import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { X, MessageCircle } from "lucide-react";

export interface SuccessPopupData {
  name?: string;
  email?: string;
  onResubmit?: () => void;
}

interface Props extends SuccessPopupData {
  onClose: () => void;
}

const AUTO_CLOSE_SEC = 6;

// ── Animated SVG checkmark ────────────────────────────────────────────────────
const AnimatedCheck = () => (
  <svg viewBox="0 0 56 56" className="w-16 h-16" fill="none">
    <motion.circle
      cx="28" cy="28" r="26"
      stroke="white" strokeWidth="2.5"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    />
    <motion.path
      d="M16 28.5 L23.5 36 L40 21"
      stroke="white" strokeWidth="3"
      strokeLinecap="round" strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.45, ease: "easeOut" }}
    />
  </svg>
);

// ── Main popup ────────────────────────────────────────────────────────────────
const SuccessPopup = ({ name, email, onClose, onResubmit }: Props) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(AUTO_CLOSE_SEC);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Lock scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Confetti burst
  useEffect(() => {
    const fire = (opts: confetti.Options) =>
      confetti({ ...opts, disableForReducedMotion: true });

    fire({
      particleCount: 80,
      spread: 60,
      origin: { x: 0.5, y: 0.45 },
      colors: ["#1e3a8a", "#3b82f6", "#10b981", "#f59e0b", "#ffffff"],
    });
    const t = setTimeout(() =>
      fire({
        particleCount: 50,
        spread: 80,
        origin: { x: 0.5, y: 0.45 },
        colors: ["#6366f1", "#ec4899", "#10b981"],
      }), 300);
    return () => clearTimeout(t);
  }, []);

  // Auto-close countdown
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCountdown((n) => {
        if (n <= 1) {
          clearInterval(intervalRef.current!);
          onClose();
          return 0;
        }
        return n - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [onClose]);

  const handleGoHome = useCallback(() => {
    onClose();
    navigate("/");
  }, [onClose, navigate]);

  const handleResubmit = useCallback(() => {
    onClose();
    onResubmit?.();
  }, [onClose, onResubmit]);

  return createPortal(
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Blur overlay */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl shadow-2xl"
          initial={{ scale: 0.82, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.88, opacity: 0, y: 16 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
        >
          {/* ── Header gradient ── */}
          <div className="relative bg-gradient-to-br from-[#0f2c6b] via-[#1e3a8a] to-[#1d6f51] px-8 pt-10 pb-14">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Animated orbs */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/10 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            {/* Icon + headline */}
            <div className="flex flex-col items-center text-center gap-4 relative z-10">
              {/* Pulsing ring behind icon */}
              <div className="relative">
                <motion.div
                  className="absolute inset-0 rounded-full bg-emerald-400/30"
                  animate={{ scale: [1, 1.45, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/40">
                  <AnimatedCheck />
                </div>
              </div>

              <div>
                <motion.h2
                  className="text-2xl font-bold text-white font-display"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  Submission Successful!
                </motion.h2>
                <motion.p
                  className="text-blue-100/80 text-sm mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55 }}
                >
                  D Group Education Consultancy Pvt. Ltd.
                </motion.p>
              </div>
            </div>
          </div>

          {/* ── Body ── */}
          <div className="bg-white dark:bg-gray-900 px-8 pt-6 pb-7 -mt-6 rounded-t-2xl relative">
            {/* Progress bar auto-close */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-t-2xl">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: AUTO_CLOSE_SEC, ease: "linear" }}
              />
            </div>

            {/* Message */}
            <motion.p
              className="text-center text-gray-600 dark:text-gray-300 text-sm leading-relaxed"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Thank you for your inquiry. Our team will contact you within{" "}
              <span className="font-semibold text-[#1e3a8a] dark:text-blue-400">24 hours</span>.
            </motion.p>

            {/* Submitted details */}
            {(name || email) && (
              <motion.div
                className="mt-4 bg-gray-50 dark:bg-gray-800 rounded-xl p-3.5 space-y-1.5 border border-gray-100 dark:border-gray-700"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {name && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span className="text-gray-400 dark:text-gray-500 w-12 shrink-0">Name</span>
                    <span className="font-medium text-gray-800 dark:text-gray-100 truncate">{name}</span>
                  </div>
                )}
                {email && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                    <span className="text-gray-400 dark:text-gray-500 w-12 shrink-0">Email</span>
                    <span className="font-medium text-gray-800 dark:text-gray-100 truncate">{email}</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* CTAs */}
            <motion.div
              className="mt-5 flex flex-col gap-2.5"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <button
                onClick={handleGoHome}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#2d5be3] hover:from-[#163071] hover:to-[#2450cc] text-white font-semibold text-sm shadow-md shadow-blue-900/20 transition-all duration-200 hover:shadow-lg hover:shadow-blue-900/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                Go to Home
              </button>

              <button
                onClick={handleResubmit}
                className="w-full py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#1e3a8a] hover:bg-blue-50 dark:hover:bg-blue-950/30 text-gray-700 dark:text-gray-300 hover:text-[#1e3a8a] dark:hover:text-blue-400 font-medium text-sm transition-all duration-200"
              >
                Submit Another Inquiry
              </button>

              <a
                href="https://wa.me/9779868780019"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#25d366] hover:bg-[#1fba59] text-white font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-sm hover:shadow-md hover:shadow-green-900/20"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </motion.div>

            {/* Auto-close hint */}
            <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-4">
              Closing automatically in{" "}
              <span className="tabular-nums font-medium text-gray-500 dark:text-gray-400">
                {countdown}s
              </span>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
};

export default SuccessPopup;
