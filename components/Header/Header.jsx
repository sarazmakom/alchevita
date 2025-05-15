import React from "react";
import Logo from "../Logo/Logo";
import TitleBar from "../TitleBar/TitleBar";
import styled from "styled-components";

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  background-color: white;
  z-index: 9999;
`;

export default function Header({ title }) {
  return (
    <HeaderContainer>
      <Logo />
      <TitleBar title={title} />
      <button>Log In</button> {/*Only for Acceptance Criteria*/}
    </HeaderContainer>
  );
}
