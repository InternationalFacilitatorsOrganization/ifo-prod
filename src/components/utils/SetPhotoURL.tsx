import { useEffect, useState } from "react";

export default function SetPhotoURL({ facilitator }: { facilitator: any }) {
  const placeholderUrl = "/facilitator-photos/placeholder.jpg";
  const [photoUrl, setPhotoUrl] = useState(placeholderUrl);

  useEffect(() => {
    async function fetchPhotoUrl() {
      // Strip apostrophes from last name to match the static file naming convention
      const lastNameClean = (facilitator.lastName || "").replace(/'/g, "");
      const staticUrl = `/facilitator-photos/${facilitator.firstName}${lastNameClean}.jpg`;

      try {
        // Try the static file first
        const staticResponse = await fetch(staticUrl, { method: "HEAD" });
        if (staticResponse.ok) {
          setPhotoUrl(staticUrl);
          return;
        }
      } catch {
        // ignore
      }

      try {
        // Fall back to DB blob via API
        const dbUrl = `/api/facilitators/${facilitator.id}/photo`;
        const dbResponse = await fetch(dbUrl, { method: "HEAD" });
        if (dbResponse.ok) {
          setPhotoUrl(dbUrl);
          return;
        }
      } catch {
        // ignore
      }

      // Stays on placeholder
    }

    fetchPhotoUrl();
  }, [facilitator]);

  return photoUrl;
}


