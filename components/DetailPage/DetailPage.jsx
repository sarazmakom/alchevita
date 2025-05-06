import { useRouter } from "next/router";
import styled from "styled-components";
import Image from "next/image";

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1rem;
  max-width: 1200px;
`;

const BackButton = styled.button`
  margin-bottom: 1.5rem;
  cursor: pointer;
  color: inherit;
  background: none;
  border: none;
  padding: 0;

  &:hover {
    color: #4f46e5;
  }

  transition: color 0.2s ease-in-out;
`;

const StyledSVG = styled.svg`
  width: 2rem;
  height: 2rem;
`;

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: -1rem;
  margin-right: -1rem;
  gap: 2rem;
`;

const Column = styled.div`
  width: 100%;
  padding: 0 1rem;
  margin-bottom: ${({ mb }) => mb || "0"};

  @media (min-width: 768px) {
    width: ${({ width }) => width || "100%"};
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);

  &::before {
    content: "";
    display: block;
    padding-top: 56.25%; // 16:9 aspect ratio
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Title = styled.h2`
  font-size: 1.875rem;
  line-height: 2.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const RemedyText = styled.p`
  color: #4b5563;
  margin-bottom: 1rem;
  line-height: 1.6;
`;

export default function DetailPage({ element }) {
  const router = useRouter();

  return (
    <Container>
      <BackButton
        data-testid="back-to-remedies"
        aria-label="Back to remedies"
        onClick={(e) => {
          e.preventDefault();
          router.push("/");
        }}
      >
        <StyledSVG
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </StyledSVG>
      </BackButton>

      <FlexContainer>
        <Column width="50%">
          <ImageContainer>
            <Image
              src={element.imageUrl}
              alt={element.name}
              loading="lazy"
              width={500}
              height={500}
            />
          </ImageContainer>
        </Column>

        <Column width="50%">
          <Title><strong>{element.title}</strong></Title>
          <RemedyText>
            <strong>Ingredients:</strong>
            <ul>
              {element.ingredients.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </RemedyText>
          <RemedyText><strong>Usage: </strong>{`${element.usage}`}</RemedyText>
          <RemedyText><strong>Preparation: </strong>{`${element.preparation}`}</RemedyText>
          <RemedyText>
            <strong>Symptoms:</strong>
            <ul>
              {element.symptoms.map((symptom, index) => (
                <li key={symptom._id || index}>{symptom.name}</li>
              ))}
            </ul>
          </RemedyText>
        </Column>
      </FlexContainer>
    </Container>
  );
}
