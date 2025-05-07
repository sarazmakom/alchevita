import styled from "styled-components";

const StyledSymptomsList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0;
`;

const SymptomPill = styled.li`
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
  if (!symptoms || symptoms.length === 0) return null;

  return (
    <StyledSymptomsList>
      {symptoms.map((symptom, idx) => (
        <SymptomPill key={`${symptom._id}-${idx}`}>{symptom.name}</SymptomPill>
      ))}
    </StyledSymptomsList>
  );
}
