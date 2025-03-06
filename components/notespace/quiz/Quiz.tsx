import { useContext } from "react";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { ScrollArea } from "../../ui/scroll-area";
import { IoMdArrowBack } from "react-icons/io";
import { QuizzesContext } from "../../context/context";


 
function QuizQuestion({q} ) {
    let nums = [1, 2, 3, 4];
    return (
        <div className="rounded-xl chat-background mx-[20px] ">
        <div className="drop-shadow-sm font-bold font-roboto text-sky-800 py-[10px] text-left ml-[40px]">
          Question {q}:
        </div>

        <div className="mx-[20px] rounded-xl mb-[20px] flex flex-col gap-2">
          <RadioGroup defaultValue="comfortable">
            {nums.map((num, idx) => (
              <div className=" shadow-inner bg-sky-200/70 rounded-2xl text-left py-[10px]">
                <RadioGroupItem
                  value={"default" + idx}
                  className="ml-[20px]  "
                  id={"r" + idx}
                />
                <Label htmlFor={"r" + idx} className="ml-[10px] ">
                  {" "}
                  Option: {num}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div className="flex flex-row items-center justify-between font-roboto text-sky-800 pb-[20px] mr-[40px]">
          <div className="font-medium ml-[20px] w-2/3">Hint Area</div>
          <Button className="animated-row bg-sky-200/70 p-[10px] rounded-xl text-sky-800">
            Get Hint
          </Button>
        </div>
      </div>

    )
}
export default function Quiz({ setQuizVisible }) {
  let nums = [1, 2, 3, 4];
  const {selectedQuiz} = useContext(QuizzesContext)
console.log(selectedQuiz)
  return (
    <ScrollArea className="text-center h-[87svh]" viewportRef={null}>
        <div className="text-start">
      <Button className="  ml-[20px] mt-[20px] hover:bg-sky-300 text-sky-800 bg-transparent border-[1px] border-sky-800" onClick={() => setQuizVisible(false)}>
      <IoMdArrowBack  className="ml-[-5px] mr-[5px]"/>Go Back
      </Button></div>

      <div className="font-bold text-2xl text-sky-800 pb-[10px] [text-shadow:_0_1px_0_rgb(40_40_200_/_10%)]">
        Quiz on {(selectedQuiz as any).title!}
      </div>

      <div className="gap-3 flex flex-col pb-[20px]">
        {nums.map((num) => (
         <QuizQuestion q={num}/>
        ))}

        <div className=" mr-[12px]   right-0    p-[10px]  rounded-xl  font-bold font-roboto   text-end  pb-[10px]  ">
          <Button className="w-[200px]   hover:bg-sky-300 text-sky-800 bg-transparent border-[1px] border-sky-800 ">Submit</Button>
        </div>
      </div>
    </ScrollArea>
  );
}
