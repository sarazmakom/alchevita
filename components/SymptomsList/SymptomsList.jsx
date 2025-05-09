import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";

const StyledSymptomsList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0;
`;

const SymptomPill = styled(Link)`
  background-color: #f3f4f6;
  border-radius: 1rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;

  @media (min-width: 640px) {
    font-size: 0.875rem;
    padding: 0.375rem 0.875rem;
  }
`;

export default function SymptomsList({ symptoms }) {
  const router = useRouter();

  if (!symptoms || symptoms.length === 0) return null;

  return (
    <StyledSymptomsList>
      {symptoms.map((symptom) => (
        <SymptomPill
          key={symptom._id}
          href={{
            pathname: router.pathname,
            query: { ...router.query, symptom: symptom.name },
          }}
          shallow
          passHref
          scroll={false}
        >
          {symptom.name}
        </SymptomPill>
      ))}
    </StyledSymptomsList>
  );
}
