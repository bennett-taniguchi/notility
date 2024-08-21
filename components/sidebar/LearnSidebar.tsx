import { PiCardsFill } from "react-icons/pi";
import { CommandGroup, CommandItem } from "../ui/command";
import Router from "next/router";
import { HoverCardTrigger } from "@radix-ui/react-hover-card";
import { HoverCard, HoverCardContent } from "../ui/hover-card";

export default function LearnSidebar({ location, Router }) {
  async function handleNavLearn() {
    if (location === "learn") return;
    await Router.push("/learn");
  }

  return (
    <CommandGroup className="pb-[50px]">
      {/* Learn, Flashcards, Tests, etc */}
      <CommandItem
        onSelect={handleNavLearn}
        className={
          location === "learn"
            ? "bg-emerald-300 drop-shadow-[5px_5px_5px_rgb(103,232,249,.5)] hover:drop-shadow-[5px_5px_5px_rgb(31,78,47,.5)] landingCard"
            : "bg-[rgba(168,225,213,.5)] landingCard"
        }
      >
        <span className="text-md text-zinc-600 font-medium ">Learn 🏫</span>
      </CommandItem>
    </CommandGroup>
  );
}
