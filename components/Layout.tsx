import React, { ReactNode } from "react";
import Header from "./Header";
import TopLoader from "./toploader/Toploader";
import { Toaster } from "./ui/toaster";
import { ScrollArea } from "./ui/scroll-area";
 

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div  >
    <TopLoader />
    <Header />
    <ScrollArea className="layout overflow-auto" viewportRef={null}>{props.children}</ScrollArea>
    <Toaster />
  </div>
);

export default Layout;
