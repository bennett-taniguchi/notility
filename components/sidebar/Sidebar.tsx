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
import StatusSidebar from "./StatusSidebar";

export default function Sidebar({
  title,
  setTitle,
  setContent,
  props,
  location,
}) {
  if (!props) return <div></div>;

  return (
    <ScrollArea className=" ">
      <Command className="  size-full  sidebarGradient opacity-90  ">
        <CommandInput className=" " placeholder="Search Title:"    />
        <CommandList className="overflow-hidden h-screen  ">
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
          <StatusSidebar />
        </CommandList>
      </Command>
    </ScrollArea>
  );
}
