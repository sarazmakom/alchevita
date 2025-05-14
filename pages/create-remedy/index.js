import RemedyForm from "@/components/RemedyForm/RemadyForm";
import TitleBar from "@/components/TitleBar/TitleBar";
import { useRouter } from "next/router";

export default function CreateRemedy() {
  const router = useRouter();

  async function handleCreate(payload) {
    const res = await fetch("/api/remedies/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/");
    }
  }
  return (
    <>
      <TitleBar title={"Create New Remedy"}></TitleBar>
      <RemedyForm onSubmit={handleCreate} mode="create" />
    </>
  );
}
