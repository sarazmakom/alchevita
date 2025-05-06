import useSWR from "swr";
import styled from "styled-components";

const fetcher = (url) => fetch(url).then((res) => res.json());
const FilterWrapper = styled.div`
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
  font-size: 1rem;
  color: #1fab89;
  min-width: 200px;
  outline: none;
  &:focus {
    border-color: #1fab89;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
`;

const Badge = styled.span`
  color: #d1d5db;
  background-color: #10b981;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

const ClearButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #d1d5db;
  &:hover {
    opacity: 0.75;
  }
`;

export default function RemedyFilter({ selectedSymptom, onSelect, onClear }) {
  const {
    data: symptoms = [],
    isLoading,
    error,
  } = useSWR("/api/symptoms", fetcher);

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
          <option key={symptom._id} value={symptom._id}>
            {symptom.name}
          </option>
        ))}
      </Select>

      {selectedSymptom && (
        <Badge>
          {symptoms.find((symptom) => symptom._id === selectedSymptom)?.name}
          <ClearButton onClick={onClear} aria-label="Clear filter">
            x
          </ClearButton>
        </Badge>
      )}
    </FilterWrapper>
  );
}
