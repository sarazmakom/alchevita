import useSWR from "swr";

export default function Home() {
  const { data, isLoading, error } = useSWR("/api/remedies", {
    fallbackData: [],
  });

  return (
    <div>
      <h1>Hello from Next.js</h1>
    </div>
  );
}
