import useSWR from "swr";
import RemedyForm from "@/components/RemedyForm/RemadyForm";
import TitleBar from "@/components/TitleBar/TitleBar";

export default function CreateRemedy() {
  const { data: symptoms = [], error, isLoading } = useSWR("/api/symptoms");

  if (isLoading) return <p>Loading symptoms...</p>;
  if (error) return <p>Failed to load symptoms.</p>;

  return (
    <>
      <TitleBar title={"Create New Remedy"}></TitleBar>
      <RemedyForm symptomsList={symptoms} mode="create" />
    </>
  );
}
