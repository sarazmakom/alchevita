import { useSWRConfig } from "swr";

export function useBookmarks() {
  const { mutate } = useSWRConfig();

  const toggle = async (remedyId, isBookmarked) => {
    try {
      if (isBookmarked) {
        // DELETE to /api/bookmark-remedies/[remedyId]
        await fetch(`/api/bookmark-remedies/${remedyId}`, {
          method: "DELETE",
        });
      } else {
        // POST to /api/bookmark-remedies
        await fetch("/api/bookmark-remedies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ remedyId }),
        });
      }

      // Revalidate data
      mutate("/api/remedies?bookmarked=true");
      mutate("/api/remedies");
    } catch (error) {
      console.error("Bookmark operation failed:", error);
    }
  };

  return { toggle };
}
