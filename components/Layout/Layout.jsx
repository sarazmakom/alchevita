import Head from "next/head";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Alchevita</title>
      </Head>
      {children}
    </>
  );
}
