import RemedyForm from "@/components/RemedyForm/RemedyForm";
import TitleBar from "@/components/TitleBar/TitleBar";
import { useRouter } from "next/router";

export default function CreateRemedy() {
  const router = useRouter();

  async function handleCreate(formData) {
    let imageUrl = "";
    if (formData.imageFile) {
      const fd = new FormData();
      fd.append("image", formData.imageFile);
      const up = await fetch("/api/remedies/upload", {
        method: "POST",
        body: fd,
      });
      if (!up.ok) {
        alert("⚠️ Image upload failed – please try another file");
        return;
      }
      const { imageUrl: url } = await up.json();
      imageUrl = url;
    }

    const payload = { ...formData, imageUrl };
    const res = await fetch("/api/remedies/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) router.push("/");
    else alert("Failed to create remedy");
  }

  return (
    <>
      <TitleBar title="Create New Remedy" />
      <RemedyForm mode="create" onSubmit={handleCreate} />
    </>
  );
}
