import { useState, useCallback, useRef } from "react";
import SuccessPopup, { type SuccessPopupData } from "@/components/SuccessPopup";

interface UseSuccessPopupReturn {
  /** Call this after any successful form submission */
  showPopup: (data?: SuccessPopupData) => void;
  /** Render this in your component JSX — it's null when the popup is closed */
  popup: React.ReactNode;
}

export function useSuccessPopup(defaultOnResubmit?: () => void): UseSuccessPopupReturn {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<SuccessPopupData>({});
  // Guard: prevent duplicate popups being triggered in quick succession
  const openRef = useRef(false);

  const showPopup = useCallback((popupData: SuccessPopupData = {}) => {
    if (openRef.current) return;
    openRef.current = true;
    setData(popupData);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    openRef.current = false;
  }, []);

  const handleResubmit = useCallback(() => {
    handleClose();
    (data.onResubmit ?? defaultOnResubmit)?.();
  }, [data.onResubmit, defaultOnResubmit, handleClose]);

  return {
    showPopup,
    popup: open ? (
      <SuccessPopup
        name={data.name}
        email={data.email}
        onClose={handleClose}
        onResubmit={handleResubmit}
      />
    ) : null,
  };
}
