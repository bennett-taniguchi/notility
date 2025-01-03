// where RAG-related chat exists
// would be cool to have open source database files to prompt chat for basic subjects such as calculus, econ, and what not

import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";

import { Flashcard } from "@prisma/client";
import { Router, useRouter } from "next/router";
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

import { Separator } from "../../../components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Switch } from "../../../components/ui/switch";
import { Progress } from "../../../components/ui/progress";
import { cn } from "../../../components/lib/utils";
import { ScrollArea } from "../../../components/ui/scroll-area";
import Link from "next/link";

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
const Chat: React.FC<Props> = (props) => {
  const Router = useRouter();
  const [answered, setAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);

  const [multipleChoiceOn, setMultipleChoiceOn] = useState(true);
  const [shortAnswerOn, setShortAnswerOn] = useState(false);
  const [numOptions, setNumOptions] = useState(4);
  const [practiceTerms, setPracticeTerms] = useState<any[]>([]);
  const [cardClicked, setCardClicked] = useState(false);
  const { data: session } = useSession();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [text, setText] = useState();
  const [currentCard, setCurrentCard] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);

  const { slug } = Router.query;

  const [progress, setProgress] = useState(13);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (practiceTerms.length == 0) retrieve();
  }, []);

  useEffect(() => {}, [multipleChoiceOn, shortAnswerOn]);
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
  interface ControlsOverlayProps {
    handleStringToInt: (value: string) => void;
    numOptions: number;
    multipleChoiceOn: boolean;
    setMultipleChoiceOn: (value: boolean) => void;
    shortAnswerOn: boolean;
    setShortAnswerOn: (value: boolean) => void;
  }

  function AnswersOverlay({ s }: any) {
    function GetFinalRatio({ s }: any) {
      if (answered) {
        let correctNum = practiceTerms.filter(
          (term, idx) => term.back === userAnswers[idx]
        );

        return (
          <div className="text-sm -mb-[2svw] font-light">
            Got {correctNum.length} out of {practiceTerms.length} Correct
          </div>
        );
      }

      return <div> </div>;
    }
    function GetResult({ idx }: any) {
      if (!answered)
        return (
          <p className="ml-2 pt-1 font-light text-sm ">Question {idx + 1} </p>
        );
      if (!userAnswers[idx])
        return (
          <p className="ml-2 pt-1 font-light text-sm ">
            Question {(idx = 1)}{" "}
            {answered && !userAnswers[idx] ? (
              <span className="text-xs text-red-400  ">Unanswered</span>
            ) : (
              ""
            )}
          </p>
        );
      if (userAnswers[idx] == practiceTerms[idx].back) {
        return (
          <p className="ml-2 pt-1 font-light text-sm ">
            {"Question " + (idx + 1)}

            <span className="text-xs text-emerald-500  "> Correct</span>
          </p>
        );
      }

      return (
        <p className="ml-2 pt-1 font-light text-sm ">
          Question {idx + 1}{" "}
          <span className="text-xs text-red-700  ">Incorrect</span>
        </p>
      );
    }

    return (
      <div>
        <div className="ml-[.5svw] left-[79.75svw] top-[8.5svh] absolute bg-gradient-to-r from-teal-300 to-emerald-200 w-[12.5svw] justify-items-center py-[2svh] rounded-2xl h-[24.75svh]" />
        <div className="ml-[.5svw] left-[80svw] top-[9svh] absolute bg-gradient-to-r from-emerald-300 to-emerald-200 w-[12svw] justify-items-center py-[2svh] rounded-2xl">
          <ScrollArea
            className="h-[20svh] w-[12svw] overflow-hidden"
            viewportRef={null}
          >
            <div className="overflow-y-auto">
              {practiceTerms.map((term, idx) => (
                <GetResult idx={idx} />
              ))}
            </div>
          </ScrollArea>
          <GetFinalRatio />
        </div>
      </div>
    );
  }
  const ControlsOverlay: React.FC<ControlsOverlayProps> = ({
    handleStringToInt,
    numOptions,
    multipleChoiceOn,
    setMultipleChoiceOn,
    shortAnswerOn,
    setShortAnswerOn,
  }) => {
    return (
      <div>
        <div className="ml-[.75svw] left-[19.75svw] top-[9.5svh] absolute bg-gradient-to-r from-teal-300 to-emerald-200 w-[12.5svw] justify-items-center py-[1svh] rounded-2xl h-[24.75svh]" />
        <div className="ml-[.75svw] left-[20svw] top-[10svh] absolute bg-gradient-to-r from-emerald-300 to-emerald-200 w-[12svw] justify-items-center py-[1svh] rounded-2xl">
          <Label className="text-sm font-bold">Select amount of choices</Label>
          <div className="z-10">
            <Select
              onValueChange={handleStringToInt}
              defaultValue={String(numOptions)}
            >
              <SelectTrigger className="w-[180px] bg-zinc-200">
                <SelectValue
                  className="text-xs"
                  placeholder="Pick # of options"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="2">3</SelectItem>
                  <SelectItem value="3">4</SelectItem>
                  <SelectItem value="4">5</SelectItem>
                  <SelectItem value="5">6</SelectItem>
                  <SelectItem value="6">7</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-5 py-2 bg-gray-200 rounded-lg px-2">
            <Label className="text-sm ml-2">Multiple Choice?</Label>
            <Switch
              checked={multipleChoiceOn}
              onCheckedChange={setMultipleChoiceOn}
              className="ml-4 data-[state=checked]:bg-emerald-500"
            />
          </div>

          <div className="mt-5 py-2 bg-gray-200 rounded-lg px-2">
            <Label className="text-sm ml-2">Short Answer?</Label>
            <Switch
              checked={shortAnswerOn}
              onCheckedChange={setShortAnswerOn}
              className="ml-7 data-[state=checked]:bg-emerald-500"
            />
          </div>
        </div>
      </div>
    );
  };

  function RestartButton({}: any) {
    function restart() {
      setUserAnswers([])
      setAnswered(false)
     
    }
    return (
     
        
        <Button
          className=" w-[8svw] right-[15svw]    mb-[2svh]  "
          onClick={() => restart()}
        >
          Restart
        </Button> 
     
    );
  }
  function SubmitRestartButton({ multipleChoiceOn, shortAnswerOn }: any) {
    return (
      <div>
        {multipleChoiceOn || shortAnswerOn ? (
          <div className="justify-items-end pt-5  bg-transparent absolute bottom-0 ml-[60svw] flex flex-col   ">
            
            <Button
              className=" w-[8svw] right-[5svw] mr-[5svw]  mb-[2svh]  "
              onClick={() => setAnswered(true)}
            >
              Submit
            </Button>
            <RestartButton/>
            <p className="mx-auto italic text-center"></p>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
  function QuestionHeader({ question, q_num, children }: any) {
    return (
      <div className="w-1/2 place-items-center  pt-[2svh]">
        <p className="-ml-[8svw]   pt-5 font-light ">
          {"Question " + (q_num + 1)}
        </p>
        <Separator className="w-[43svw] ml-[29svw]" />
        <div className="bg-zinc-200 rounded-xl w-[40svw] ml-[30svw] ">
          <p className="  bold text-xl  my-[2svh] p-[2svh] text-center">
            {question}
          </p>
        </div>

        {children}
      </div>
    );
  }
  function updateAnswers(val: string, num: number) {
    let vals = userAnswers;
    vals[num] = val;
    setUserAnswers(vals);
  }

  // options [a,b,c,d]
  // correct is [0] by default
  function QuizMultipleChoice({ answer, question, num }: any) {
    let options = [answer];
    for (let i = 0; i < numOptions; i++) {
      options.push(getOther(num, 1 + i, practiceTerms));
    }

    let q_num = num;
    if (!num) q_num = 0;

    if (options.length < 2 || options.length > 10 || !question || !options)
      return <></>;

    options = options.sort(
      (a, b) => Number(a.charCodeAt(0)) - Number(b.charCodeAt(0))
    ); // deterministic random ordering

    let pos = options.indexOf(answer);

    function compareAnswer(idx: number, user_ans: number) {
      if (idx == pos) {
        return "bg-emerald-300";
      }
      if (idx == user_ans) {
        return "bg-rose-300";
      }
      return "bg-transparent";
    }

    if (answered) {
      let user_ans = options.indexOf(userAnswers[num]);
      console.log("user_ans", user_ans, userAnswers[num], options);
      return (
        <QuestionHeader question={question} q_num={q_num}>
          <RadioGroup
            onValueChange={(value) => {
              updateAnswers(value, num);
            }}
            defaultValue="default"
          >
            {options.map((ans, idx) => (
              <div
                className={cn(
                  " ml-[30svw] flex items-end space-x-2 rounded-md ",
                  compareAnswer(idx, user_ans)
                )}
                key={idx}
              >
                <RadioGroupItem value={ans} id={idx + "r"} />
                <Label htmlFor={"r" + idx}>{ans}</Label>
              </div>
            ))}
          </RadioGroup>
        </QuestionHeader>
      );
    }

    return (
      <QuestionHeader question={question} q_num={q_num}>
        <RadioGroup
          onValueChange={(value) => {
            updateAnswers(value, num);
          }}
          defaultValue="default"
        >
          {options.map((ans, idx) => (
            <div className=" ml-[30svw] flex items-end space-x-2  " key={idx}>
              <RadioGroupItem value={ans} id={idx + "r"} />
              <Label htmlFor={"r" + idx}>{ans}</Label>
            </div>
          ))}
        </RadioGroup>
      </QuestionHeader>
    );
  }
  // question is string
  // count is amount of words to randomly block out
  function QuizShortAnswer({ question, answer, num }: any) {
    function compareAnswer() {
      if (answer == userAnswers[num] && userAnswers[num] == answer) {
        return "outline outline-offset-2 outline-emerald-500 ";
      }
      return "outline outline-offset-2 outline-rose-500 ";
    }

    if (answered) {
      let incorrect = !(
        answer == userAnswers[num] && userAnswers[num] == answer
      );
      return (
        <QuestionHeader question={question} answer={answer} q_num={num}>
          <Input
            className={cn("  w-[10svw]  ml-[30svw] ", compareAnswer())}
            onChange={(val) => updateAnswers(val.currentTarget.value, num)}
          />
          {incorrect ? (
            <p className="text-red-500 text-md text-center ml-[30svw]">
              Correct answer: {answer}{" "}
            </p>
          ) : (
            <p> </p>
          )}
        </QuestionHeader>
      );
    }
    return (
      <QuestionHeader question={question} answer={answer} q_num={num}>
        <Input
          className="  w-[10svw]   ml-[30svw]"
          onChange={(val) => updateAnswers(val.currentTarget.value, num)}
        />
      </QuestionHeader>
    );
  }
  function getOther(idx: number, offset: number, practiceTerms: Card[]) {
    let length = practiceTerms.length;
    let used = (idx + offset) % length;
    return practiceTerms[used].back + "";
  }

  const handleStringToInt = (value: string) => {
    setNumOptions(parseInt(value));
  };

  function ConvertAllToTest({ multipleChoice, shortAnswer }: any) {
    if (multipleChoice && !shortAnswer)
      return (
        <ScrollArea className="overflow-auto  pb-[10svh]" viewportRef={null}>
          {practiceTerms.map((term, idx) => (
            <div>
              <QuizMultipleChoice
                question={term.front}
                answer={term.back}
                num={idx}
              />
            </div>
          ))}
        </ScrollArea>
      );
    if (multipleChoice && shortAnswer)
      return (
        <ScrollArea className="overflow-auto  pb-[10svh]" viewportRef={null}>
          {practiceTerms.map((term, idx) => (
            <div>
              {idx % 2 == 0 ? (
                <QuizMultipleChoice
                  question={term.front}
                  answer={term.back}
                  num={idx}
                />
              ) : (
                <QuizShortAnswer
                  question={term.front}
                  answer={term.back}
                  num={idx}
                />
              )}
            </div>
          ))}
        </ScrollArea>
      );

    if (shortAnswer) {
      return (
        <ScrollArea className="overflow-auto pb-[10svh]" viewportRef={null}>
          {practiceTerms.map((term, idx) => (
            <div>
              <QuizShortAnswer
                question={term.front}
                answer={term.back}
                num={idx}
              />
            </div>
          ))}
        </ScrollArea>
      );
    }

    return <div></div>;
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

                <ConvertAllToTest
                  multipleChoice={multipleChoiceOn}
                  shortAnswer={shortAnswerOn}
                />
               
                <SubmitRestartButton
                  shortAnswerOn={shortAnswerOn}
                  multipleChoiceOn={multipleChoiceOn}
                />   
                
               
                <ControlsOverlay
                  handleStringToInt={handleStringToInt}
                  numOptions={numOptions}
                  multipleChoiceOn={multipleChoiceOn}
                  setMultipleChoiceOn={setMultipleChoiceOn}
                  shortAnswerOn={shortAnswerOn}
                  setShortAnswerOn={setShortAnswerOn}
                />
                <AnswersOverlay />
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </Layout>
    );

  return <Progress value={progress} className="w-[60%] m-auto mt-[50svh]" />;
};

export default Chat;
