import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandGroup,
  CommandList,
  CommandEmpty,
} from "./ui/command";

import {
  PlusCircledIcon,
  MinusCircledIcon,
  Pencil1Icon,
} from "@radix-ui/react-icons";
import { FaBoltLightning } from "react-icons/fa6";

import Router from "next/router";

import {
  HTMLtoText,
  chunkTextByMultiParagraphs,
  embedChunks,
  upsertVectors,
} from "../utils/parse_text";

import { useState } from "react";

export default function Sidebar({
  title,
  setTitle,
  setContent,
  createNewNote,
  updateNote,
  maintainTitle,
  loadNotes,
  props,
}) {
  const [pencilHover, setPencilHover] = useState(false);
  const [minusHover, setMinusHover] = useState(false);

  const deleteNotes = async (e: React.SyntheticEvent, titleUsed: string) => {
    e.preventDefault();
    const res = await fetch("/api/notes/delete/" + titleUsed, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (title == titleUsed) {
      setTitle("");
      setContent("");
    }
    await Router.push("/notes");
  };

  // for minus icon
  const handleMinusClick = (e: React.SyntheticEvent) => {
    let removedNote = props.notes[(e.target as HTMLElement).id];
    console.log(removedNote);
    if (removedNote) {
      deleteNotes(e, removedNote.title);
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

  const handlePencilClick = (e: React.SyntheticEvent) => {
    console.log(e.currentTarget);
    //parentRef.current.focus();
  };

  // takes current text (in first note) then
  //  chunks it
  //  split on paragraphs
  //  and then embeds it
  //  then upserts it
  async function parseText(content: any) {
    const parsed = HTMLtoText(props.notes[0].content);
    const chunks = chunkTextByMultiParagraphs(parsed);

    const res = await embedChunks(chunks);
    const upserted = await upsertVectors(res, chunks);

    // format:
    // 0: {embedding (1536) [.1232,...], index:0, object:"embedding"},
  }
  // nested component for AI queries
  function Promptbar() {
    return (
      <CommandGroup>
        <CommandItem className="">
          <span className="text-xs text-zinc-600 font-medium ">
            Notes Analyzed
          </span>
          <FaBoltLightning
            onClick={parseText}
            className="stroke-zinc-600 stroke-[.5px] right-5 position: absolute hover:stroke-zinc-200 hover:fill-yellow-400"
          />
        </CommandItem>
      </CommandGroup>
    );
  }
  if (!props) return <div></div>;
  console.log(props);
  // sizes of elements are hardcoded, figure out better way?

  return (
    <ScrollArea className="rounded-md p-0   ">
      <Command className="  size-full rounded-lg    ">
        <CommandInput placeholder="Search Title:" />
        <CommandList className="overflow-hidden h-screen">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            <CommandItem className="">
              <span className="text-xs text-zinc-600 font-medium ">
                Recent Notes
              </span>
              <PlusCircledIcon
                onClick={handlePlusClick}
                className="stroke-zinc-600 stroke-[.5px] right-5 position: absolute hover:stroke-zinc-200 scale-110"
              ></PlusCircledIcon>
            </CommandItem>
            <div>
              {props.notes.map((note, index) => (
                <CommandItem
                  onSelect={
                    minusHover == pencilHover
                      ? (e) => loadNotes(e, props.notes[index].title)
                      : (e) => e
                  }
                >
                  <span
                    className="outline-none"
                    onFocus={maintainTitle}
                    onBlur={handleUpdateTitle}
                    contentEditable={true}
                  >
                    {note.title}
                  </span>

                  <span>
                    <Pencil1Icon
                      id={index + ""}
                      onClick={handlePencilClick}
                      className="stroke-zinc-600 stroke-[.5px] right-5 position: absolute hover:stroke-zinc-200 translate-x-[-1.5rem] scale-110 translate-y-[-.5rem]"
                      onMouseEnter={(e) => setPencilHover(true)}
                      onMouseLeave={(e) => setPencilHover(false)}
                    />
                  </span>
                  <span>
                    <MinusCircledIcon
                      id={index + ""}
                      onClick={handleMinusClick}
                      className="stroke-zinc-600 stroke-[.5px] right-5 position: absolute hover:stroke-zinc-200 scale-110 translate-y-[-.5rem]"
                      onMouseEnter={(e) => setMinusHover(true)}
                      onMouseLeave={(e) => setMinusHover(false)}
                    />
                  </span>
                </CommandItem>
              ))}
            </div>
          </CommandGroup>
          <Promptbar />
        </CommandList>
      </Command>
    </ScrollArea>
  );
}
