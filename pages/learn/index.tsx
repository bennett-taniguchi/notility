// where RAG-related chat exists
// would be cool to have open source database files to prompt chat for basic subjects such as calculus, econ, and what not
import { FaRegQuestionCircle } from "react-icons/fa";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import prisma from "../../lib/prisma";
import Layout from "../../components/Layout";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../components/ui/resizable";
import Sidebar from "../../components/sidebar/Sidebar";

import { useContext, useEffect, useState } from "react";
 
import TablePage from "../../components/learn/table/page";
import { Separator } from "../../components/ui/separator";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { SelectedRowsContext } from "../../components/context/context";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { useRouter } from "next/router";
import { Card, Flashcard } from "@prisma/client";

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

  const flashcards = await prisma.flashcard.findMany({
    where: { authorId: (session as any).id },
  });

  const cards = await prisma.card.findMany({
    where: { authorId: (session as any).id },
  });

  return {
    props: { messages, notes, analyzed, flashcards, cards },
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
 
  flashcards: Flashcard[];
  cards: any;
};

const Chat: React.FC<Props> = (props) => {
  const { data: session } = useSession();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [selectedRowsL, setSelectedRowsL] = useState<number[]>([]);
  const [selectedTitlesL, setSelectedTitlesL] = useState<string[]>([]);
  const Router = useRouter();
  const { selectedRows, setSelectedRows, selectedTitles, setSelectedTitles } =
    useContext(SelectedRowsContext);

  useEffect(() => {}, [Router.asPath]);
  function rowNumsToTitles() {
    //console.log();
  }
  function titlesToString(selectedRowsL: any[]) {
    // console.log(selectedRowsL);
    for (const row of selectedRows) {
      //console.log(row);
    }
    return "";
  }

  if (!session) {
    return (
      <Layout>
        <div />
      </Layout>
    );
  }

  async function updateLastPracticed(rows:any) {
    
    await fetch("/api/flashcard/update/last_practiced/" + rows, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });
   
 
  }
  
  if (props)
    return (
      <Layout>
        <div className="page">
          <SelectedRowsContext.Provider
            value={{
              selectedRows: selectedRowsL,
              setSelectedRows: setSelectedRowsL,
              selectedTitles: selectedTitlesL,
              setSelectedTitles: setSelectedTitlesL,
            }}
          >
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

                  <div className=" ">
                    <h1 className="underline underline-offset-4 text-left pl-7 text-2xl text-zinc-800 translate-y-[15px] font-quicksand pb-[50px]">
                      Learn
                    </h1>
                    <h1 className="text-left pl-7 text-xl text-zinc-500 translate-y-[15px] font-quicksand">
                      Flashcards
                    </h1>
                    <Separator orientation="horizontal" className="mt-5" />
                    <div className="pl-9  pt-5">
                      <Link href="/learn/flashcard/create">
                        <Button variant={"outline"}>Create New</Button>
                      </Link>
                    </div>
                    <div className="translate-y-[-20px]">
                      <TablePage sets={props.flashcards} cards={props.cards}/>

                      <div className="pl-9 translate-y-[-15px] ">
                        <div className="flex flex-row justify-end ">
                          <p className="m-0 left-0 text-sm pb-5 mr-[2svw]">
                            {selectedRowsL.length + 0 + " selected"}
                          </p>
                          <TooltipProvider>
                            <Tooltip delayDuration={0}>
                              <TooltipTrigger asChild>
                                <div className="w-5 h-5   mr-[2svw] -mb-1">
                                  <FaRegQuestionCircle className="my-auto" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="bg-black rounded -mb-2">
                                <p className="text-white text-sm">
                                  Click on Rows to Select
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        {!props.flashcards ? (
                          <div></div>
                        ) : (
                          <div className="flex flex-row">
                            <div>
                              <Button disabled={selectedRowsL.length == 0} onClick={()=>updateLastPracticed(selectedRowsL)}>
                                <Link
                                  href={`
                        /learn/flashcard/study/${encodeURIComponent(
                          JSON.stringify(selectedRowsL)
                        )}`}
                                >
                                  {"Study Selected"}
                                </Link>
                              </Button>
                            </div>

                            <div className="pl-5">
                              <Button disabled={selectedRowsL.length == 0} onClick={()=>updateLastPracticed(selectedRowsL)}>
                                {" "}
                                <Link
                                  shallow={true}
                                  href={`
                        /learn/test/${encodeURIComponent(
                          JSON.stringify(selectedRowsL)
                        )}`}
                                >
                                  {"Take a Test on Selected"}
                                </Link>
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </ResizablePanelGroup>
              </ResizablePanel>
            </ResizablePanelGroup>
          </SelectedRowsContext.Provider>
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div></div>
    </Layout>
  );
};

export default Chat;
