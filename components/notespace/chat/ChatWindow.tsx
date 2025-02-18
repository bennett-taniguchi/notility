import { ResizablePanel } from "../../ui/resizable";
import { ScrollArea } from "../../ui/scroll-area";
import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { TrashIcon } from "@radix-ui/react-icons";
import { Skeleton } from "../../ui/skeleton";
import { Button } from "../../ui/button";
import Latex from "react-latex-next";
import MessageList from "./messages/MessageList";
import PulsingDots from "./loading/PulsingDots";
import InputArea from "./input/InputArea";
import SourcesBlurb from "./messages/SourcesBlurb";
import { Separator } from "../../ui/separator";
import { MdExpandCircleDown } from "react-icons/md";
import { RiExpandHorizontalSFill } from "react-icons/ri";
import { CollapseContext } from "../../context/context";

export default function ChatWindow({
  messagesLoaded,
  title,
  children,
  blurb,
  selected,
  slug,
  sources,
 
}) {
  const {collapse,setCollapse} = useContext(CollapseContext)
  const viewportRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const Router = useRouter();

  useEffect(() => {
    scrollMsg();
  }, [messagesLoaded]);

  useEffect(() => {
  },[collapse])

  const scrollMsg = (amt = 99999999) => {
    if (viewportRef !== null && viewportRef.current !== null) {
      // here scroll, Ex: to the right

      viewportRef.current.scrollTo({
        top: amt,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  async function dropUploads(slug: string) {
    // delete local storage
    localStorage.setItem("savedSelectedSources", "");
    // delte upload content info in supabase
    await fetch("/api/supabase/upload/dropall", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    // refresh
    Router.push("/notespace/" + slug);
  }
 
  function toggleCollapse(  ){ 
    console.log(collapse)
    if(collapse=='chat') {
      (setCollapse as any)('none')
    } else {
      (setCollapse as any)('chat')
    }
    }

    if(collapse=='chat') return (<div>  <Button
      style={{ zIndex: 999 }}
      className="absolute right-[5px] top-[5px] cursor-pointer  hover:bg-zinc-200 bg-white border-black border-[1px]  p-0 px-[6px]  h-[15px]"
      onClick={()=>toggleCollapse()}
    >
      <RiExpandHorizontalSFill
        className="  text-black w-[20px] h-[20px]"
        width={40}
        height={40}
      />
    </Button></div>)

  return (
    <div className="  w-[48svw]  border-cyan-400/50 border-2 rounded-xl">
      <div>
        <ScrollArea
          className="   bg-sky-100  h-[86.7svh]  rounded-[14px]  rounded-b-[10px]"
          viewportRef={viewportRef}
        >
          <div className="   bg-sky-100 w-[45svw]  flex flex-col  max-w-1/2 py-10  stretch gap-y-2 min-h-[80svh]  pb-[200px] ">
            <Button
              style={{ zIndex: 999 }}
              className="absolute right-[5px] top-[5px] cursor-pointer  hover:bg-zinc-200 bg-white border-black border-[1px]  p-0 px-[6px]  h-[15px]"
              onClick={()=>toggleCollapse()}
            >
              <RiExpandHorizontalSFill
                className="  text-black w-[20px] h-[20px]"
                width={40}
                height={40}
              />
            </Button>
            <div className="    mt-[-4.4svh] chat-background  rounded-t-md w-[47.8svw] text-right flex flex-col  border-2 border-white border-t-white   rounded-b-none ">
              <div className="text-3xl text-left drop-shadow-md  text-white ml-[10px] pt-[21px]   font-roboto  h-[80px] whitespace-nowrap">
                {" "}
                Chat with AI using {sources.length} Sources{" "}
                <div className="text-right "> {children}</div>
              </div>

              {/* <div className="mb-[1svh] text-right mt-[-2.5svh] mr-[.5svw] ">
              
              </div> */}
            </div>

            <div className="ml-[3svw]">
              <SourcesBlurb sources={sources} selected={selected} />
            </div>
            <MessageList messagesLoaded={messagesLoaded} />

            <PulsingDots loading={loading} />

            <InputArea
              setLoading={setLoading}
              scrollMsg={scrollMsg}
              selected={selected}
              messagesLoaded={messagesLoaded}
              title={title}
            />

            <Button
              className={
                "animated-row ml-[3svw] text-black border-2 border-white"
              }
              onClick={() => dropUploads(slug)}
            >
              Drop Supabase and Local Storage
            </Button>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
