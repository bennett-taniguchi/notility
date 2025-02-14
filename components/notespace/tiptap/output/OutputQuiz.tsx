import { useEffect, useRef, useState } from "react";
import { Button } from "../../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../ui/dialog";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Textarea } from "../../../ui/textarea";
import { cn } from "../../../lib/utils";
import { ScrollArea } from "../../../ui/scroll-area";
 

function TagOptions({textInput, parentSize,setTagList,setLatestInput,tagList,inputFocused,filteredOptions, setFilteredOptions}) {
    function insertTag(name) {
        setTagList([...tagList, name]);
        
        setFilteredOptions(filteredOptions.filter((opt)=> opt!=name))
        setLatestInput("");
      }
  let options = [
    ...tagList,'math','physics','english'
  ];
  let visibility = (inputFocused== true && filteredOptions.length != 0) ? '':'hidden'
useEffect(()=> {
    setFilteredOptions(options.filter((option) => option.toLowerCase().includes(textInput) && !tagList.includes(option)))
},[textInput])
  return (
    <ScrollArea
    id="tag"
      style={{ position: "absolute", width:parentSize-2+'px',visibility: visibility as any}}
      className="mt-[-1px] ml-[2px] w-[400px] h-[100px] absolute bg-zinc-200 rounded-b-md"
      viewportRef={null}
    >
      {filteredOptions.map((option,idx) => (
        <ul id={'tag'+idx} className=" ml-[2px] text-sm  font-normal hover:bg-zinc-300" onClick={()=>insertTag(option)}>{option}</ul>
      ))}
    </ScrollArea>
  );
}
// includes Bubble, BubbleList, padding calculations
function BubbledInput({ latestInput, setLatestInput, tagList, setTagList, filteredOptions,setFilteredOptions }) {
    const inputRef = useRef(null)
    const inputRefDiv = useRef(null)
    const [inputWidth,setInputWidth] = useState(0)
    const [inputFocused,setInputFocused] = useState(false)
    useEffect(() => {
        const handleResize = () => {
          if (inputRef.current) {
            const rect = (inputRef as any).current.getBoundingClientRect();
            setInputWidth(rect.width);
          }
        };
    
        handleResize();
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);
  function BubbleList({ tagArr }) {
    //let totalString = tagArr.join();
    
    return (
      <div className="ml-1">
        {tagArr.map((tag: String, idx: number) => (
             
          <Bubble key={idx+""} text={tag} idx={idx} totalString={tagArr.slice(0, idx)} />
        ))}
      </div>
    );
  }

  function handleDeleteTag(idx) {
    let tagVal = tagList[idx]
    let arr = tagList.filter((tag, i) => idx != i);

    setTagList(arr);
    setFilteredOptions([...filteredOptions,tagVal])
  }
  function Bubble({ text, idx, totalString }) {
    const width = `w-[${text.length * 7}px]`;

    return (
      <div
        // style={{ marginLeft: `${50 * idx}px` }}
        style={{ marginLeft: `${20 * idx + calcTextWidth(totalString)}px` }}
        className={cn(
          "absolute mt-[-33px] h-[30px]   bg-zinc-200 rounded-xl",
          width
        )}
      >
        <span className={cn("line-clamp-1 text-sm ml-[5px]   mt-[5px]", width)}>
          {text}
          <span
            onClick={() => handleDeleteTag(idx)}
            className="align-top hover:text-red-600 font-roboto cursor-pointer ml-[2px] mr-[4px] text-gray-800 font-normal "
          >
            x
          </span>
        </span>
      </div>
    );
  }

  function calcTextWidth(string) {
    // ACCURATE METHOD ADD AS UTIL
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context!.font = getComputedStyle(document.body).font;
    return context!.measureText(string).width;
  }
 
  function handleEnterPressed(e,filteredOptions) {
    if (e.key != "Enter") return;
    if (tagList.includes(latestInput)) {
      console.log("error tag already exists");
      return;
    }
    console.log(filteredOptions)
    // validate unique tags
    if(filteredOptions.length!=0) {
        console.log('sdf')
        setTagList([...tagList, filteredOptions[0]]);
    }
 
    setLatestInput("");
  }
  // pad input after tags by appropriate amount
  function paddingAmount(tagArr) {
    let combinedLength = 0;

    combinedLength = calcTextWidth(tagArr.join()) + tagArr.length * 20;

    // tagArr.forEach((tag,idx) => {

    //     combinedLength +=  calcTextWidth(tag)*2+20*idx;
    // });
    console.log("combinedLength", combinedLength);
    return `${combinedLength}px`;
  }

  function testBlur(e) {
    
   console.log(document.activeElement)
    //if(!(e.currentTarget.id.contains('tag')))
    
     

    // if(document.activeElement && inputRef.current)
    //     console.log((inputRef as any).current.contains(document.activeElement)   )
    // //console.log(document.activeElement.contains(inputRefDiv.current)   )
   
    // // console.log(inputRefDiv.current.contains(document.activeElement))
    // //console.log(!(inputRefDiv.current as any).current.contains(document.activeElement))

    // let notChild = true
    // if(document.activeElement && inputRef.current && inputRefDiv.current) {
    //   console.log((inputRefDiv as any).current.contains(e.currentTarget))
    //     //!(inputRef as any).current.contains(document.activeElement)
    // }
      
    // setInputFocused(document.activeElement==e.currentTarget&&notChild)
  }
  
  return (
    <div ref={inputRefDiv}>
      <Input
        id="name"
        onChange={(e) => setLatestInput(e.currentTarget.value)}
        value={latestInput}
        className={cn("col-span-3")}
        style={{ paddingLeft: paddingAmount(tagList) }}
        onKeyDown={(e)=>handleEnterPressed(e,filteredOptions)}
        ref={inputRef}
        onBlur={(e)=>testBlur(e)}
        onFocus={(e)=>setInputFocused(document.activeElement==e.currentTarget)}
        autoComplete={'off'}
      />
      <TagOptions setFilteredOptions={setFilteredOptions} filteredOptions={filteredOptions} inputFocused={inputFocused}tagList={tagList} textInput={latestInput} setLatestInput={setLatestInput} setTagList={setTagList }parentSize={inputWidth}/>
      <BubbleList tagArr={tagList} />
    </div>
  );
}
// OutputQuiz will be another component, rendered within the OutputArea OutputTable
export default function QuizDialog({ visible, setVisible, uri, Router }) {
  const [quizTitle, setQuizTitle] = useState("");
  const [filteredOptions,setFilteredOptions] = useState([])
  const [tagList, setTagList] = useState([
   
  ]);
  const [latestInput, setLatestInput] = useState("");
  async function createQuiz(str) {
    //   let oldTitle = title;
    //   const body = { newTitle, oldTitle, uri };
    //   await fetch("/api/notes/update/title", {
    //     method: "PATCH",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(body),
    //   });
    //   Router.push("/notespace/" + uri);
  }

  return (
    <Dialog modal={true} open={visible} onOpenChange={setVisible}>
      <DialogContent className="sm:max-w-[800px]  ">
        <DialogHeader>
          <DialogTitle>Create Quiz</DialogTitle>
          <DialogDescription>
            New Quiz Name: <i>{quizTitle}</i>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 items-center gap-4 -ml-[0svw]">
            <Label htmlFor="name" className="text-left">
              New Quiz
            </Label>
            <Input
              id="name"
              onChange={(e) => setQuizTitle(e.currentTarget.value)}
              value={quizTitle}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-1 items-center gap-4 -ml-[0svw]">
            <Label htmlFor="name" className="text-left">
              Select Sources, Notes, or Topics
            </Label>
            <BubbledInput
      
            filteredOptions={filteredOptions}
            setFilteredOptions={setFilteredOptions}
              latestInput={latestInput}
              setLatestInput={setLatestInput}
              tagList={tagList}
              setTagList={setTagList}
            />
          </div>

          <div className="grid grid-cols-1 items-center gap-4 -ml-[0svw]">
            <Label htmlFor="name" className="text-left text-gray-500">
              Describe what you want to be quizzed on (optional)
            </Label>
            <Textarea
              id="name"
              //onChange={(e) => setQuizTitle(e.currentTarget.value)}
            //   value={quizTitle}
              className="col-span-3 h-[20svh] resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            className="mx-auto"
            type="submit"
            onClick={() => createQuiz(quizTitle).then(() => setVisible(false))}
          >
            Generate Quiz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
