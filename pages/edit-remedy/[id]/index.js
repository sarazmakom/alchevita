import { useRouter } from "next/router";
import dbConnect from "@/db/connect";
import RemedyForm from "@/components/RemedyForm/RemedyForm";
import styled from "styled-components";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { useState } from "react";

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

export default function EditRemedy({ remedy }) {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);

  async function handleEdit(formData) {
    let imageUrl = remedy.imageUrl;

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
    const res = await fetch(`/api/remedies/${remedy._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setShowToast(true);
      setTimeout(() => {
        router.push(`/remedies/${remedy._id}`);
      }, 1500);
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
      router.push(`/remedies/${remedy._id}`);
    }
  };

  return (
    <>
      <RemedyForm mode="edit" onSubmit={handleEdit} initialData={remedy} />

      {showToast && <Toast>Remedy updated successfully!</Toast>}
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const mongoose = (await import("mongoose")).default;
  const { Remedy } = await import("@/db/models/Remedy");
  await import("@/db/models/Symptom"); // registers Symptom schema for populate

  await dbConnect();
  const remedyDoc = await Remedy.findById(context.params.id)
    .populate("symptoms")
    .lean();
  if (!remedyDoc) {
    return { notFound: true };
  }

  const isOwner = remedyDoc.ownerId?.toString() === session.user.id;
  if (!isOwner) {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }

  // Serialize fields
  const remedy = {
    _id: remedyDoc._id.toString(),
    title: remedyDoc.title,
    imageUrl: remedyDoc.imageUrl,
    ingredients: remedyDoc.ingredients,
    preparation: remedyDoc.preparation || "",
    usage: remedyDoc.usage || "",
    ownerId: remedyDoc.ownerId.toString(),
    symptoms: remedyDoc.symptoms.map((s) => ({
      _id: s._id.toString(),
      name: s.name,
    })),
  };

  return {
    props: { remedy },
  };
}
