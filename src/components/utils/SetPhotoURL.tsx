import { useEffect, useState } from "react";

export default function SetPhotoURL({ facilitator }: { facilitator: any }) {
  const [photoUrl, setPhotoUrl] = useState(
    new URL("/facilitator-photos/placeholder.jpg", import.meta.url).toString()
  );

  useEffect(() => {
    async function fetchPhotoUrl() {
      try {
        const url = new URL(
          `/facilitator-photos/${facilitator.firstName}${facilitator.lastName}.jpg`,
          import.meta.url
        ).toString();
        const response = await fetch(url);
        if (response.ok) {
          setPhotoUrl(url);
        }
      } catch (error) {
        // Error handling can be added here
      }
    }

    fetchPhotoUrl();
  }, [facilitator]);

  return photoUrl;
}


