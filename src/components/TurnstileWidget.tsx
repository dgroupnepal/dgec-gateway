import { Turnstile } from "@marsidev/react-turnstile";

// Cloudflare test keys: always-pass for development when VITE_TURNSTILE_SITE_KEY is unset.
// Production: set VITE_TURNSTILE_SITE_KEY in Cloudflare Pages environment variables.
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

interface Props {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
}

const TurnstileWidget = ({ onVerify, onExpire, onError }: Props) => {
  if (!SITE_KEY) return null;

  return (
    <Turnstile
      siteKey={SITE_KEY}
      onSuccess={onVerify}
      onExpire={() => { onExpire?.(); onVerify(""); }}
      onError={() => { onError?.(); onVerify(""); }}
    />
  );
};

export default TurnstileWidget;
