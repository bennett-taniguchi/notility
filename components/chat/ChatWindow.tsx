import { ResizablePanel } from "../ui/resizable";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import { options as authOptions } from "../../pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { useRouter } from "next/navigation";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TrashIcon } from "@radix-ui/react-icons";
import { Skeleton } from "../ui/skeleton";
import { Label } from "../ui/label";

export default function ChatWindow({ messagesLoaded, title, children,blurb,selected, slug }) {
  const viewportRef = useRef<HTMLDivElement>(null);

  // const [messages, setMessages] = useState<Message[]>(messagesLoaded); // potential future use for editing singular message
  const [input, setInput] = useState("");
  const Router = useRouter();
  const [loading, setLoading] = useState(false);

  // for submitting current chat message and updating state reflecting back and forth
  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setLoading(true);
    scrollMsg();
    const prompt = input;
    const uri = slug
    const messages = messagesLoaded;

    if (selected.selectedArr.length === 0) {
      const body = { prompt, messages, uri, title };
      const res = await fetch("/api/chat/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      setInput("");
      setLoading(false);
      Router.push("/notespace/"+uri);
    } else {
      let selectedArr = selected.selectedArr
      console.log('47 chatwind',selected,selectedArr)
      const body = { prompt, messages, selectedArr,uri, title };
      await fetch("/api/chat/update/rag/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then(() => {
        setInput("");
        setLoading(false);
        Router.push("/notespace/"+uri);
      });
    }
  }

  // tracks text input for chat
  const handleInputChange = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setInput((e.target as HTMLInputElement).value);
  };

  // delete all chat logs
  async function handleDeleteChat(e: React.SyntheticEvent) {
    console.log("chat title", title);
    const body = { title };
    await fetch("/api/chat/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(() => {
      Router.push("/notespace/");
    });
  }

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

  return (
    <div>
      <ResizablePanel defaultSize={1} className={"chat-background  "}>
        <CardTitle className="  text-3xl text-sky-800 ml-[2svw] border-none my-auto py-[0svh]  flex flex-row">
          <div className="absolute  left-[2svw] top-[12svh] text-zinc-100 ">
            Chat
          </div>
          <div className="text-center w-[10svw] h-[4.2svh] hover:h-[40svh] overflow-hidden  text-lg shadow-md  font-medium cursor-pointer absolute animated-button py-2 px-1 rounded-xl text-indigo-700/ ml-[20svw] top-[12svh] ">{selected.selected && selected.selected.length !=0 ? selected.selected : 'Nothing Selected Yet'}</div>
          <div className="ml-[42svw] mb-[1svh]">{children}</div>
        </CardTitle>
      </ResizablePanel>

      <ResizablePanel  >
        <ScrollArea
          className=" shadow-[inset_-5px_0px_5px_rgba(0,0,0,0.1)]   bg-sky-100  h-[80svh]   "
          viewportRef={viewportRef}
        >
          <div className="   bg-sky-100 w-[45svw]  flex flex-col  max-w-1/2 py-10 mx-auto stretch gap-y-2 min-h-[80svh]  pb-[200px]">
            {messagesLoaded && messagesLoaded.length != 0 ? (
              messagesLoaded.map((m: any) => (
                <div
                  className={
                    m.role === "user"
                      ? "flex justify-end"
                      : "flex justify-start"
                  }
                >
                  <Card
                    className={
                      m.role === "user"
                        ? "bg-sky-200 drop-shadow-md border-sky-400 shadow-inner min-w-[10svw]"
                        : "bg-indigo-200 drop-shadow-lg shadow-inner border-indigo-400 min-w-[10svw]"
                    }
                  >
                    <div key={m.id} className="whitespace-pre-wrap">
                      <CardHeader>
                      
                        <CardTitle className="font-bold font-mono">
                          {m.role === "user" ? "User: " : "AI: "}
                        </CardTitle>
                      </CardHeader>

                      <CardContent>
                        <Markdown
                          className="text-gray-600"
                          remarkPlugins={[remarkGfm]}
                        >
                          {m.content}
                        </Markdown>
                      </CardContent>
                    </div>
                  </Card>
                </div>
              ))
            ) : (
              <Card className="rounded-xl bg-indigo-300">
                <CardContent className="rounded-xl bg-white/50 text-md text-mono   text-center py-10 text-slate-600/90">
                {selected.selected && selected.selected.length != 0 ? selected.selected : 'No Sources Selected, select from above'}
                </CardContent>
              </Card>
            )}
            {loading === true ? (
              <div className="flex justify-center gap-2 mt-5">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
            ) : (
              <div />
            )}

            <CardTitle>
              <div className="flex justify-center ">
 
              </div>
            </CardTitle>

            <div>
           
              <form onSubmit={handleSubmit} className="flex justify-center " >
            
                <input
                id='query'
                 maxLength={500}
                  className="h-[90px] align-top rounded-md focus:ring-[2px] focus:outline-none fixed bottom-0  mx-auto p-2 my-[1svh]  ml-[0svw] border-gray-300   shadow-md shadow-indigo-100 w-[46svw]"
                  value={input}
                  placeholder="Say something..."
                  onChange={handleInputChange}
                />
        
              </form>
              <TrashIcon
                className=" fixed  bottom-[5svh] right-[54svw] scale-150 hover:stroke-zinc-400 hover:bg-zinc-200/50 hover:stroke-[.5] rounded-full  "
                onClick={handleDeleteChat}
              />
            </div>
          </div>
       
        </ScrollArea>
       
      </ResizablePanel>
      
    </div>
  );
}
