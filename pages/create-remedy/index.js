import RemedyForm from "@/components/RemedyForm/RemadyForm";
import TitleBar from "@/components/TitleBar/TitleBar";

export default function CreateRemedy() {
  return (
    <>
      <TitleBar title={"Create New Remedy"}></TitleBar>
      <RemedyForm mode="create" />
    </>
  );
}
