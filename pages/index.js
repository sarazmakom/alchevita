import useSWR from "swr";
import { useState } from "react";
import { useRouter } from "next/router";
import CardList from "@/components/CardList/CardList";
import TitleBar from "@/components/TitleBar/TitleBar";
import styled from "styled-components";
import RemedyFilter from "@/components/RemedyFilter/RemedyFilter";

const EmptyMessage = styled.p`
  margin: 2rem 0;
  text-align: center;
  color: #666;
`;

export default function Home({ initialSymptom }) {
  const router = useRouter();
  const [selectedSymptom, setSelectedSymptom] = useState(initialSymptom || "");

  const handleSelect = (symptomName) => {
    setSelectedSymptom(symptomName);
    router.push(
      {
        pathname: "/",
        query: symptomName ? { symptom: symptomName } : {},
      },
      undefined,
      { shallow: true }
    );
  };

  const handleClear = () => {
    setSelectedSymptom("");
    router.push({ pathname: "/", query: {} }, undefined, { shallow: true });
  };

  const {
    data: remedies = [],
    isLoading,
    error,
  } = useSWR(
    selectedSymptom
      ? `/api/remedies?symptom=${selectedSymptom}`
      : "/api/remedies",
    { fallbackData: [] }
  );

  return (
    <>
      <TitleBar title="Remedies" />
      <RemedyFilter
        selectedSymptom={selectedSymptom}
        onSelect={handleSelect}
        onClear={handleClear}
      />
      
      {isLoading && <TitleBar title="Loading..." />}
      {error && <TitleBar title="Internal server Error!" />}
      {!isLoading && !error && remedies.length === 0 && (
        <EmptyMessage>No matching remedies found</EmptyMessage>
      )}

      {!isLoading && !error && remedies.length > 0 && (
        <CardList elements={remedies} />
      )}
    </>
  );
}

export async function getServerSideProps({ query }) {
  return {
    props: {
      initialSymptom: query.symptom || "",
    },
  };
}
