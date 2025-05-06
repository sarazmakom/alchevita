import useSWR from "swr";
import TitleBar from "@/components/TitleBar/TitleBar";
import CardList from "@/components/CardList/CardList";
import { useBookmarks } from "@/hooks/useBookmarks";

export default function BookmarksPage() {
  // fetch all remedies
  const {
    data: remedies = [],
    error: remediesError,
    isLoading: loadingRemedies,
  } = useSWR("/api/remedies");

  // fetch only bookmarked IDs
  const {
    bookmarkedIds,
    isLoading: loadingBookmarks,
    error: bookmarksError,
    toggle: toggleBookmark,
  } = useBookmarks();

  const isLoading = loadingRemedies || loadingBookmarks;
  const error = remediesError || bookmarksError;

  if (isLoading) {
    return <TitleBar title="Loading bookmarked remedies…" />;
  }
  if (error) {
    console.error("Error fetching bookmarked remedies:", error);
    return <TitleBar title="Error loading bookmarks" />;
  }

  // filter to only those remedies whose IDs are in the bookmark set
  const bookmarkedRemedies = remedies.filter((r) => bookmarkedIds.has(r._id));

  return (
    <>
      <TitleBar title="Bookmarked Remedies" />
      <CardList
        elements={bookmarkedRemedies}
        bookmarkedIds={bookmarkedIds}
        onBookmarkToggle={toggleBookmark}
      />
    </>
  );
}
