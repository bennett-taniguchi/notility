import React, { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div>
    <Header />
    <Sidebar
      title={title} // state of currently loaded title in notes
      setTitle={setTitle} // usestate for currently loaded title
      setContent={setContent} //  set body of current text
      createNewNote={createNewNote} // create new note
      updateNote={updateNote} // think its just for title update
      maintainTitle={maintainTitle} // necessary
      loadNotes={loadNotes} // onclick
      props={props.props} //...
    />
    {/* <Sidebar /> */}
    <div className="layout">{props.children}</div>
  </div>
);

export default Layout;
