import { PiCardsFill } from "react-icons/pi";
import { CommandGroup, CommandItem } from "../ui/command";
import Router from "next/router";

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
            ? "bg-cyan-200  drop-shadow-[5px_5px_5px_rgb(103,232,249,.5)] hover:drop-shadow-[5px_5px_5px_rgb(103,232,249)]"
            : "bg-[rgba(168,225,213,.5)] hover:drop-shadow-[5px_5px_5px_rgb(103,232,249)]"
        }
      >
        <span className="text-md text-zinc-600 font-medium ">Learn 🏫</span>
        <PiCardsFill
          // onClick={handleLightningClick}
          className="stroke-zinc-600 stroke-[.5px] right-5 position: absolute hover:stroke-zinc-200 hover:fill-yellow-400"
        />
      </CommandItem>
    </CommandGroup>
  );
}
