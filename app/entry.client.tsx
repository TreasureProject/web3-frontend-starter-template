import { RemixBrowser } from "@remix-run/react";
import { hydrate } from "react-dom";
import { Buffer } from "buffer";

// polyfill Buffer for client
if (!window.Buffer) {
  window.Buffer = Buffer;
}
hydrate(<RemixBrowser />, document);
