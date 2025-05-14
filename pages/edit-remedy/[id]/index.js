import { useRouter } from "next/router";
import useSWR from "swr";
import RemedyForm from "@/components/RemedyForm/RemedyForm";
import TitleBar from "@/components/TitleBar/TitleBar";

export default function EditRemedy() {
  const router = useRouter();
  const { id } = router.query;
  const {
    data: remedy,
    isLoading,
    error,
  } = useSWR(id ? `/api/remedies/${id}` : null);

  async function handleEdit(formData) {
    let imageUrl = remedy.imageUrl; // Keep existing image by default

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
    const res = await fetch(`/api/remedies/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push(`/remedies/${id}`);
    } else {
      alert("Failed to update remedy");
    }
  }

  if (isLoading) return <TitleBar title="Loading..." />;
  if (error) return <TitleBar title="Error loading remedy" />;
  if (!remedy) return <TitleBar title="Remedy not found" />;

  return (
    <>
      <TitleBar title="Edit Remedy" />
      <RemedyForm mode="edit" onSubmit={handleEdit} initialData={remedy} />
    </>
  );
}
