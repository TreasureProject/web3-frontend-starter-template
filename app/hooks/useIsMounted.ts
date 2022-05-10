import { useEffect, useState } from "react";

// Use this hook to detect if the component is mounted or not to display web3 things only when the component is mounted
export function useIsMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return mounted;
}
