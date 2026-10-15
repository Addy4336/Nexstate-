import { permanentRedirect } from "next/navigation";

/** The tenant landing page is now the home page; keep old links and bookmarks working. */
export default function TenantsRedirect() {
  permanentRedirect("/");
}
