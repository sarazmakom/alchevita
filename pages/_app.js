import { SWRConfig } from "swr";
import { createGlobalStyle } from "styled-components";
import Layout from "@/components/Layout/Layout.jsx";
import GlobalStyle from "../styles.js";

const RootStyle = createGlobalStyle`
  #__next {
    display: grid;
    gap: 0.5rem;
    margin-top: 5rem;
    padding: 0.5rem;
    position: relative;
    width: 100%;
  }
`;

async function fetcher(...args) {
  const res = await fetch(...args);
  if (!res.ok) {
    throw new Error(`Request failed: ${JSON.stringify(args)}`);
  }
  return res.json();
}

export default function App({ Component, pageProps }) {
  return (
    <>
      <RootStyle />
      <GlobalStyle />
      <SWRConfig value={{ fetcher }}>
        <Layout title={Component.pageTitle}>
          <Component {...pageProps} />
        </Layout>
      </SWRConfig>
    </>
  );
}
