import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
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

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserName = styled.span`
  font-weight: 500;
`;

export default function Header({ title }) {
  const { data: session } = useSession();

  return (
    <HeaderContainer>
      <Logo />
      <TitleBar title={title} />
      {session ? (
        <UserInfo>
          <UserName>{session.user.name}</UserName>
          <button onClick={() => signOut()}>Log Out</button>
        </UserInfo>
      ) : (
        <button onClick={() => signIn("github")}>Log In</button>
      )}
    </HeaderContainer>
  );
}
