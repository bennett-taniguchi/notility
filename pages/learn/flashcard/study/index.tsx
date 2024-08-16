// where RAG-related chat exists
// would be cool to have open source database files to prompt chat for basic subjects such as calculus, econ, and what not

import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import prisma from "../../../../lib/prisma";
import Layout from "../../../../components/Layout";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../../../components/ui/resizable";
import Sidebar from "../../../../components/sidebar/Sidebar";

import { useState } from "react";
import { Card, CardTitle } from "../../../../components/ui/card";
import DemoPage from "../../../../components/learn/table/page";
import { Separator } from "../../../../components/ui/separator";
import Link from "next/link";
import { Button } from "../../../../components/ui/button";

// figure out vector search, use diff namespaced stuff: "default_calculus"
// then prompt using context from closest cosine similarity from vec db
// then initiate chat

// there is some tools api on openai, might be good to look into that.
//// if i had to go off of what is offered it looks like (chat and learn agnostic):

// use filesearch on pre seeded or user inputted pdfs to test rote memorization / make flashcards / make tests too
// -> flashcards, tests, vocab terms
// use code interpreter for anything math and code related that can be solved with python packages
// -> study math/cse, create viz
// use functions to define the notecard creation function, might confer an advantage over prompting how to create notecards everytime:
// -> create notecards, tables, graphs, and cs-graphs

// test null cases for notes and messages
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { messages: [] } };
  }

  const messages = await prisma.message.findMany({
    where: { authorId: (session as any).id },
  });

  const notes = await prisma.notes.findMany({
    where: {
      author: { email: session?.user?.email },
    },
  });

  const analyzed = await prisma.upload.findMany({
    where: { authorId: (session as any).id },
  });

  return {
    props: { messages, notes, analyzed },
  };
};
// define messages
type Message = {
  index?: number;
  authorId: string;
  role: string;
  content: string;
  title: any;
};

type Analyzed = {
  index: number;
  title: string;
  content: string;
  authorId: string;
};
export type Props = {
  messages: Message[];
  analyzed: Analyzed[];
};

const Chat: React.FC<Props> = (props) => {
  const { data: session } = useSession();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  if (!session) {
    return (
      <Layout>
        <h1>My Notes</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    );
  }

  let practiceTerms = [
    {
      front: "California Capital",
      back: "Sacramento",
    },
    {
      front: "Alabama Capital",
      back: "Montgomery",
    },
    {
      front: "Virginia",
      back: "Richmond",
    },
    {
      front: "Minnesota",
      back: "Jackson",
    },
    {
      front: "Idaho",
      back: "Boise",
    },
  ];

  if (props)
    return (
      <Layout>
        <div className="page">
          <ResizablePanelGroup direction="horizontal" className="fixed ">
            <ResizablePanel
              minSize={20}
              maxSize={20}
              defaultSize={20}
              className="rounded-lg border"
            >
              <Sidebar
                title={title} // state of currently loaded title in notes
                setTitle={setTitle} // usestate for currently loaded title
                setContent={setContent} //  set body of current text
                props={props}
                location="learn"
              />
            </ResizablePanel>
            <ResizableHandle />

            <ResizablePanel className="bg-zinc-100">
              <ResizablePanelGroup direction="vertical">
                {/* perfect scrolling method */}

                <div className="grid grid-cols-1  justify-items-center">
                  <h1 className="underline underline-offset-4 text-left pl-7 text-2xl text-zinc-800 translate-y-[15px] font-quicksand pb-[20px] text-center">
                    Study (Set Name) Flashcards
                  </h1>
                  <div className="flex flex-3 justify-center gap-2  ">
                    <Button>Shuffle</Button>
                    <Button>Hint</Button>
                    <Button>Restart</Button>
                  </div>
                  <div>Score:</div>

                  <div className="flip-card">
                    <div className="flip-card-inner">
                      <Card className="w-[70vw] h-[50vh] shadow-inner drop-shadow-xl text-center flip-card-front">
                        <p className="top-1/3 relative text-2xl font-quicksand font-extrabold">
                          front
                        </p>
                      </Card>
                      <Card className="w-[70vw] h-[50vh] shadow-inner drop-shadow-xl text-center flip-card-back">
                        <p className="top-1/3 relative text-2xl font-quicksand font-extrabold">
                          back
                        </p>
                      </Card>
                    </div>
                  </div>
                </div>

                {/* <div className="bottom-0 fixed h-10 w-screen bg-white border">
                Here
               </div> */}
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </Layout>
    );

  return <div>Data is invalid</div>;
};

export default Chat;
