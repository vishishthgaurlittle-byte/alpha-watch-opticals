// ============================================================
// Insforge SDK SHIM
// Import and wrap the official Insforge SDK here when going
// live. For the demo, the app uses the local persistent
// data layer (see ./db.ts) which mirrors the same schema.
// ============================================================
export const INFORGE = {
  projectId: process.env.INFORGE_PROJECT_ID || "56db6791-86fa-4c7f-9142-29b0211d47c3",
  apiKey: process.env.INFORGE_API_KEY || "",
  url: process.env.INFORGE_URL || "https://4bnre66i.ap-southeast.insforge.app/",
  version: process.env.INFORGE_VERSION || "v2.3.1"
};

// Helpers to detect whether real Insforge is configured
export const isInsforgeLive = Boolean(process.env.INFORGE_API_KEY);

export async function insforgeFetch(path: string, init?: RequestInit) {
  // Placeholder for real REST integration. Currently routes to local layer.
  const res = await fetch(INFORGE.url + path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": INFORGE.apiKey,
      ...(init?.headers || {})
    }
  });
  if (!res.ok) throw new Error("Insforge request failed: " + res.status);
  return res.json();
}
