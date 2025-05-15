import styled from "styled-components";

const Headline = styled.h1`
  width: 100%;
  text-align: center;
`;

export default function TitleBar({ title }) {
  return <Headline>{title}</Headline>;
}
