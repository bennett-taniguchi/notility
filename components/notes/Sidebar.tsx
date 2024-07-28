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
import { FaBoltLightning } from "react-icons/fa6";

import Router from "next/router";

import {
  HTMLtoText,
  chunkTextByMultiParagraphs,
  embedChunks,
  upsertData,
} from "../../utils/parse_text";
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
    let removedNote = props.notes[(e.target as HTMLElement).id];
    if (removedNote) {
      console.log(removedNote.title);
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

  async function parseText(content: any) {
    const parsed = HTMLtoText(props.notes[0].content);
    const chunks = chunkTextByMultiParagraphs(parsed);
    const res = await embedChunks(chunks);
    const upserted = await upsertData(res, chunks, "notility");

    console.log(res[0].embedding);
    console.log(upserted);

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
          {/* <PlusCircledIcon
            onClick={handlePlusClick}
            className="stroke-zinc-600 stroke-[.5px] right-5 position: absolute hover:stroke-zinc-200"
          ></PlusCircledIcon> */}
        </CommandItem>
        {/* {props.notes.map((note, index) => (
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
        ))} */}
      </CommandGroup>
    );
  }

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
          <Promptbar />
        </CommandList>
      </Command>
    </ScrollArea>
  );
}
