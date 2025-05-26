import styled from "styled-components";

const Headline = styled.h1`
  width: 100%;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0;
  padding: 0 1rem;
  transition: color 0.3s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.2;
  max-height: 2.4em;

  @media (min-width: 768px) {
    font-size: 2rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    max-height: none;
    line-height: normal;
  }
`;

export default function TitleBar({ title }) {
  return <Headline>{title}</Headline>;
}
