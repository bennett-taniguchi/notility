import { ScrollArea } from "../../ui/scroll-area";
import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "../../ui/button";
import MessageList from "./messages/MessageList";
import PulsingDots from "./loading/PulsingDots";
import InputArea from "./input/InputArea";
import SourcesBlurb from "./messages/SourcesBlurb";
import { RiExpandHorizontalSFill } from "react-icons/ri";
import { CollapseContext } from "../../context/context";
import { Toaster } from "../../ui/toaster";

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
    console.log(collapse);
    if (collapse == "chat") {
      (setCollapse as any)("none");
    } else {
      (setCollapse as any)("chat");
    }
  }

  if (collapse == "chat") {
    return (
      <div>
        <RiExpandHorizontalSFill
          className="     hover:text-black text-white w-[20px] h-[20px] absolute right-[5px] top-[5px] cursor-pointer"
          width={40}
          height={40}
        />
      </div>
    );
  }
  console.log(selected);
  return (
    <div className="  w-[48svw]  border-cyan-400/50 border-2 rounded-md">
      <div>
        <ScrollArea
          className="   bg-sky-100  h-[86.7svh]  rounded-[12px]  rounded-b-[1px]"
          viewportRef={viewportRef}
        >
          <div className="   bg-sky-100 w-[45svw]  flex flex-col  max-w-1/2 py-10  stretch gap-y-2 min-h-[80svh]  pb-[200px] ">
            <RiExpandHorizontalSFill
              onClick={() => toggleCollapse()}
              style={{ zIndex: 10 }}
              className="    bg-white/30 rounded  hover:text-black text-white w-[20px] h-[20px] absolute right-[5px] top-[5px] cursor-pointer"
              width={40}
              height={40}
            />
            <div
              style={{ zIndex: 1 }}
              className="fixed  mt-[-4.4svh] chat-background  rounded-t-md w-[47.8svw] text-right flex flex-col  border-2 border-white border-t-white   rounded-b-none "
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

            <div className="ml-[3svw]  mt-[50px]">
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
              Drop Supabase and Local Storage and Pinecone Namespace
            </Button>
          </div>
          <Toaster />
        </ScrollArea>
      </div>
    </div>
  );
}
