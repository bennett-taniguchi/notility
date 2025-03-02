'use client'
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { CollapseContext, SlugContext } from "../../../context/context";
import { TrashIcon } from "@radix-ui/react-icons";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../ui/tooltip";
import { toast } from "../../../../hooks/use-toast";
import { cn } from "../../../lib/utils";

export default function InputArea({setLoading,scrollMsg,selected,messagesLoaded,title} ) {
    const Router = useRouter()
    const [input, setInput] = useState("");
    const {slug} = useContext(SlugContext)
    const {collapse} = useContext(CollapseContext)
    

  // for submitting current chat message and updating state reflecting back and forth
  async function handleSubmit(e: React.SyntheticEvent) {
    
    e.preventDefault();
    if(input.length < 20) {
      toast({
        title:'Please enter a longer prompt',
        description:`Enter at least 20 characters currently you\'ve entered ${input.length} characters`,
        duration:5000
      })
      console.log('short input case, length:',input.length)
      return;
    }
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


     await fetch("/api/chat/update/rag", {
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
            className={cn("border-2 border-sky-400/50 h-[70px] align-top rounded-md focus:ring-[2px] focus:outline-none fixed bottom-4  mx-auto p-2 my-[1svh]  ml-[3svw]     shadow-md shadow-indigo-100 ",collapse=='output' ? 'w-[90svw]' : 'w-[45svw]')}
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
          className={cn(" fixed  bottom-[5.5svh]  scale-150 hover:stroke-red-400   hover:stroke-[.7] rounded-full  ",collapse=='output' ? 'right-[7svw]' : 'right-[54svw]')}
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
