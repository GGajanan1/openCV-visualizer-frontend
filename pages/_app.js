import '../styles/globals.css';
import Head from 'next/head';
import dotenv from 'dotenv';
dotenv.config();

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>OpenCV Visualizer</title>
        <meta name="description" content="Advanced OpenCV image processing and visualization tool" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;