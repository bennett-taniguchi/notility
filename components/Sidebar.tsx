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
import { PiCardsFill } from "react-icons/pi";

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
  props,
  location,
}) {
  const [initial, setInitial] = useState(false);
  const [pencilHover, setPencilHover] = useState(false);
  const [minusHover, setMinusHover] = useState(false);

  // for updating title in sidebar
  const maintainTitle = (e: React.SyntheticEvent) => {
    if (initialEdit) {
      setMaintainedTitle((e.target as HTMLElement).innerText);
      setInitialEdit(false);
    }
  };
  // tracks currently editted title to ensure update in db
  const [initialEdit, setInitialEdit] = useState(true);
  const [maintainedTitle, setMaintainedTitle] = useState("");

  const updateNote = async (e: React.SyntheticEvent, newTitle, newContent) => {
    e.preventDefault();
    if (newTitle === title) {
      return;
    }
    try {
      const title = newTitle;
      const content = newContent;
      const oldTitle = maintainedTitle;
      const body = { title, content, oldTitle };

      await fetch("/api/notes/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setInitialEdit(true);
      setTitle(newTitle);
      await Router.push("/notes");
    } catch (error) {
      console.error(error);
    }
  };

  // look at currently displayed props.note and make new note accordingly
  //      works as we refresh on every update, however this is api-call intensive
  //      look into caching or more performant way of updating (on save or something)
  //          basically iterates through "New Note"(s) in current props and appends 1st after gap
  const createNewNote = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    let numberMap = new Map<number, number>();
    numberMap.set(0, 1);
    let index = 1;
    for (let i = 0; i < props.notes.length; i++) {
      let currTitle = props.notes[i].title;
      if (currTitle.startsWith("New Note ")) {
        currTitle = currTitle.replace("New Note ", "");
        if (!Number.isNaN(parseInt(currTitle))) {
          numberMap.set(parseInt(currTitle), 1);
          while (numberMap.has(index)) {
            index++;
            if (index == 10) break; // limit notes to 10, remove this **
          }
        }
      }
    }
    try {
      const title = "New Note " + index;
      const content = "New Note";
      const body = { title, content };
      await fetch("/api/notes/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push("/notes");
    } catch (error) {
      console.error(error);
    }
  };

  // currently we use search for db which we dont wanna stick with (use more logic)
  const loadNotes = async (title: string) => {
    const res = await fetch("/api/notes/load/" + title, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();

    if (location == "notes")
      await Router.push(
        { pathname: `/notes/[slug]`, query: { slug: data.title } },
        undefined,
        { shallow: true }
      );
    // await Router.push(`/notes/${encodeURIComponent("swag")}`, undefined, {
    //   shallow: true,
    // });
    else if (location == "chat")
      await Router.push({
        pathname: `/notes/[slug]`,
        query: { slug: data.title },
      });

    setTitle(data.title);
    setContent(data.content);

    // await Router.push("/notes");
    return false;
  };
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
    //console.log(e.currentTarget);
    //parentRef.current.focus();
  };

  // takes current text (in first note) then
  //  chunks it
  //  split on paragraphs
  //  and then embeds it
  //  then upserts it
  async function handleLightningClick(content: any) {
    const parsed = HTMLtoText(props.notes[0].content);
    const chunks = chunkTextByMultiParagraphs(parsed);

    const res = await embedChunks(chunks);
    const upserted = await upsertVectors(res, chunks);

    // format:
    // 0: {embedding (1536) [.1232,...], index:0, object:"embedding"},
  }

  async function handleNavNotes() {
    if (location === "notes") return;
    await Router.push("/notes/landing");
  }

  async function handleNavChat() {
    if (location === "chat") return;
    await Router.push("/chat");
  }

  async function handleNavLearn() {
    if (location === "learn") return;
    await Router.push("/learn");
  }
  if (!props) return <div></div>;
  console.log(props);

  if (props.query && !initial) {
    if (props.query != "landing") loadNotes(props.query);
    setInitial(true);
  }

  return (
    <ScrollArea className="rounded-md p-0   ">
      <Command className="  size-full rounded-lg    ">
        <CommandInput placeholder="Search Title:" />
        <CommandList className="overflow-hidden h-screen">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {/* Notesbar Component */}
            <CommandItem
              onSelect={handleNavNotes}
              className={location === "notes" ? "bg-cyan-200" : "bg-zinc-200"}
            >
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
                  className={
                    note.title == title
                      ? "bg-cyan-100  "
                      : "aria-selected:bg-accent"
                  }
                  id={note.title}
                  onSelect={
                    minusHover == pencilHover
                      ? (e) => loadNotes(props.notes[index].title)
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
          <CommandGroup>
            {/* Prompt Bar Component  (Chat) */}
            <CommandItem
              onSelect={handleNavChat}
              className={location === "chat" ? "bg-cyan-200" : "bg-zinc-200"}
            >
              <span className="text-xs text-zinc-600 font-medium ">
                Notes Analyzed
              </span>
              <FaBoltLightning
                onClick={handleLightningClick}
                className="stroke-zinc-600 stroke-[.5px] right-5 position: absolute hover:stroke-zinc-200 hover:fill-yellow-400"
              />
            </CommandItem>
          </CommandGroup>

          <CommandGroup>
            {/* Learn, Flashcards, Tests, etc */}
            <CommandItem
              onSelect={handleNavLearn}
              className={location === "chat" ? "bg-cyan-200" : "bg-zinc-200"}
            >
              <span className="text-xs text-zinc-600 font-medium ">Learn</span>
              <PiCardsFill
                // onClick={handleLightningClick}
                className="stroke-zinc-600 stroke-[.5px] right-5 position: absolute hover:stroke-zinc-200 hover:fill-yellow-400"
              />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </ScrollArea>
  );
}
