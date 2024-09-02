import React, { ReactNode } from "react";
import Header from "./Header";
import TopLoader from "./toploader/Toploader";
import { Toaster } from "./ui/toaster";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div>
    <TopLoader />
    <Header />
    <div className="layout">{props.children}</div>
    <Toaster />
  </div>
);

export default Layout;
