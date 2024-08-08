import React, { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div>
    <Header />
    {/* <Sidebar /> */}
    <div className="layout">{props.children}</div>
  </div>
);

export default Layout;
