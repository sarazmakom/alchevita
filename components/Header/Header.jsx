import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Logo from "../Logo/Logo";
import TitleBar from "../TitleBar/TitleBar";
import styled from "styled-components";
import { Menu } from "lucide-react";
import SlideInMenu from "../SlideInMenu/SlideInMenu";

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

const MenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #666;
  }
`;

export default function Header({ title }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <HeaderContainer>
      <Logo />
      <TitleBar title={title} />
      <MenuButton onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
        <Menu size={24} />
      </MenuButton>
      <SlideInMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </HeaderContainer>
  );
}
