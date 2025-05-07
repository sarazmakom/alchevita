import { useRouter } from "next/router";
import styled from "styled-components";
import Image from "next/image";

const Wrapper = styled.div`
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
    color: #1fab89;
  }

  transition: color 0.2s ease-in-out;
`;

const StyledSVG = styled.svg`
  width: 2rem;
  height: 2rem;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const Aside = styled.aside`
  width: 100%;
  padding: 0 1rem;

  @media (min-width: 768px) {
    width: 50%;
  }
`;

const Article = styled.article`
  width: 100%;
  padding: 0 1rem;

  @media (min-width: 768px) {
    width: 50%;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  margin-top: 2em;
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

const Paragraph = styled.p`
  color: rgb(2, 2, 2);
  margin-bottom: 1rem;
  line-height: 1.6;
`;

export default function DetailPage({ element }) {
  const router = useRouter();

  return (
    <Wrapper>
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

      <Section>
        <Aside>
          <ImageContainer>
            <Image
              src={element.imageUrl}
              alt={element.name}
              loading="lazy"
              width={500}
              height={500}
            />
          </ImageContainer>
        </Aside>

        <Article>
          <Title>{element.title}</Title>

          <div>
            <strong>Ingredients:</strong>
            <ul>
              {element.ingredients.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <Paragraph>
            <strong>Usage: </strong>
            {`${element.usage}`}
          </Paragraph>

          <Paragraph>
            <strong>Preparation: </strong>
            {`${element.preparation}`}
          </Paragraph>

          <div>
            <strong>Symptoms:</strong>
            <ul>
              {element.symptoms?.length > 0 ? (
                element.symptoms.map((symptom, index) => (
                  <li key={symptom._id || index}>{symptom.name}</li>
                ))
              ) : (
                <li>No symptoms listed.</li>
              )}
            </ul>
          </div>
        </Article>
      </Section>
    </Wrapper>
  );
}
