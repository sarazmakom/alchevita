import Link from "next/link";
import styled from "styled-components";
import { useRouter } from "next/router";
import { House, Heart, SquarePlus } from "lucide-react";

const NavContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  border-top: 1px solid #e5e7eb;
  padding: 1rem;
  display: flex;
  justify-content: space-around;
  z-index: 50;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: ${({ isActive }) => (isActive ? "#1971c2" : "#6b7280")};
`;

const NavIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`;

export default function Navbar() {
  const router = useRouter();

  return (
    <NavContainer>
      <NavItem href="/" isActive={router.pathname === "/"}>
        <NavIcon>
          <House size={24} />
        </NavIcon>
      </NavItem>
      <NavItem
        href="/bookmark-remedies"
        isActive={router.pathname === "/remedies/bookmarks"}
      >
        <NavIcon>
          <Heart size={24} />
        </NavIcon>
      </NavItem>
      <NavItem
        href="/create-remedy"
        isActive={router.pathname === "/remedies/create"}
      >
        <NavIcon>
          <SquarePlus size={24} />
        </NavIcon>
      </NavItem>
    </NavContainer>
  );
}
