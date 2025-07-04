import { ScrollArea } from "../../ui/scroll-area";
import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "../../ui/button";
import MessageList from "./messages/MessageList";
import PulsingDots from "./loading/PulsingDots";
import InputArea from "./input/InputArea";
import SourcesBlurb from "./messages/SourcesBlurb";
import { FoldHorizontal  } from "lucide-react";
import { CollapseContext } from "../../context/context";
import { Toaster } from "../../ui/toaster";
import { cn } from "../../lib/utils";

export default function ChatWindow({
  messagesLoaded,
  title,
  children,
  blurb,
  selected,
  slug,
  sources,
}) {
  const { collapse, setCollapse } = useContext(CollapseContext);
  const viewportRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const Router = useRouter();

  useEffect(() => {
    scrollMsg();
  }, [messagesLoaded]);

  useEffect(() => {}, [collapse]);

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
    localStorage.setItem(slug + "*savedSelectedSources", "");
    // delte upload content info in supabase
    await fetch("/api/supabase/upload/dropall", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const uri = slug;
    const body = { uri };
    await fetch("/api/pinecone/delete/namespace", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    // refresh
    Router.push("/notespace/" + slug);
  }

  function toggleCollapse() {
 
    if (collapse == "output") {
      (setCollapse as any)("none");
    } else if (collapse=='none'){
      (setCollapse as any)("chat");
    } else {
      (setCollapse as any)("none");
    }
    
  }

  if (collapse == "chat") {
    return (
      <div>
        <FoldHorizontal 
          className="     hover:text-black text-white w-[20px] h-[20px] absolute right-[5px] top-[5px] cursor-pointer"
          width={40}
          height={40}
        />
      </div>
    );
  }
 
  return (
    <div   className= {cn("border-cyan-400/50 border-2 rounded-md ", collapse=='output' ? 'w-[98svw] ml-[1svw] ' : 'w-[48svw]')} >
      <div>
        <ScrollArea
          className="   bg-sky-100  h-[86.7svh]  rounded-[12px]  rounded-b-[1px]"
          viewportRef={viewportRef}
        >
          <div className={cn("bg-sky-100   flex flex-col  max-w-1/2 py-10  stretch gap-y-2 min-h-[80svh]  pb-[200px] ", collapse=='output' ? 'w-[98svw] mr-[2svw] ml-[-2svw]' : 'w-[45svw]')}>
            <FoldHorizontal 
              onClick={() => toggleCollapse()}
              style={{ zIndex: 10 }}
              className="    bg-white/30 rounded  hover:text-black text-white w-[20px] h-[20px] absolute right-[5px] top-[5px] cursor-pointer"
              width={40}
              height={40}
            />
            <div
              style={{ zIndex: 1 }}
              className={cn("fixed  mt-[-4.4svh] chat-background  rounded-t-md  text-right flex flex-col  border-2 border-white border-t-white   rounded-b-none ", collapse=='output' ? 'w-[97.8svw] ml-[2svw] ' : 'w-[47.8svw]')}
            >
              <div className="text-3xl text-left drop-shadow-md  text-white ml-[10px] pt-[21px]   font-roboto  h-[80px] whitespace-nowrap">
                {" "}
                Chat with AI using{" "}
                <span className="text-indigo-800/80">
                  {selected.selectedArr.length}{" "}
                  {selected.selectedArr.length == 1 ? "Source" : "Sources"}{" "}
                </span>
                <div className="text-right "> {children}</div>
              </div>
            </div>

            <div className= {cn("ml-[3svw]  mt-[50px]", collapse=='output' ? 'w-[70svw]  ml-[15svw]' : '')}>
              <SourcesBlurb sources={sources} selected={selected} />
            </div>

            <MessageList messagesLoaded={messagesLoaded} />

            <div className="ml-[3svw]">
              <PulsingDots loading={loading} />
            </div>

            <InputArea
              setLoading={setLoading}
              scrollMsg={scrollMsg}
              selected={selected}
              messagesLoaded={messagesLoaded}
              title={title}
            />

            <Button
              className={
                "animated-row ml-[3svw] text-white border-2 border-white"
              }
              onClick={() => dropUploads(slug)}
            >
              Delete all local Data
            </Button>
          </div>
          <Toaster />
        </ScrollArea>
      </div>
    </div>
  );
}
