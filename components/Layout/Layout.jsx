import Head from "next/head";
import styled from "styled-components";
import Navbar from "../Navbar/Navbar";
import Logo from "../Logo/Logo";

const MainContent = styled.main`
  padding-bottom: 5rem;
  padding-top: 4rem;
`;

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Alchevita</title>
      </Head>
      <Logo />
      <MainContent>{children}</MainContent>
      <Navbar />
    </>
  );
}
