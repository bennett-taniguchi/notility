import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import "../globals.css";
import 'katex/dist/katex.min.css';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default App;
