import styled from "styled-components";
import Header from "../Header/Header";
import Navbar from "../Navbar/Navbar";

const MainContent = styled.main`
  padding-bottom: 5rem;
  padding-top: 1rem;
`;

export default function Layout({ title = "", children }) {
  return (
    <>
      <Header title={title} />
      <MainContent>{children}</MainContent>
      <Navbar />
    </>
  );
}
