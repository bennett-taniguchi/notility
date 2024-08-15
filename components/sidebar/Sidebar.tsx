import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
} from "../ui/command";

import Router from "next/router";
import LearnSidebar from "./LearnSidebar";
import ChatSidebar from "./ChatSidebar";
import NoteSidebar from "./NoteSidebar";

export default function Sidebar({
  title,
  setTitle,
  setContent,
  props,
  location,
}) {
  if (!props) return <div></div>;

  return (
    <ScrollArea className="rounded-md p-0   ">
      <Command className="  size-full rounded-lg    ">
        <CommandInput placeholder="Search Title:" />
        <CommandList className="overflow-hidden h-screen">
          <CommandEmpty>No results found.</CommandEmpty>
          <NoteSidebar
            Router={Router}
            location={location}
            props={props}
            title={title}
            setTitle={setTitle}
            setContent={setContent}
          />
          <ChatSidebar Router={Router} location={location} props={props} />
          <LearnSidebar Router={Router} location={location} />
        </CommandList>
      </Command>
    </ScrollArea>
  );
}
