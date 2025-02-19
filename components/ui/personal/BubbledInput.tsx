import { useEffect, useState, useRef, useImperativeHandle } from "react";
import { cn } from "../../lib/utils";
import { Input } from "../input";
import { ScrollArea } from "../scroll-area";

function TagOptions({
  textInput,
  parentSize,
  setTagList,
  setLatestInput,
  tagList,
  inputFocused,
  filteredOptions,
  setFilteredOptions,
  scrollAreaRef,
}) {
  function insertTag(name) {
    setTagList([...tagList, name]);

    setFilteredOptions(filteredOptions.filter((opt) => opt != name));
    setLatestInput("");
  }
  let options = [...tagList, "math", "physics", "english"];
  let visibility =
    inputFocused == true && filteredOptions.length != 0 ? "" : "hidden";
  useEffect(() => {
    setFilteredOptions(
      options.filter(
        (option) =>
          option.toLowerCase().includes(textInput) && !tagList.includes(option)
      )
    );
  }, [textInput]);

  useEffect(() => {}, [parentSize]);
  return (
    <ScrollArea
      id="tag"
      ref={scrollAreaRef}
      style={{
        position: "absolute",
        width: parentSize - 2 + "px",
        visibility: visibility as any,
      }}
      className="mt-[-1px] ml-[2px] w-[400px] h-[100px] absolute bg-zinc-200 rounded-b-md"
      viewportRef={null}
    >
      {filteredOptions.map((option, idx) => (
        <ul
          id={"tag" + idx}
          className=" ml-[2px] text-sm  font-normal hover:bg-zinc-300"
          onClick={() => insertTag(option)}
        >
          {option}
        </ul>
      ))}
    </ScrollArea>
  );
}
// includes Bubble, BubbleList, padding calculations
// yes prop drilling to make it more modularized
// taglist : initial options given to user
// setTagist : usestate function component
// custominput : allow users to input options not listed
// inputvalue : ref that exposes current array of selected tags
// validator : function that runs on everyinsertion to verify input is legal
export default function BubbledInput({ tagList, setTagList, customInput= false, inputValue=null,validator=null, maxLength=10, classProps='' }) {
  const [latestInput, setLatestInput] = useState("");
  const [inputFocused, setInputFocused] = useState(false);

  const [filteredOptions, setFilteredOptions] = useState([]) as any[];
  const [inputWidth, setInputWidth] = useState(0);
  const scrollAreaRef = useRef(null);
  const inputRef = useRef(null);
  const inputDivRef = useRef(null);
  const originalTags = JSON.parse(JSON.stringify(['math','physics','english',JSON.parse(JSON.stringify(tagList))]));

  useImperativeHandle(inputValue, () => {
    return {
      get() {
        if(inputRef && inputRef.current)
          return tagList
       //return (inputRef.current as any).value
      }
      
    };
  }, [tagList]);

  function mouseClickHandler(e) {
    if (
      e.target != scrollAreaRef.current &&
      e.target != inputRef.current &&
      e.target != inputDivRef.current
    ) {
      setInputFocused(false);
    } else {
      setInputFocused(true);
    }
  }

  function validateInput(){
    return true
  }

  useEffect(() => {
  
    const handleResize = () => {
      if (inputRef.current) {
        const rect = (inputRef as any).current.getBoundingClientRect();
        setInputWidth(rect.width);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    document.addEventListener("click", mouseClickHandler);
    return () => {
      document.removeEventListener("click", mouseClickHandler);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
  }, [tagList]);

  function BubbleList({ tagArr }) {
    return (
      <div className={cn("ml-1")}>
        {tagArr.map((tag: String, idx: number) => (
          <Bubble
            key={idx + ""}
            text={tag}
            idx={idx}
            totalString={tagArr.slice(0, idx)}
          />
        ))}
      </div>
    );
  }

  function handleDeleteTag(idx,originalTags) {
    let tagVal = tagList[idx]; // string

    let arr = tagList.filter((tag, i) => idx != i);
    setTagList(arr);

    if(originalTags.includes(tagVal)){
      setFilteredOptions([...filteredOptions, tagVal]);
    }
  
  }

  function Bubble({ text, idx, totalString }) {
    const width = `w-[${text.length * 7}px]`;

    return (
      <div 
        style={{ marginLeft: `${20 * idx + calcTextWidth(totalString)}px` }}
        className={cn(
          "absolute mt-[-33px] h-[30px]   bg-zinc-200 rounded-xl",
          width
        )}
      >
        <span className={cn("line-clamp-1 text-sm ml-[5px]   mt-[5px]", width)}>
          {text}
          <span
            onClick={() => handleDeleteTag(idx,originalTags)}
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

  function handleEnterPressed(e, filteredOptions, customInput,latestInput,validator,maxLength) {
    if (e.key != "Enter" || tagList.length == maxLength) return;
    if (validator != null && !validator(latestInput)) return

    if (tagList.includes(latestInput)) {
      console.log("error tag already exists");
      return;
    }
  
    if(!customInput) {
      // take the top result
      if (filteredOptions.length != 0 && !tagList.includes(filteredOptions[0])) {    // need to validate unique tags
        setTagList([...tagList, filteredOptions[0]]);
      }
    } else {
      // take the top result if exact match
      if (filteredOptions.length != 0 && !tagList.includes(filteredOptions[0]) && filteredOptions[0].toLowerCase()==latestInput.toLowerCase()) {    // need to validate unique tags
        setTagList([...tagList, filteredOptions[0]]);
      } else {
        if(!tagList.includes(filteredOptions[0]))
        setTagList([...tagList, latestInput]);
      }
    }
    setLatestInput("");
  }
  // pad input after tags by appropriate amount
  function paddingAmount(tagArr) {
    let combinedLength = 0;
    combinedLength = calcTextWidth(tagArr.join()) + tagArr.length * 20;
    return `${combinedLength}px`;
  }

   return (
    <div ref={inputDivRef}  >
      <Input
        id="name"
        onChange={(e) => setLatestInput(e.currentTarget.value)}
        value={latestInput}
        className={cn("col-span-4",classProps )}
        style={{ paddingLeft: paddingAmount(tagList) }}
        onKeyDown={(e) => handleEnterPressed(e, filteredOptions,customInput,latestInput,validator,maxLength)}
        ref={inputRef
        }
        autoComplete={"off"}
      />
      <TagOptions

        setFilteredOptions={setFilteredOptions}
        filteredOptions={filteredOptions}
        inputFocused={inputFocused}
        tagList={tagList}
        textInput={latestInput}
        setLatestInput={setLatestInput}
        setTagList={setTagList}
        parentSize={inputWidth}
        scrollAreaRef={scrollAreaRef}
      />
      <BubbleList tagArr={tagList}  />
    </div>
  );
 
}

/**
 * TODO
 * 
 * Fix resizing width of input suggestions
 * Fix spacing on bubbles
 * Extend internal data???
 * Do not give autosuggest options if at max length
 * 
 */