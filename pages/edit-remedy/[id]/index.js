import { useRouter } from "next/router";
import useSWR from "swr";
import RemedyForm from "@/components/RemedyForm/RemedyForm";
import TitleBar from "@/components/TitleBar/TitleBar";
import styled from "styled-components";
import { useState } from "react";

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  padding: 0 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  transition: background 0.2s ease-in-out;

  &.update {
    background-color: #1fab89;
    color: white;
  }

  &.cancel {
    background-color: #f8d7da;
    color: rgb(226, 10, 64);
    border: 1px solid rgb(235, 151, 159);

    &:hover {
      background-color: #f1c0c4;
    }
  }
`;

const Toast = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background-color: #1fab89;
  color: white;
  padding: 1rem 2rem;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;
  z-index: 9999;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

export default function EditRemedy() {
  const router = useRouter();
  const { id } = router.query;
  const {
    data: remedy,
    isLoading,
    error,
  } = useSWR(id ? `/api/remedies/${id}` : null);
  const [showToast, setShowToast] = useState(false);

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
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setShowToast(true);
      setTimeout(() => {
        router.push(`/remedies/${id}`);
      }, 1500); // Show toast for 1.5 seconds before redirecting
    } else {
      alert("Failed to update remedy");
    }
  }

  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel? Any unsaved changes will be lost."
      )
    ) {
      router.push(`/remedies/${id}`);
    }
  };

  if (isLoading) return <TitleBar title="Loading..." />;
  if (error) return <TitleBar title="Error loading remedy" />;
  if (!remedy) return <TitleBar title="Remedy not found" />;

  return (
    <>
      <TitleBar title="Edit Remedy" />
      <RemedyForm mode="edit" onSubmit={handleEdit} initialData={remedy} />
      <ButtonContainer>
        <Button className="cancel" onClick={handleCancel}>
          Cancel
        </Button>
      </ButtonContainer>
      {showToast && <Toast>Remedy updated successfully!</Toast>}
    </>
  );
}
