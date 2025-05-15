import styled from "styled-components";
import Link from "next/link";

const LogoLink = styled(Link)`
  text-decoration: none;
  width: 48px;
  height: 48px;
  background-color: rgb(11, 155, 14);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 0.875rem;
  text-transform: uppercase;
`;

export default function Logo() {
  return <LogoLink href="/">logo</LogoLink>;
}
