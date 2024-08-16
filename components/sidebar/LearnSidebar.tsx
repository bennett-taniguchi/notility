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
            ? "bg-emerald-200 drop-shadow-[5px_5px_5px_rgb(103,232,249,.5)] hover:drop-shadow-[5px_5px_5px_rgb(103,232,249)] "
            : "bg-[rgba(168,225,213,.5)] hover:drop-shadow-[5px_5px_5px_rgb(103,232,249)] landingCard"
        }
      >
        <HoverCard openDelay={0}>
          <HoverCardTrigger>
            {/* <PiCardsFill
              // onClick={handleLightningClick}
              className="stroke-zinc-600 stroke-[.5px] top-2.5 right-5 position: absolute hover:stroke-zinc-200 hover:fill-yellow-400"
            /> */}
            <span className="text-md text-zinc-600 font-medium ">Learn 🏫</span>
          </HoverCardTrigger>
          <HoverCardContent
            avoidCollisions={true}
            sideOffset={-20}
            className="w-[200px] h-[150px] text-sm"
          >
            Here you can convert your notes to flashcards, or make your own, as
            well as study tests based on flashcards
          </HoverCardContent>
        </HoverCard>
      </CommandItem>
    </CommandGroup>
  );
}
