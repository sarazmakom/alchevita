import useSWR from "swr";
import TitleBar from "@/components/TitleBar/TitleBar";
import CardList from "@/components/CardList/CardList";
import Router from "next/router";

export default function BookmarksPage() {
  const {
    data: remedies = [],
    error: remediesError,
    isLoading: loadingRemedies,
  } = useSWR("/api/remedies?bookmarked=true");

  if (loadingRemedies) {
    return <TitleBar title="Loading bookmarked remedies…" />;
  }
  if (remediesError) {
    console.error("Error fetching bookmarked remedies:", remediesError);
    return <TitleBar title="Error loading bookmarks" />;
  }

  const currentPath = Router.pathname;

  return (
    <>
      <TitleBar title="Your Remedies" />
      <CardList elements={remedies} currentPath={currentPath} />
    </>
  );
}
