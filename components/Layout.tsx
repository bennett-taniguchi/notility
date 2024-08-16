import React, { ReactNode } from "react";
import Header from "./Header";
import TopLoader from "./toploader/Toploader";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div>
    <TopLoader />
    <Header />
    <div className="layout">{props.children}</div>
  </div>
);

export default Layout;
