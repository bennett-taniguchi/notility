import { ResizablePanel } from "../ui/resizable";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import { options as authOptions } from "../../pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { useRouter } from "next/navigation";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TrashIcon, Pencil2Icon } from "@radix-ui/react-icons";

export default function ChatWindow({ messagesLoaded }) {
  //lol for not wasting openai credits
  const { data: session, status } = useSession();
  if (
    session?.user.email != "bennettt356@gmail.com" &&
    session?.user.email != "tanigb@uw.edu" &&
    session
  ) {
    return null;
  }

  // const [messages, setMessages] = useState<Message[]>(messagesLoaded); // potential future use for editing singular message
  const [input, setInput] = useState("");
  const Router = useRouter();

  // for submitting current chat message and updating state reflecting back and forth
  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    const prompt = input;

    const messages = messagesLoaded;
    const body = { prompt, messages };

    const res = await fetch("/api/chat/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setInput("");
    Router.push("/chat");
  }

  // tracks text input for chat
  const handleInputChange = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setInput((e.target as HTMLInputElement).value);
  };

  // delete all chat logs
  async function handleDeleteChat(e: React.SyntheticEvent) {
    const res = await fetch("/api/chat/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    await Router.push("/chat");
  }

  return (
    <>
      <ScrollArea>
        <ResizablePanel className="" defaultSize={1}>
          {/* (AI?) Buttons go here */}
        </ResizablePanel>

        <ResizablePanel className="bg-zinc-100 ">
          <Separator />
          <div className="flex flex-col w-3/4 max-w-1/2 py-24 mx-auto stretch gap-y-2 bg-zinc-100 pb-[200px]">
            {/* {data && <pre>{JSON.stringify(data, null, 2)}</pre>} */}
            {messagesLoaded.length != 0 ? (
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
                        ? "bg-cyan-200 drop-shadow-md border-cyan-400 shadow-inner"
                        : "bg-white drop-shadow-lg shadow-inner border-zinc-200"
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
              <Card>
                <CardContent className="text-sm text-mono  h-[100px] text-center py-10">
                  Try typing a message to talk to the AI
                </CardContent>
              </Card>
            )}

            <CardTitle>
              <div className="flex justify-center">
                <div className="fixed bottom-0 bg-white h-[100px] w-[80vw] flex justify-center border border-gray-300" />
              </div>
            </CardTitle>
            <CardContent>
              <TrashIcon
                className=" fixed bottom-10 right-10 translate-x-[-5rem] scale-150 hover:stroke-zinc-400 hover:bg-zinc-200 hover:stroke-[.5] rounded-full"
                onClick={handleDeleteChat}
              />

              <form onSubmit={handleSubmit} className="flex justify-center ">
                <input
                  className="fixed bottom-0 w-[60vw] p-2 mb-8 border border-gray-300 rounded shadow-xl"
                  value={input}
                  placeholder="Say something..."
                  onChange={handleInputChange}
                />
              </form>
            </CardContent>
          </div>
        </ResizablePanel>
      </ScrollArea>
    </>
  );
}