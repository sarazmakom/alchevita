import useSWR from "swr";
import styled from "styled-components";

const FilterWrapper = styled.section`
  margin: 1.5rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  padding: 1rem 2rem;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(155, 255, 255, 0.1);
  max-width: 800px;
  gap: 0.75rem;
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background-color: #f9fafb;
  font-size: 1.5rem;
  color: #1fab89;
  min-width: 200px;
  outline: none;
  &:focus {
    border-color: #1fab89;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
`;

const ClearButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 9999px;
  color: #d1d5db;
  width: 2rem;
  height: 2rem;
  background-color: #10b981;
  &:hover {
    opacity: 0.75;
  }
`;

export default function RemedyFilter({ selectedSymptom, onSelect, onClear }) {
  const { data: symptoms = [], isLoading, error } = useSWR("/api/symptoms");

  if (isLoading) return <p>Loading filters...</p>;
  if (error) return <p>Failed to loading filters</p>;
  return (
    <FilterWrapper>
      <Select
        value={selectedSymptom}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">Choose symptom</option>
        {symptoms.map((symptom) => (
          <option key={symptom._id} value={symptom.name}>
            {symptom.name}
          </option>
        ))}
      </Select>

      {selectedSymptom && (
        <ClearButton onClick={onClear} aria-label="Clear filter">
          x
        </ClearButton>
      )}
    </FilterWrapper>
  );
}
