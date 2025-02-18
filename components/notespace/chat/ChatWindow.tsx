import { ResizablePanel } from "../../ui/resizable";
import { ScrollArea } from "../../ui/scroll-area";
import { useEffect, useRef, useState } from "react";
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

export default function ChatWindow({
  messagesLoaded,
  title,
  children,
  blurb,
  selected,
  slug,
  sources,
}) {
  const viewportRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const Router = useRouter();

  useEffect(() => {
    scrollMsg();
  }, [messagesLoaded]);

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

  return (
    <div className="  w-[48svw]  border-cyan-400/50 border-2 rounded-2xl">
      <div>
        <ScrollArea
          className="   bg-sky-100  h-[86.7svh]  rounded-xl "
          viewportRef={viewportRef}
        >
          <div className="   bg-sky-100 w-[45svw]  flex flex-col  max-w-1/2 py-10  stretch gap-y-2 min-h-[80svh]  pb-[200px]">
            <div className="  mt-[-5svh] chat-background  rounded-t-md w-[48svw] text-right flex flex-col  border-b-2 border-cyan-400/50">
              <div className="text-3xl text-left text-white ml-[10px] mt-[20px] mb-[-5px] font-roboto   ">
                {" "}
                Chat with AI using {sources.length} Sources{" "}
                
              </div>

              <div className="mb-[1svh] text-right mt-[-2.5svh] mr-[.5svw] ">
                {children}
              </div>
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
              className={"bg-sky-400/50 ml-[3svw] hover:bg-sky-600"}
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
