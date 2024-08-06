import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import "../globals.css";

const App = ({ Component, pageProps }: AppProps) => {
  if (pageProps.session)
    return (
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    );
  else return <div>Not Logged In</div>;
};

export default App;
