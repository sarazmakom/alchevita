import useSWR from "swr";
import { useMemo } from "react";

export function useBookmarks() {
  const { data, error, mutate } = useSWR("/api/bookmark-remedies");
  const isLoading = !error && !data;

  // convenience Set of string IDs
  const bookmarkedIds = useMemo(
    () => new Set(data?.map((b) => b.remedyId)),
    [data]
  );

  const toggle = async (remedyId, nextState) => {
    if (nextState) {
      // add bookmark
      await fetch("/api/bookmark-remedies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remedyId }),
      });
    } else {
      // find the bookmark doc for this remedy
      const bookmark = data.find((b) => b.remedyId === remedyId);
      if (bookmark) {
        await fetch(`/api/bookmark-remedies/${bookmark._id}`, {
          method: "DELETE",
        });
      }
    }
    // re-fetch list
    return mutate();
  };

  return { bookmarkedIds, isLoading, error, toggle };
}
