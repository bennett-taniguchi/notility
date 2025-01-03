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

import { forwardRef, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import DemoPage from "../../../../components/learn/table/page";
import { Separator } from "../../../../components/ui/separator";
import Link from "next/link";
import { Button } from "../../../../components/ui/button";
import { Textarea } from "../../../../components/ui/textarea";
import { Label } from "../../../../components/ui/label";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useToast } from "../../../../hooks/use-toast";
import { useRouter } from "next/router";

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
  const [cardClicked, setCardClicked] = useState(false);
  const Router = useRouter();
  const { data: session } = useSession();
  type Card = {
    front: string;
    back: string;
  };
  const { toast } = useToast();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [text, setText] = useState();

  const [size, setSize] = useState(1);
  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();

  const titleRef = useRef<string[]>([]);
  const defRef = useRef<string[]>([]);

  // will be provided as comp param
  const [practiceTerms, setPracticeTerms] = useState<Card[]>([
    {
      front: "",
      back: "",
    },
  ]);

  if (!session || !practiceTerms) {
    return (
      <Layout>
              <div/>
      </Layout>
    );
  }
  function handlePlusClicked(e: React.SyntheticEvent) {
    setPracticeTerms([...practiceTerms, { front: "", back: "" } as Card]);
    setSize(size + 1);
  }

  function handleMinusClicked(e: React.SyntheticEvent) {
    if (practiceTerms.length < 2) {
      return;
    } else {
      let copied = [] as Card[];
      for (let i = 0; i < practiceTerms.length - 1; i++) {
        copied.push(practiceTerms[i]);
      }
      setPracticeTerms(copied);
      setSize(size - 1);
    }
  }

  function getCards() {
    let cards = [] as Card[];
    for (let i = 0; i < practiceTerms.length; i++) {
      let back = defRef[i].value as string;
      let front = titleRef[i].value as string;
      cards.push({ front: front, back: back });
    }
    return cards;
  }

  function cardsInvalid() {
    const hMap = new Map();
    for (let i = 0; i < practiceTerms.length; i++) {
      let back = defRef[i].value;
      let front = titleRef[i].value;
      if (!back) {
        return "invalid";
      } else if (back.replace(/\s+/g, "") == "") {
        return "invalid";
      }
      if (!front) {
        return "invalid";
      } else if (front.replace(/\s+/g, "") == "") {
        return "invalid";
      }
      if (hMap.get(front)) {
        return "duplicate";
      }
      hMap.set(front, back);
    }
  }

  function titleEmpty() {
    return name == "" || !name || name.replace(/\s+/g, "") == "";
  }

  async function handleSubmitClicked(e: React.SyntheticEvent) {
    let submitted = false;
    let msg = "";
    if (cardsInvalid() == "invalid") {
      msg += "Please fill out all your cards or delete unused ones";
    } else if (cardsInvalid() == "duplicate") {
      msg += "Please make sure there are no duplicate term names";
    }

    let noTitle = titleEmpty();
    if (noTitle) {
      msg += ". Please fill out your flashcard set name";
    } else if (msg == "" && noTitle) {
      msg = "Please fill out your flashcard set name";
    }
    if (msg != "") {
      toast({
        variant: "destructive",
        title: "Please fix these errors before saving",
        description: msg,
      });
    } else {
      toast({
        title: "Flashcards Saved",
        description: msg,
      });

      let cards = getCards();
      let title = name;

      let body = { title, description, cards };

      await fetch("/api/flashcard/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      submitted = true;
    }
    if (submitted) Router.push("/learn");
  }

  function handleNameChange(e: React.SyntheticEvent) {
    console.log(practiceTerms);
    setName((e.target as HTMLTextAreaElement).value);
  }

  function handleDescriptionChange(e: React.SyntheticEvent) {
    setDescription((e.target as HTMLTextAreaElement).value);
  }

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
                <ScrollArea className="overflow-auto h-full">
                  <h1 className=" text-left pl-7 text-2xl text-zinc-800 translate-y-[15px] font-quicksand pb-[20px] text-center pb-20">
                    Make New Flashcards
                  </h1>
                  <div className="mx-[50px] mb-[10px]">
                    <Textarea
                      id="set"
                      className="self-center resize-none text-2xl  bg-white mb-1"
                      onChange={handleNameChange}
                      placeholder="Title for Flashcards"
                    ></Textarea>
                    <Textarea
                      id="set"
                      className="self-center resize-none text-md  bg-white"
                      onChange={handleDescriptionChange}
                      placeholder="Description for Flashcards"
                    ></Textarea>
                  </div>

                  <div>
                    {practiceTerms.map((term, idx) => (
                      <Card className="py-[10px] mx-[50px] pb-10 mb-5">
                        <div className=" justify-center mx-5 pb-5 pt-5">
                          <CardTitle className="pb-5">Term {idx + 1}</CardTitle>
                          <Label htmlFor="term">{term.front}</Label>
                          <Textarea
                            className="resize-none"
                            id="term"
                            placeholder="Write a title"
                            onChange={() => term.front}
                            ref={(r) => (titleRef[idx] = r)}
                          ></Textarea>
                        </div>

                        <div className=" justify-center mx-5">
                          <Label htmlFor="definition">{term.back}</Label>
                          <Textarea
                            className="resize-none"
                            id="definition"
                            placeholder="Write a definition"
                            ref={(r) => (defRef[idx] = r)}
                          ></Textarea>
                        </div>
                      </Card>
                    ))}
                    <div className="pb-[70px]" />
                    <div className="grid grid-cols-3 fixed  ">
                      <Button
                        className="w-10 h-10 fixed right-[165px] top-[5px] mt-[5px]  rounded-full"
                        onClick={handlePlusClicked}
                      >
                        +
                      </Button>

                      <Button
                        className="w-10 h-10 fixed right-[120px] top-[5px] mt-[5px] rounded-full"
                        onClick={handleMinusClicked}
                      >
                        -
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-15 h-10 right-[0px] fixed top-[5px] span-2  mt-[5px] mr-[50px] rounded-full"
                        onClick={handleSubmitClicked}
                      >
                        Save
                      </Button>
                     
                    </div>
                  </div>
                </ScrollArea>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </Layout>
    );

  return <div>Data is invalid</div>;
};

export default Chat;
