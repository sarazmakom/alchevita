import Link from "next/link";
import styled from "styled-components";
import { StyledImage } from "../StyledImage/StyledImage";
import SymptomsList from "../SymptomsList/SymptomsList";

const CardContainer = styled.div`
  border: 1px solid black;
  border-radius: 0.8rem;
  padding: 0.5rem;
`;

const ImageContainer = styled.div`
  position: relative;
  height: 10rem;
  margin-bottom: 20px;
`;

export default function Card({ title, imageUrl, id, symptoms }) {
  return (
    <CardContainer>
      <Link href={`remedies/${id}`} aria-label={`View details for ${title}`}>
        <ImageContainer>
          <StyledImage
            src={imageUrl}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt={`Visual representation of ${title}`}
          />
        </ImageContainer>
      </Link>
      <h3>{title}</h3>
      <SymptomsList symptoms={symptoms} />
    </CardContainer>
  );
}
