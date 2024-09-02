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

import { useEffect, useState } from "react";
import { Card, CardTitle } from "../../../../components/ui/card";
import DemoPage from "../../../../components/learn/table/page";
import { Separator } from "../../../../components/ui/separator";
import Link from "next/link";
import { Button } from "../../../../components/ui/button";
import { Textarea } from "../../../../components/ui/textarea";

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

  const { data: session } = useSession();
  type Card = {
    front: string;
    back: string;
  };
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [text, setText] = useState();
  const [currentCard, setCurrentCard] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  // will be provided as comp param
  const [practiceTerms, setPracticeTerms] = useState<Card[]>([
    {
      front: "California Capital",
      back: "Sacramento",
    },
    {
      front: "Alabama Capital",
      back: "Montgomery",
    },
    {
      front: "Virginia Capital",
      back: "Richmond",
    },
    {
      front: "Minnesota Capital",
      back: "Jackson",
    },
    {
      front: "Idaho Capital",
      back: "Boise",
    },
  ]);

  if (!session || !practiceTerms) {
    return (
      <Layout>
        <h1>My Notes</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    );
  }

  function handleCardClick(e: React.SyntheticEvent) {
    if (!cardClicked) {
      setCardClicked(!cardClicked);
    } else {
      if (currentCard != practiceTerms.length - 1) {
        setCurrentCard(currentCard + 1);
        setCardClicked(false);
      }
    }
  }

  function handleFormSubmit(e?: React.SyntheticEvent) {
    e?.preventDefault();
    setCardClicked(true);
    if (text === practiceTerms[currentCard].back && cardClicked != true) {
      if (currentCard != practiceTerms.length - 1) {
        setCardClicked(false);
        setCurrentCard(currentCard + 1);
        setCurrentScore(currentScore + 1);

        console.log(currentCard + 1);
      } else {
        setCurrentCard(0);
      }
    }

    // check correctness of card
    // increment counter if true (index and score)
    // flip and green effect
    // flip and red effect

    // need click to continue on already flipped card
  }
  function handleEnterPress(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleFormSubmit();
    }
  }

  function handleRestart() {
    setCurrentCard(0);
    setCardClicked(false);
    setCurrentScore(0);
  }

  function handleShuffle() {
    let i = practiceTerms.length;
    let arr = new Array(0);
    for (let j = 0; j < practiceTerms.length; j++) {
      arr[j] = practiceTerms[j];
    }
    // While there remain elements to shuffle...
    while (i != 0) {
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * i);
      i--;

      // And swap it with the current element.
      [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
    }
    setPracticeTerms(arr);

    handleRestart();
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

                {/* Card End */}
                <div className="grid gap-2 mx-[90px] mt-[50px] bg-zinc-50">
                  <Textarea
                    onChange={(e) => setText(e.target.value as any)}
                    className="non-resize"
                    onKeyPress={handleEnterPress}
                  ></Textarea>
                  <Button onClick={handleFormSubmit}>Submit</Button>
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
