import { useSWRConfig } from "swr";

export function useBookmarks() {
  const { mutate } = useSWRConfig();

  const toggle = async (remedyId, isBookmarked, currentPath) => {
    console.log("TOGGLE START", {
      remedyId,
      isBookmarked,
      currentPath,
    });
    // 2. Get current cache keys to revalidate
    const baseKey =
      currentPath === "/bookmark-remedies"
        ? "/api/remedies?bookmarked=true"
        : "/api/remedies";
    try {
      // 1. Prepare API call
      const method = isBookmarked ? "DELETE" : "POST";
      const endpoint =
        method === "DELETE"
          ? `/api/bookmark-remedies/${remedyId}`
          : "/api/bookmark-remedies";

      // 3. Optimistic update pattern
      const optimisticUpdate = (data) => {
        if (!data) return data;
        return data.map((remedy) =>
          remedy._id === remedyId
            ? { ...remedy, isBookmarked: !isBookmarked }
            : remedy
        );
      };

      // 4. Perform optimistic update
      mutate(baseKey, optimisticUpdate, false);

      // 5. Make the actual API call
      const response = await fetch(endpoint, {
        method,
        ...(method === "POST" && {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ remedy: remedyId }),
        }),
      });

      if (!response.ok) throw new Error("Bookmark update failed");

      // 6. Revalidate all relevant endpoints
      mutate((key) => key.startsWith("/api/remedies"));
    } catch (error) {
      console.error("Bookmark operation failed:", error);
      // Rollback optimistic update
      mutate(baseKey);
    }
  };

  return { toggle };
}
