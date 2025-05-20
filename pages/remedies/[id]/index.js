import { useRouter } from "next/router";
import useSWR from "swr";
import DetailPage from "@/components/DetailPage/DetailPage";
import { useSession } from "next-auth/react";

export default function Detail() {
  const router = useRouter();
  const { id } = router.query;
  const {
    data: remedy,
    isLoading,
    error,
  } = useSWR(id ? `/api/remedies/${id}` : null);
  const { data: session } = useSession();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    console.error("Error while fetching index page:", error);
    return <div>Internal Server Error!</div>;
  }

  const isOwner = session?.user?.id === remedy?.ownerId;

  return <DetailPage element={remedy} isOwner={isOwner} />;
}
