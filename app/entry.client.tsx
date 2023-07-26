import { RemixBrowser } from "@remix-run/react";
import { Buffer } from "buffer-polyfill";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";

// Polyfills for connectors that use QR codes
window.global = window.global ?? window;
window.Buffer = window.Buffer ?? Buffer;
window.process = window.process ?? { env: {} };

function hydrate() {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <RemixBrowser />
      </StrictMode>
    );
  });
}

if (typeof requestIdleCallback === "function") {
  requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  setTimeout(hydrate, 1);
}
