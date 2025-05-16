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
  padding: 0 2rem;
  background-color: white;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.08);
  z-index: 9999;
`;

const LogButton = styled.button`
  background-color: #1fab89;
  color: black;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100px;

  &:hover {
    background-color: #178066;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export default function Header({ title }) {
  return (
    <HeaderContainer>
      <Logo />
      <TitleBar title={title} />
      <LogButton aria-label="Log in to your account">LOG IN</LogButton>
      {/*Only for Acceptance Criteria*/}
    </HeaderContainer>
  );
}
