import { useEffect, useRef, useCallback } from 'react';

const GSI_SCRIPT = 'https://accounts.google.com/gsi/client';

/**
 * Load Google Identity Services script once.
 */
function loadScript(clientId) {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }
    const existing = document.querySelector(`script[src^="${GSI_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      return;
    }
    const script = document.createElement('script');
    script.src = `${GSI_SCRIPT}?client_id=${encodeURIComponent(clientId)}`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Sign-In'));
    document.head.appendChild(script);
  });
}

/**
 * Renders the "Sign in with Google" button and calls onSuccess(credential) with the ID token.
 * Requires VITE_GOOGLE_CLIENT_ID to be set (same as backend GOOGLE_CLIENT_ID).
 */
export default function GoogleSignIn({ onSuccess, onError, disabled = false }) {
  const containerRef = useRef(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  const handleCredential = useCallback(
    (response) => {
      if (response?.credential) {
        onSuccess?.(response.credential);
      }
    },
    [onSuccess]
  );

  useEffect(() => {
    if (!clientId || !containerRef.current) return;

    let mounted = true;

    loadScript(clientId)
      .then(() => {
        if (!mounted || !containerRef.current || !window.google?.accounts?.id) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredential,
        });
        const el = containerRef.current;
        const w = el.offsetWidth || 320;
        window.google.accounts.id.renderButton(el, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          width: Math.min(w, 400),
        });
      })
      .catch((err) => {
        if (mounted) onError?.(err.message);
      });

    return () => {
      mounted = false;
    };
  }, [clientId, handleCredential, onError]);

  if (!clientId) {
    return null;
  }

  return (
    <div
      className="google-signin-wrapper"
      ref={containerRef}
      style={{ opacity: disabled ? 0.6 : 1, pointerEvents: disabled ? 'none' : 'auto' }}
      aria-hidden={disabled}
    />
  );
}
