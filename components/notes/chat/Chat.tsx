import { ResizablePanel } from "../../ui/resizable";
import { Separator } from "../../ui/separator";
import { ScrollArea } from "../../ui/scroll-area";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { options as authOptions } from "../../../pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { useRouter } from "next/navigation";
// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
//   console.log("here");
//   const session = await getSession({ req });
//   if (!session) {
//     res.statusCode = 403;
//     return { props: { messages: [] } };
//   }
//   console.log(session.id);
//   console.log(session);
//   const messages = await prisma.message.findMany({
//     where: { authorId: session.user.authorId },
//   });

//   console.log(messages);
//   return {
//     props: { messages },
//   };
// };

export default function Chat({ messagesLoaded }) {
  // const { messages, input, handleInputChange, handleSubmit, data } = useChat();
  type Message = {
    index: number;
    authorId: string;
    role: string;
    content: string;
  };
  const [data, setData] = useState();
  const [messages, setMessages] = useState<Message[]>(messagesLoaded);
  const [input, setInput] = useState("");
  const router = useRouter();
  async function handleSubmit(e: React.SyntheticEvent) {
    const prompt = input;

    const body = { prompt, messagesLoaded };

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    router.refresh();
    //setMessages(messages + data);
    //
    // call api
    // use returned data to render into messages
  }

  const handleInputChange = (e: React.SyntheticEvent) => {
    //
    // set input
    e.preventDefault();
    setInput(e.target.value);
  };

  // useEffect(() => {
  //   const fetchApi = async () => {
  //     const msgs = await fetch("/api/load_chat/", {
  //       method: "GET",
  //       headers: { "Content-Type": "application/json" },
  //     });

  //     const data = await msgs.json();

  //     setMessages(data);
  //   };
  //   fetchApi();
  // }, []);

  // useEffect(() => {
  //   const res = await fetch("/api/load_chat/" + session.id, {
  //     method: "GET",
  //     headers: { "Content-Type": "application/json" },
  //   });

  //   // setMessages(props.messages);
  // }, [messages]);

  console.log(messages);

  return (
    <>
      <ScrollArea>
        <ResizablePanel className="min-h-[50px] max-h-[50px] " defaultSize={1}>
          {/* (AI?) Buttons go here */}
        </ResizablePanel>

        <ResizablePanel className="bg-white ">
          <Separator />

          <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
            {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
            {messagesLoaded ? (
              messagesLoaded.map((m: any) => (
                <div key={m.id} className="whitespace-pre-wrap">
                  {m.role === "user" ? "User: " : "AI: "}
                  {m.content}
                </div>
              ))
            ) : (
              <p></p>
            )}

            <form onSubmit={handleSubmit}>
              <input
                className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
                value={input}
                placeholder="Say something..."
                onChange={handleInputChange}
              />
            </form>
          </div>
        </ResizablePanel>
      </ScrollArea>
    </>
  );
}
