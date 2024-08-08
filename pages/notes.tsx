import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { useSession, getSession } from "next-auth/react";
import Layout from "../components/Layout";
import { PostProps } from "../components/Post";
import prisma from "../lib/prisma";
import Router from "next/router";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";

// refactored components:
import Sidebar from "../components/Sidebar";
import Tiptap from "../components/notes/tiptap/Tiptap";
import Chat from "../components/notes/chat/Chat";
import Note from "../components/Note";

// retrieve notes and messages with chatbot, don't need to fetch both if only one is needed...
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { notes: [] } };
  }

  const notes = await prisma.notes.findMany({
    where: {
      author: { email: session?.user?.email },
    },
  });

  const messages = await prisma.message.findMany({
    where: { authorId: (session as any).id },
  });

  return {
    props: { notes, messages },
  };
};

export type Props = {
  notes: PostProps[];
  messages: any;
};

const Notes: React.FC<Props> = (props) => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Layout>
        <h1>My Notes</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    );
  }

  if (props)
    return (
      <Layout>
        <Note props={props} />
      </Layout>
    );

  return <div>arf</div>;
  // if (chatSelected) {
  //   return (
  //     <Layout>
  //       <div className="page">
  //         <ResizablePanelGroup direction="horizontal" className="fixed ">
  //           <ResizablePanel
  //             minSize={20}
  //             maxSize={20}
  //             defaultSize={20}
  //             className="rounded-lg border"
  //           >
  //             <Sidebar
  //               title={title}
  //               setTitle={setTitle}
  //               setContent={setContent}
  //               createNewNote={createNewNote}
  //               updateNote={updateNote}
  //               maintainTitle={maintainTitle}
  //               loadNotes={loadNotes}
  //               props={props}
  //             />
  //           </ResizablePanel>
  //           <ResizableHandle />

  //           <ResizablePanel>
  //             <ResizablePanelGroup direction="vertical">
  //               {/* perfect scrolling method */}
  //               <Chat messagesLoaded={props.messages} />
  //               {/* <div className="bottom-0 fixed h-10 w-screen bg-white border">
  //                 Here
  //               </div> */}
  //             </ResizablePanelGroup>
  //           </ResizablePanel>
  //         </ResizablePanelGroup>
  //       </div>
  //     </Layout>
  //   );
  // } else {
  //   return (
  //     <Layout>
  //       <div className="page">
  //         <ResizablePanelGroup direction="horizontal">
  //           <ResizablePanel minSize={20} maxSize={20} defaultSize={20}>
  //             <Sidebar
  //               title={title} // state of currently loaded title in notes
  //               setTitle={setTitle} // usestate for currently loaded title
  //               setContent={setContent} //  set body of current text
  //               createNewNote={createNewNote} // create new note
  //               updateNote={updateNote} // think its just for title update
  //               maintainTitle={maintainTitle} // necessary
  //               loadNotes={loadNotes} // onclick
  //               props={props} //...
  //             />
  //           </ResizablePanel>
  //           <ResizableHandle />
  //           <ResizablePanel>
  //             <ResizablePanelGroup direction="vertical">
  //               <Tiptap
  //                 setTitle={setTitle}
  //                 title={title}
  //                 setContent={setContent}
  //                 content={content}
  //                 saveNotes={saveNotes}
  //                 deleteNotes={deleteNotes}
  //               />
  //             </ResizablePanelGroup>
  //           </ResizablePanel>
  //         </ResizablePanelGroup>
  //       </div>
  //     </Layout>
  //   );
  // }
};

export default Notes;
