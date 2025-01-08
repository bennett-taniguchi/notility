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
import { TrashIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { Skeleton } from "../ui/skeleton";

export default function ChatWindow({ messagesLoaded, title,children }) {
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

    const messages = messagesLoaded;

    if (title === "") {
      const body = { prompt, messages };
      const res = await fetch("/api/chat/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      setInput("");
      setLoading(false);
      Router.push("/chat");
    } else {
      const body = { prompt, messages, title };
     await fetch("/api/chat/update/rag/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then(() => {
        setInput("");
        setLoading(false);
        Router.push("/chat/" + title);
      })
     
    }
  }

  // tracks text input for chat
  const handleInputChange = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setInput((e.target as HTMLInputElement).value);
  };

 
  // delete all chat logs
  async function handleDeleteChat(e: React.SyntheticEvent) {
    console.log('chat title',title)
    const body = { title };
    await fetch("/api/chat/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(() => {
      Router.push("/chat");
    })

  
  }

  useEffect(() => {
 
    scrollMsg();
  }, [messagesLoaded]);

  const scrollMsg = (amt = 99999999) => {
   
    if (viewportRef !== null && viewportRef.current !== null) {
      // here scroll, Ex: to the right
      console.log("view");
      console.log(viewportRef.current);
      viewportRef.current.scrollTo({
        top: amt,
        left: 0,
        behavior: "smooth",
      });
    }
  };
 
  return (
    
<div>
        <ResizablePanel defaultSize={1} className={'chat-background '}  >
         
          <CardTitle className="  text-3xl text-sky-800 ml-[2svw] border-none my-auto py-[0svh]  flex flex-row">
          <div className="absolute left-[2svw] top-[12svh] text-sky-100 ">
          Chat
          </div>
          
          
            <div className="ml-[30svw] mb-[1svh]">
            {children}
            </div>
          
          </CardTitle>
        </ResizablePanel>
 
        <ResizablePanel  >
           <ScrollArea  className=" shadow-inner  bg-sky-100  h-[80svh]  " viewportRef={viewportRef}> 
          <div  className="   bg-sky-100 w-[45svw]  flex flex-col  max-w-1/2 py-10 mx-auto stretch gap-y-2 min-h-[80svh]  pb-[200px]">
          
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
                        ? "bg-cyan-200/50 drop-shadow-md border-cyan-400 shadow-inner"
                        : "bg-white/50 drop-shadow-lg shadow-inner border-zinc-200"
                    }
                  >
                    <div key={m.id} className="whitespace-pre-wrap">
                      <CardHeader>
                        {m.role === "user" ? (
                          <Pencil2Icon className=" hover:bg-cyan-400 fixed right-5 scale-[1.3] hover:drop-shadow-2xl rounded" />
                        ) : (
                          <div />
                        )}
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
              <Card   className="bg-indigo-400">
                <CardContent className="bg-white/50 text-md text-mono   text-center py-10 text-slate-600/90">
                
                  # Sources Selected
                  "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."
                 
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
                <div className="rounded-xl mb-2 fixed bottom-0 w-[45svw] bg-white/50 h-[10svh]    flex justify-center border border-gray-300 " />
              </div>
            </CardTitle>
           
            
              <div   >

          
              <form onSubmit={handleSubmit} className="flex justify-center ">
                <input
                  className="rounded-md focus:ring-[2px] focus:outline-none fixed bottom-0  mx-auto p-2 my-8  ml-[-3svw] border-gray-300  shadow-xl w-[40svw]"
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
