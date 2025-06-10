import { useContext, useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { ScrollArea } from "../../ui/scroll-area";
import { ArrowLeft } from "lucide-react";
import { QuizzesContext, SlugContext } from "../../context/context";
import prisma from "../../../lib/prisma";
import { Question } from "@prisma/client";
import { shuffleArray } from "../../../utils/fisher_yates";
import PulsingDots from "../chat/loading/PulsingDots";

interface QuizQuestionInterface {
  q: { initial: Question; shuffled: Array<string> };
  submitted: boolean;
  setAnswered: any;
  resetCount: number;
  answered: boolean[];
  correct: boolean[];
  setCorrect: any;
  i: number;
}
function QuizQuestion({
  q,
  submitted,
  resetCount,
  i,
  setAnswered,
  answered,
  setCorrect,
  correct,
}: QuizQuestionInterface) {
  const [hintVisible, setHintVisible] = useState(false);

  const [choice, setChoice] = useState("");

  useEffect(() => {
    setChoice("");
  }, [resetCount]);

  useEffect(() => {}, [answered]);
  
  useEffect(() => {
    if(q&&q.initial)
    if(choice==q.initial.correctOption) {
      let corr = [...correct];
      corr[i] = true;
      setCorrect(corr); 
    } else {
      let corr = [...correct];
      corr[i] = false;
      setCorrect(corr); 
    }
    if (Array.isArray(answered))

      {
        
        if (choice != "") {
          let ans = [...answered];
          ans[i] = true;
          setAnswered(ans);
        } else {
          let ans = [...answered];
          ans[i] = false;
          setAnswered(ans);
        }

      }
     
  }, [choice]);
  if (submitted) {
    function QuizOption({ option, idx }) {
      if (option == choice)
        if (choice == q.initial.correctOption) {
          return (
            <div className=" shadow-inner bg-emerald-500/70 rounded-2xl text-left py-[10px]">
              <RadioGroupItem
                value={"default" + idx}
                disabled
                className="ml-[20px]  "
                id={"r" + idx}
              />
              <Label htmlFor={"r" + idx} className="ml-[10px]  overflow-hidden">
                {" "}
                {option}
              </Label>
            </div>
          );
        } else {
          return (
            <div className=" shadow-inner bg-red-500/70 rounded-2xl text-left py-[10px]">
              <RadioGroupItem
                value={"default" + idx}
                disabled
                className="ml-[20px]  "
                id={"r" + idx}
              />
              <Label
                htmlFor={"r" + idx}
                className="ml-[10px]   overflow-hidden"
              >
                {" "}
                {option}
              </Label>
            </div>
          );
        }

      if (option == q.initial.correctOption) {
        return (
          <div className=" shadow-inner bg-cyan-500 rounded-2xl text-left py-[10px]">
            <RadioGroupItem
              value={"default" + idx}
              disabled
              className="ml-[20px]  "
              id={"r" + idx}
            />
            <Label htmlFor={"r" + idx} className="ml-[10px] overflow-hidden ">
              {" "}
              {option}
            </Label>
          </div>
        );
      } else {
        return (
          <div className=" shadow-inner bg-sky-200/70 rounded-2xl text-left py-[10px]">
            <RadioGroupItem
              value={"default" + idx}
              disabled
              className="ml-[20px]  "
              id={"r" + idx}
            />
            <Label htmlFor={"r" + idx} className="ml-[10px]   overflow-hidden">
              {" "}
              {option}
            </Label>
          </div>
        );
      }
    }
    return (
      <div className="rounded-xl chat-background mx-[20px] ">
        <div className="drop-shadow-sm font-medium font-roboto text-sky-800 py-[10px] text-left ml-[20px]">
          <span className=" font-extrabold">{(i+1) + "."}</span>
          {" " + q.initial.question}
        </div>

        <div className="mx-[20px] rounded-xl mb-[20px] flex flex-col gap-2">
          <RadioGroup defaultValue="n">
            {q.shuffled.map((option, idx) => (
              <QuizOption option={option} idx={option} key={option} />
            ))}
          </RadioGroup>
        </div>
        <div className="flex flex-row items-center justify-between font-roboto text-sky-800 pb-[20px] mr-[40px]">
          <div
            className="font-extralight ml-[20px] w-2/3 italic text-sm "
            style={{ visibility: hintVisible ? "visible" : "hidden" }}
          >
            {q.initial.hint}
          </div>
          <Button
            onClick={() => setHintVisible(!hintVisible)}
            className="animated-row bg-sky-200/70 p-[10px] rounded-xl text-sky-800"
          >
            Toggle Hint
          </Button>
        </div>
      </div>
      // when choice == shuffled[i]
      // if q.initial.correctOptions == choice
      // green bg
      // else
      // red bg
      // modify global state for correct out of
    );
  }

  if (q && q.initial && q.shuffled)
    return (
      <div className="rounded-xl chat-background mx-[20px] ">
        <div className="drop-shadow-sm font-normal font-roboto text-sky-800 py-[10px] text-left ml-[20px]">
          <span className=" font-extrabold">{(i+1) + "."}</span>
          {" " + q.initial.question}
        </div>

        <div className="mx-[20px] rounded-xl mb-[20px] flex flex-col gap-2">
          <RadioGroup defaultValue="comfortable">
            {q.shuffled.map((option, idx) => (
              <div className=" shadow-inner bg-sky-200/70 rounded-2xl text-left py-[10px]">
                <RadioGroupItem
                  value={"default" + idx}
                  checked={option == choice}
                  onClick={() => setChoice(option)}
                  className="ml-[20px]  "
                  id={"r" + idx}
                />
                <Label
                  htmlFor={"r" + idx}
                  className="ml-[10px]  overflow-hidden"
                >
                  {" "}
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div className="flex flex-row items-center justify-between font-roboto text-sky-800 pb-[20px] mr-[40px]">
          <div
            className="font-extralight ml-[20px] w-2/3 italic text-sm"
            style={{ visibility: hintVisible ? "visible" : "hidden" }}
          >
            {q.initial.hint}
          </div>
          <Button
            onClick={() => setHintVisible(!hintVisible)}
            className="animated-row bg-sky-200/70 p-[10px] rounded-xl text-sky-800"
          >
            Toggle Hint
          </Button>
        </div>
      </div>
    );
}

function QuizButtons({
  setSubmitted,
  setQuizVisible,
  submitted,
  reset,
  questions,
  answered,
  correct,
  shuffle
}) {
  let ansNum = 0;
  let corrNum = 0;
  if (Array.isArray(answered))
    ansNum = answered.filter((ans: boolean) => ans !== false).length;

  if (Array.isArray(correct))
    corrNum = correct.filter((corr: boolean) => corr !== false).length;

  useEffect(() => {}, [ansNum]);
  return (
    <div
      style={{ zIndex: 9999 }}
      className="text-start border-2 border-white absolute chat-background w-full rounded-t-xl h-[84px]"
    >
      <div className="flex flex-row  justify-center">
        <div className="text-center rounded-full w-[200px] pb-[10px] mt-[8.5px] m-[12px] bg-white/40 text-sm  ">
          {submitted?
          
          <div className="pt-[10px] text-zinc-600">
            Correct {corrNum} out of {questions.length} 
          </div>
          :
          <div className="pt-[10px] text-zinc-600">
          Answered {ansNum} out of {questions.length} 
        </div>
        }
        </div>
        <div className=" last: mr-[12px]   right-0    p-[10px]  rounded-xl  font-bold font-roboto   text-end  pb-[10px]  ">
          <Button
            className="  w-[100px]   hover:bg-sky-500 text-white bg-sky-700 border-[1px] border-sky-800 "
            onClick={() => setQuizVisible(false)}
          >
            <ArrowLeft className="ml-[-5px] mr-[5px]" />
            Go Back
          </Button>
        </div>

        <div className=" mr-[12px]   right-0    p-[10px]  rounded-xl  font-bold font-roboto   text-end  pb-[10px]  ">
          <Button
            onClick={() => shuffle(true)}
            className="w-[100px]   hover:bg-sky-300 text-sky-800 bg-transparent border-[1px] border-sky-800 "
          >
            Shuffle Order
          </Button>
        </div>

      
          <div className=" mr-[12px]   right-0    p-[10px]  rounded-xl  font-bold font-roboto   text-end  pb-[10px]  ">
            <Button
              onClick={() => reset()}
              className="w-[100px]   hover:bg-sky-300 text-sky-800 bg-transparent border-[1px] border-sky-800 "
            >
              Reset
            </Button>
          </div>
       
        <div className=" mr-[12px]   right-0    p-[10px]  rounded-xl  font-bold font-roboto   text-end  pb-[10px]  ">
          <Button
            onClick={() => setSubmitted(true)}
            className="w-[100px]   hover:bg-sky-300 text-sky-800 bg-transparent border-[1px] border-sky-800 "
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Quiz({ setQuizVisible }) {
  const { selectedQuiz } = useContext(QuizzesContext);
  //const [questions,setQuestions] = useState([{}])
  const [submitted, setSubmitted] = useState(false);
  const { slug } = useContext(SlugContext);

  const [questions, setQuestions] = useState([{}]);

  const [answered, setAnswered] = useState([]) as any;
  const [correct, setCorrect] = useState([]) as any;
  const [initialQuestions, setInitialQuestions] = useState([{}]);
  const [resetCount, setResetCount] = useState(0);

  // shuffle order of questions
  // true or false to also shuffle individual questions
  function shuffle(deep) {
    if(!deep) {
      let q = shuffleArray([...questions])
      setQuestions(q)
    } else {

      let q = ([...questions])
    
      q.forEach((q_ :any) =>{
        let options = shuffleArray([...q_.shuffled])
        q_.shuffled = options

      })

      let q_arr = shuffleArray([...q])
      setQuestions(q_arr)
    }
  
  }

  useEffect(() => {
    async function fetchQuestions() {
      if (!selectedQuiz) return;

      const uri = slug;
      const title = (selectedQuiz as any).title;
      const body = { uri, title };

      const res = await fetch("/api/question/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      let questions = [] as any;

      let answered = [] as boolean[];
      let correct = [] as boolean[];
      data.forEach((datum: Question) => {
        let options = shuffleArray([datum.a, datum.b, datum.c, datum.d]);
        let question = { initial: datum, shuffled: options };

        questions.push(question);
        correct.push(false);
        answered.push(false);
      });

      setAnswered(answered);
      setCorrect(correct);
      setInitialQuestions(questions);
      setQuestions(questions);
    }

    fetchQuestions();
  }, [selectedQuiz]);

  useEffect(() => {}, [questions, submitted]);
  function reset() {
    setSubmitted(false);
    setQuestions(initialQuestions);
    setResetCount(resetCount + 1);
  }

  return (
    <ScrollArea className="text-center h-[87svh]" viewportRef={null}>
      <QuizButtons
      shuffle={shuffle}
        answered={answered}
        setSubmitted={setSubmitted}
        setQuizVisible={setQuizVisible}
        submitted={submitted}
        reset={reset}
        questions={questions} correct={correct}      />

      <div className="font-bold text-2xl text-sky-800 pb-[10px] [text-shadow:_0_1px_0_rgb(40_40_200_/_10%)] mt-[100px]">
        {(selectedQuiz as any).title!}
      </div>

      <div className="gap-3 flex flex-col pb-[20px]">
        {questions.map((question: any, idx: number) => (
          <QuizQuestion
            setCorrect={setCorrect}
            correct={correct}
            answered={answered}
            setAnswered={setAnswered}
            q={question}
            submitted={submitted}
            resetCount={resetCount}
            i={idx}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
