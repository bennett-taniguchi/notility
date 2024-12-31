// where RAG-related chat exists
// would be cool to have open source database files to prompt chat for basic subjects such as calculus, econ, and what not

import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";

import { Flashcard } from "@prisma/client";
import { useRouter } from "next/router";
import { useState, useEffect, memo } from "react";
import Layout from "../../../components/Layout";
import Sidebar from "../../../components/sidebar/Sidebar";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "../../../components/ui/resizable";
import { Textarea } from "../../../components/ui/textarea";
import prisma from "../../../lib/prisma";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { shuffleArray } from "../../../utils/fisher_yates";
import { Separator } from "../../../components/ui/separator";
 

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
    props: { messages, notes, analyzed, card },
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
  card: Flashcard[];
};
type Card = {
  front: string;
  back: string;
};
const Chat: React.FC<Props> =  (props) => {
  const router = useRouter();
  const [practiceTerms, setPracticeTerms] = useState<Card[]>([]);
  const [cardClicked, setCardClicked] = useState(false);
  const { data: session } = useSession();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [text, setText] = useState();
  const [currentCard, setCurrentCard] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
   
  const { slug } = router.query;

  useEffect(() => {
    if(  practiceTerms.length == 0)
    retrieve();
  }, []);

 

  async function retrieve() {
    let titles = JSON.parse((slug as any)[0]);

    if (Array.isArray(titles)) {
      const res = await fetch("/api/flashcard/get/" + JSON.stringify(titles), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      let vals = [] as any;
      if (res)
        for (const each of data) {
          vals.push({ front: each.term, back: each.answer });
        }
      setPracticeTerms(vals);
    } else {
      const res = await fetch("/api/flashcard/get/" + titles, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      let vals = [] as any;
      if (res)
        for (const each of data) {
          vals.push({ front: each.term, back: each.answer });
        }
      setPracticeTerms(vals);
    }
    return;
  }
  //const [practiceTerms, setPracticeTerms] = useState<Card[]>()
  // will be provided as comp param

  if (!session || !practiceTerms) {
    return (
      <Layout>
        <div />
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

  // options [a,b,c,d]
  // correct is [0] by default
  //
  function QuizMultipleChoice({ options, question,num }: any) {
    let q_num = num
    if(!num) q_num=0

    if (options.length < 2 || options.length > 10 || !question || !options)
      return <></>;

    
  options.sort((a,b) => Number(a.front) - Number(b.front))

   shuffleArray(options)
   console.log(options)
    return (
      <div className="w-1/2 justify-items-center  ">
     
        <p className="-ml-[8svw]   pt-5 font-light">{'Question ' +(q_num+1)}</p>
        <Separator className="w-[60svw] ml-[40svw]"/>
        <p className="-ml-[8svw] bold text-xl bg-zinc-200 rounded-xl">{question}</p>
        <RadioGroup
          onValueChange={(value) => {}}
          defaultValue="default"
        >
          {options.map((ans, idx) => (
            <div className="-ml-[5svw] flex items-start space-x-2" key={idx}>
              <RadioGroupItem value={(idx+1) + ""} id={"r" + idx} />
              <Label htmlFor={"r" + idx}>{ans}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  }
  // question is string
  // count is amount of words to randomly block out
  function QuizShortAnswer({ question, answer }: any) {
    return (
      <div className="w-1/2 justify-items-center    ">
        <p className="text-xl ">{question}</p>

        <div>
          <Input />
        </div>
      </div>
    );
  }


  function ConvertAllToTest() {
    function getOther(idx:number,offset:number,practiceTerms: Card[]) {
      let length = practiceTerms.length
      let used = (idx+offset) % length
      return practiceTerms[used].back + ""
    }

    return (
      <ScrollArea className="overflow-auto">
        
        {
          practiceTerms.map((term,idx) => (
            <div >
             
            <QuizMultipleChoice
            options={[
              term.back,
              getOther(idx,1,practiceTerms),
              getOther(idx,2,practiceTerms),
              getOther(idx,3,practiceTerms),
              getOther(idx,4,practiceTerms),
            ]}
            question={term.front}
            num={idx+0}
            />
            </div>
          ))
        }
     
      </ScrollArea>
    )
  }

  if (props && practiceTerms.length != 0)
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


  
<ConvertAllToTest/>
    

                {/* Card End */}  <Button className=" w-[15svw] m-auto">Submit</Button>
                <p className="mx-auto italic">
                  {currentCard + 1 + " / " + practiceTerms.length}
                </p>

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
