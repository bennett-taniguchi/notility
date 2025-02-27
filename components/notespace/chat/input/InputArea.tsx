import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { SlugContext } from "../../../context/context";
import { TrashIcon } from "@radix-ui/react-icons";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../ui/tooltip";

export default function InputArea({setLoading,scrollMsg,selected,messagesLoaded,title} ) {
    const Router = useRouter()
    const [input, setInput] = useState("");
    const {slug} = useContext(SlugContext)

  // for submitting current chat message and updating state reflecting back and forth
  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setLoading(true);
    scrollMsg();
    const prompt = input;
    const uri = slug;
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
      Router.push("/notespace/" + uri);
    } else {
      let selectedArr = selected.selectedArr;
      console.log("47 chat, RAG:", selected, selectedArr);
      const body = { prompt, messages, selectedArr, uri, title, };


     await fetch("/api/neo4j/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }) 
      setInput("");
        setLoading(false);
        Router.push("/notespace/" + uri);
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
    return (

        <div  >
        <form onSubmit={handleSubmit} className="flex justify-center ">
          <input
            id="query"
            maxLength={500}
            className="border-2 border-sky-400/50 h-[70px] align-top rounded-md focus:ring-[2px] focus:outline-none fixed bottom-4  mx-auto p-2 my-[1svh]  ml-[3svw]     shadow-md shadow-indigo-100 w-[45svw]"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
            autoComplete="off"
          />
          <div>
          <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
        <TrashIcon
          className=" fixed  bottom-[5.5svh] right-[54svw] scale-150 hover:stroke-red-400   hover:stroke-[.7] rounded-full  "
          onClick={handleDeleteChat}
        />
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete Current Chat</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
          
          </div>
       
        </form>
       
      </div>

    )
}
