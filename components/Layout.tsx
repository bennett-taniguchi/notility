import React, { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./sidebar/Sidebar";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div>
    <Header />
    <div className="layout">{props.children}</div>
  </div>
);

export default Layout;
