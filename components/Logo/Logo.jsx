import styled from "styled-components";
import Link from "next/link";

const LogoContainer = styled.div`
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 50;
`;

const LogoLink = styled(Link)`
  text-decoration: none;
`;

const LogoIcon = styled.div`
  width: 48px;
  height: 48px;
  background-color: #1971c2;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 0.875rem;
  text-transform: uppercase;
`;

export default function Logo() {
  return (
    <LogoContainer>
      <LogoLink href="/">
        <LogoIcon>logo</LogoIcon>
      </LogoLink>
    </LogoContainer>
  );
}
