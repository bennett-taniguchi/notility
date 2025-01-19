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
import { Button } from "../ui/button";
import Latex from "react-latex-next";

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

  // const [messages, setMessages] = useState<Message[]>(messagesLoaded); // potential future use for editing singular message
  const [input, setInput] = useState("");
  const Router = useRouter();
  const [loading, setLoading] = useState(false);

  function getKeywords(summary: string) {
    return summary.split(".")[0];
  }

  function lookupKeywords(title: string) {
    for (let i = 0; i < sources.length; i++) {
      if ((sources[i].title = title)) {
        return getKeywords(sources[i].summary);
      }
    }
  }

  function getKeywordsFromSources(titles: string[]) {
    let keywords = "";
    for (let i = 0; i < sources.length; i++) {
      if (titles.includes(sources[i].title)) {
        keywords += getKeywords(sources[i].summary).replace("Topics", "");
      }
    }
    return keywords;
  }
  // for submitting current chat message and updating state reflecting back and forth
  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setLoading(true);
    scrollMsg();
    const prompt = input;
    const uri = slug;
    const messages = messagesLoaded;

    let topics_str = getKeywordsFromSources(selected.selectedArr);

    if (selected.selectedArr.length === 0) {
      const body = { prompt, messages, uri, title };
      const res = await fetch("/api/chat/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      setInput("");
      setLoading(false);
      Router.push("/notespace/" + uri);
    } else {
      let selectedArr = selected.selectedArr;
      console.log("47 chatwind", selected, selectedArr);
      const body = { prompt, messages, selectedArr, uri, title, topics_str };
      await fetch("/api/chat/update/rag/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then(() => {
        setInput("");
        setLoading(false);
        Router.push("/notespace/" + uri);
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
    const body = { slug };
    await fetch("/api/chat/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(() => {
      Router.push("/notespace/" + slug);
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

  async function createPinecone() {
    await fetch("/api/pinecone/create/createIndex", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
  }
  async function dropUploads(slug: string) {
    await fetch("/api/pinecone/delete/dropall", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    await fetch("/api/upload/delete/dropall", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    Router.push("/notespace/" + slug);
  }
  async function testChunking() {
    // let prompt = "Seven hundred years before the story's start, humankind colonized Luna, where the Society—a rigid social hierarchy of 14 Colors with specialized roles—was developed for efficiency and order. The Society, harshly ruled by certain families of mentally and physically superior Golds, conquered Earth and colonized moons and small planets. Reds are the Society's lowest-status laborers. Mars's underground Red mining colonies compete in rigged contests that sow discord and are lied to that Mars is not yet terraformed.At the story's outset, 16-year-old Darrow is a rash, intelligent, dexterous, newly-wed Red helium-3 miner. Darrow and his wife Eo are publicly whipped for visiting a restricted underground forest. With Mars ArchGovernor Nero present and the event being filmed, Eo sings a song protesting the Reds' enslavement. Nero has Eo publicly hanged. A grieving Darrow illegally buries Eo and is hanged too, but survives due to his uncle Narol drugging him.Narol then delivers Darrow to the Sons of Ares, who aim to overturn the Society's hierarchy. The Sons used footage of Eo's song and execution as propaganda. Dancer, a Red, wants Darrow to infiltrate the Society as a Gold. Darrow is physically transformed by Mickey (a Violet), physically trained by Harmony (a Red), and taught Gold customs by Matteo (a Pink).Using a fabricated Gold identity, Darrow excels in testing and is accepted into Mars's Institute. He is drafted into SchoolHouse Mars, where he befriends Cassius. The Institute begins with the Passage: Within each of the 12 SchoolHouses, students are beaten, then paired off (a high test scorer with a low test scorer) to fight to the death barehanded. Darrow kills Cassius's brother, Julian, and lies about it. Sevro kills high-status Priam."
    // const body = { prompt };
    // const res = await fetch("/api/openai/summarize", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(body)
    // });
    // const data = await res.json()
    // console.log(data)
  }
  return (
    <div>
      <ResizablePanel defaultSize={1} className={"chat-background  "}>
        <CardTitle className="  text-3xl text-sky-800 ml-[2svw] border-none my-auto py-[0svh]  flex flex-row">
          <div className="absolute  left-[2svw] top-[12svh] text-zinc-100 ">
            Chat
          </div>
          <div className="text-center w-[10svw] h-[4.2svh] hover:h-[40svh] overflow-hidden  text-lg shadow-md  font-medium cursor-pointer absolute animated-button py-2 px-1 rounded-xl text-indigo-700/ ml-[20svw] top-[12svh] ">
            {selected.selected && selected.selected.length != 0
              ? selected.selected
              : "Nothing Selected Yet"}
          </div>
          <div className="ml-[42svw] mb-[1svh]">{children}</div>
        </CardTitle>
      </ResizablePanel>

      <ResizablePanel>
        <ScrollArea
          className=" shadow-[inset_-5px_0px_5px_rgba(0,0,0,0.1)]   bg-sky-100  h-[80svh]   "
          viewportRef={viewportRef}
        >
          <div className="   bg-sky-100 w-[45svw]  flex flex-col  max-w-1/2 py-10 mx-auto stretch gap-y-2 min-h-[80svh]  pb-[200px]">
            <Card className="rounded-xl bg-indigo-300">
              <CardContent className="rounded-xl bg-white/50 text-md text-mono   text-center py-10 text-slate-600/90">
                <span className="font-bold font-roboto text-xl text-slate-600">
                  {selected.selected && selected.selected.length != 0
                    ? selected.selected
                    : "No Sources Selected, select from above"}
                </span>
                {selected.selectedArr.map((title) => (
                  <div>
                    <span className="font-semibold font-roboto">{title}:</span>{" "}
                    <span className="text-xs">{lookupKeywords(title)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
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
                      <span className=" text-slate-600">
                        <CardContent>
                         
                          <Latex>
                         {m.content} 
                         </Latex>
                        
                          {m.role !== "user" &&
                          m.match &&
                          m.match.length != 0 ? (
                            <>
                              

                              <div className="flex flex-col gap-2 px-2 rounded-lg bg-white shadow-sm mt-5">
                                {true && (
                                  <div className=" ">
                                    <div className=" bg-transparent rounded-md mb-2">
                                      <p className="text-sm text-gray-600 font-medium">
                                        Source :
                                      </p>
                                      <blockquote className="mt-1 text-xs text-black border-l-2 border-sky-800/40 pl-3 line-clamp-3">
                                        {m.match}
                                      </blockquote>
                                      <p className="mt-1 text-xs text-black">
                                        Relevance score:{" "}
                                        {Math.round(m.matchScore * 100)}%
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </>
                          ) : (
                            <></>
                          )}
                        </CardContent>
                      </span>
                    </div>
                  </Card>
                </div>
              ))
            ) : (
              <></>
            )}
            {loading === true ? (
              <div className="flex justify-center gap-2 mt-5">
                <Skeleton className="h-4 w-4 rounded-full pulsing-dot-1" />
                <Skeleton className="h-4 w-4 rounded-full pulsing-dot-2" />
                <Skeleton className="h-4 w-4 rounded-full pulsing-dot-3" />
              </div>
            ) : (
              <div />
            )}

            <CardTitle>
              <div className="flex justify-center "></div>
            </CardTitle>

            <div>
              <form onSubmit={handleSubmit} className="flex justify-center ">
                <input
                  id="query"
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

            <Button onClick={() => testChunking()}>Test Chunking</Button>
            <Button onClick={() => dropUploads(slug)}>
              Drop Pinecone and Supabase
            </Button>
            <Button onClick={() => createPinecone()}>
              Create Pinecone Index
            </Button>
          </div>
        </ScrollArea>
      </ResizablePanel>
    </div>
  );
}
