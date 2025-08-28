"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { exchangeGoogleIdToken } from "@/lib/api";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (credentialResponse: { credential: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: string;
              size?: string;
              shape?: string;
              width?: number;
            }
          ) => void;
        };
      };
    };
  }
}

type GoogleSignInButtonProps = {
  onSignedIn?: () => void;
};

export function GoogleSignInButton({ onSignedIn }: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Load Google Identity Services script
    if (window.google) {
      setReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setReady(true);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!ready || !window.google || !clientId || !buttonRef.current) return;

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (credentialResponse: { credential: string }) => {
          try {
            await exchangeGoogleIdToken(credentialResponse.credential);
            toast.success("Signed in with Google");
            onSignedIn?.();
          } catch {
            toast.error("Google sign-in failed");
          }
        },
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "filled_black",
        size: "large",
        shape: "pill",
        width: 320,
      });
    } catch {
      // noop
    }
  }, [ready, onSignedIn]);

  return <div className="w-full flex justify-center"><div ref={buttonRef} /></div>;
}


