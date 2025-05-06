import useSWR from "swr";
import CardList from "@/components/CardList/CardList";
import TitleBar from "@/components/TitleBar/TitleBar";

export default function Home() {
  const { data, isLoading, error } = useSWR("/api/remedies", {
    fallbackData: [],
  });

  if (isLoading) {
    return <TitleBar title="Loading..." />;
  }

  if (error) {
    console.error("Error while fetching index page:", error);
    return <TitleBar title="Internal Server Error!" />;
  }

  return (
    <>
      <TitleBar title="Remedies" />
      <CardList elements={data} />
    </>
  );
}
