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

import { useEffect, useReducer, useState } from "react";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Textarea } from "../../../../components/ui/textarea";
import { Flashcard } from "@prisma/client";
import { useRouter } from 'next/router';
import { Progress } from "../../../../components/ui/progress";

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
  const card = await prisma.card.findMany({
    where: { authorId: (session as any).id },
  });

  return {
    props: { messages, notes, analyzed,card },
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
  card: Flashcard[]
};
type Card = {
  front: string;
  back: string;
};
const Chat: React.FC<Props> = (props) => {
  const { data: session } = useSession()
  const router = useRouter();
  const {slug} = router.query



  const [practiceTerms, setPracticeTerms] = useState<Card[]>([]);
  const [cardClicked, setCardClicked] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [text, setText] = useState();
  const [currentCard, setCurrentCard] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [progress, setProgress] =  useState(13)

 


  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])


  useEffect(() => {
    retrieve()

  },[])

  useEffect(() =>{

  },[practiceTerms])

  async function retrieve() {
    let titles = JSON.parse((slug as any)[0])

    if(Array.isArray(titles)) {

      const res = await fetch("/api/flashcard/get/"+JSON.stringify(titles), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    
      });
       const data = await res.json()
  
      let vals = [] as any
      if(res)
      for (const  each   of  (data) ) {
        vals.push({front:each.term , back:each.answer })
      }
      setPracticeTerms(vals)
 

      
    } else {
      const res = await fetch("/api/flashcard/get/"+titles, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    
      });
       const data = await res.json()
  
      let vals = [] as any
      if(res)
      for (const  each   of  (data) ) {
        vals.push({front:each.term , back:each.answer })
      }
      setPracticeTerms(vals)
    }
    return;

  }

  if (!session || !practiceTerms) {
    return (
      <Layout>
         <div/>
      </Layout>
    );
  }

  function handleCardClick(e: React.SyntheticEvent) {
    if (!cardClicked) {
      setCardClicked(!cardClicked);
    } else {
      if (currentCard != (practiceTerms).length - 1) {
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


  if (props && practiceTerms.length!=0)
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
                    <Button onClick={handleShuffle}>Shuffle</Button>
                    <Button>Hint</Button>
                    <Button onClick={handleRestart}>Restart</Button>
                  </div>
                  <div>Score: {currentScore}</div>

                  {/* Card start */}

                  <div className={"flip-card "} onClick={handleCardClick}>
                    <div
                      className={
                        "flip-card-inner " +
                        (cardClicked
                          ? "flashCardPrimary transition-transform delay-5000"
                          : "")
                      }
                    >
                      <Card className="w-[70vw] h-[50vh] shadow-inner drop-shadow-xl text-center flip-card-front transform: translateY(180deg)">
                        <p className="top-1/3 relative text-2xl font-quicksand font-extrabold">
                          {practiceTerms[currentCard].front}
                        </p>
                      </Card>
                      <Card
                        className={
                          "w-[70vw] h-[50vh] shadow-inner drop-shadow-xl text-center flip-card-back "
                        }
                      >
                        <p className="top-1/3 relative text-2xl font-quicksand font-extrabold">
                          {practiceTerms[currentCard].back}
                        </p>
                      </Card>
                    </div>
                  </div>
                </div>

                {/* Card End */}
                <p className="mx-auto italic">{(currentCard+1) +" / " +practiceTerms.length}</p>
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

    return <Progress value={progress} className="w-[60%] m-auto mt-[50svh]" />
};

export default Chat;
