import { useRouter } from "next/router";
import useSWR from "swr";
export default function Detail() {
  const router = useRouter();
  const { id } = router.query;
  const { data: remedy, isLoading, error } = useSWR(`/api/remedies/${id}`);
  console.log("Error", error);

  !error && !isLoading ? console.log("remedy", remedy) : null;
  return <></>;
}
