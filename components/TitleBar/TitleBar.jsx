import styled from "styled-components";

const Headline = styled.h1`
  width: 100%;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0;
  padding: 0 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

export default function TitleBar({ title }) {
  return <Headline>{title}</Headline>;
}
