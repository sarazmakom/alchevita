import { SWRConfig } from "swr";
import Layout from "@/components/Layout/Layout.jsx";
import GlobalStyle from "../styles.js";

export default function App({ Component, pageProps }) {
  return (
    <SWRConfig value={{ fetcher }}>
      <Layout>
        <GlobalStyle />
        <Component {...pageProps} />
      </Layout>
    </SWRConfig>
  );
}

async function fetcher(...args) {
  const res = await fetch(...args);
  if (!res.ok) {
    throw new Error(`Request failed: ${JSON.stringify(args)}`);
  }
  return res.json();
}
