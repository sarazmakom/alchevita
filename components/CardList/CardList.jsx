import styled from "styled-components";
import Card from "../Card/Card";

const StyledCardListContainer = styled.div`
  padding: 2.5rem 1.5rem 1.5rem;
`;

const StyledGridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem 1.5rem;
  position: relative;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
    column-gap: 2rem;
  }
`;

const StyledEmptyContainer = styled.div`
  max-width: 100%;
  padding: 2rem 1rem;
  margin: 0 auto;

  p {
    margin: 0;
    font-size: 1rem;
    color: #666;
  }
`;

export default function CardList({ elements = [] }) {
  return (
    <StyledCardListContainer>
      <StyledGridContainer>
        {elements.length === 0 ? (
          <StyledEmptyContainer>
            <p>No remedies available.</p>
          </StyledEmptyContainer>
        ) : (
          elements.map((element) => (
            <Card
              key={element._id}
              title={element.title}
              imageUrl={element.imageUrl}
              id={element._id}
            />
          ))
        )}
      </StyledGridContainer>
    </StyledCardListContainer>
  );
}
