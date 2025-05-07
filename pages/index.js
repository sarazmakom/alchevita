import useSWR from "swr";
import CardList from "@/components/CardList/CardList";
import TitleBar from "@/components/TitleBar/TitleBar";
import { useBookmarks } from "@/hooks/useBookmarks";

export default function Home() {
  const {
    data: remedies = [],
    isLoading: loadingRemedies,
    error: remediesError,
  } = useSWR("/api/remedies");

  const {
    bookmarkedIds,
    isLoading: loadingBookmarks,
    error: bookmarksError,
    toggle: toggleBookmark,
  } = useBookmarks();

  const isLoading = loadingRemedies || loadingBookmarks;
  const error = remediesError || bookmarksError;

  if (isLoading) {
    return <TitleBar title="Loading…" />;
  }
  if (error) {
    console.error(error);
    return <TitleBar title="Error fetching data" />;
  }

  return (
    <>
      <TitleBar title="Remedies" />
      <CardList
        elements={remedies}
        bookmarkedIds={bookmarkedIds}
        onBookmarkToggle={toggleBookmark}
      />
    </>
  );
}
