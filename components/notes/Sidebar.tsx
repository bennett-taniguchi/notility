import { ResizablePanel } from "../ui/resizable";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandGroup,
  CommandList,
  CommandEmpty,
} from "../ui/command";

import { PlusCircledIcon, MinusCircledIcon } from "@radix-ui/react-icons";

import Router from "next/router";

export default function Sidebar({
  setTitle,
  setContent,
  createNewNote,
  updateNote,
  maintainTitle,
  loadNotes,
  props,
}) {
  const deleteNotes = async (e: React.SyntheticEvent, title: string) => {
    e.preventDefault();
    const res = await fetch("/api/delete/" + title, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setTitle("");
    setContent("");
    console.log(data);
    await Router.push("/notes");
  };

  // for minus icon
  const handleMinusClick = (e: React.SyntheticEvent) => {
    if (props.notes[e.target.id]) {
      console.log(props.notes[e.target.id].title);
      deleteNotes(e, props.notes[e.target.id].title);
    }
  };

  // for plus icon
  const handlePlusClick = (e: React.SyntheticEvent) => {
    createNewNote(e);
  };

  const handleUpdateTitle = (e: React.SyntheticEvent) => {
    if (e.currentTarget.innerHTML) {
      updateNote(e, e.currentTarget.innerHTML, "");
    }
  };

  // sizes of elements are hardcoded, figure out better way?
  return (
    <ScrollArea className="rounded-md border p-0 h-[900px] outline-none">
      <Command className="h-[1000px] rounded-lg border shadow-md overflow-y-auto pr-[5px] outline-none">
        <CommandInput placeholder="Search Title:" />
        <CommandList className="overflow-hidden h-[900px]">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            <CommandItem className="">
              <span className="text-xs text-zinc-600 font-medium ">
                Recent Notes
              </span>
              <PlusCircledIcon
                onClick={handlePlusClick}
                className="stroke-zinc-600 stroke-[.5px] right-5 position: absolute hover:stroke-zinc-200"
              ></PlusCircledIcon>
            </CommandItem>
            {props.notes.map((note, index) => (
              <CommandItem>
                <span
                  className="outline-none"
                  onFocus={maintainTitle}
                  onBlur={handleUpdateTitle}
                  contentEditable={true}
                  onClick={(e) => loadNotes(e, props.notes[index].title)}
                >
                  {note.title}
                </span>
                <MinusCircledIcon
                  id={index + ""}
                  onClick={handleMinusClick}
                  className="stroke-zinc-600 stroke-[.5px] right-5 position: absolute hover:stroke-zinc-200"
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </ScrollArea>
  );
}
