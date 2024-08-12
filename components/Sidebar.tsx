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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Separator } from "@radix-ui/react-separator";
import { Checkbox } from "./ui/checkbox";
import { headers } from "next/headers";

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
  const [checkboxSelected, setCheckboxSelected] = useState<number[]>([]); // modal
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
      await Router.push("/notes/landing");
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
    await Router.push("/notes/landing");
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
    // const parsed = HTMLtoText(props.notes[0].content);
    // const chunks = chunkTextByMultiParagraphs(parsed);
    // const res = await embedChunks(chunks);
    // const upserted = await upsertVectors(res, chunks);
    // format:
    // 0: {embedding (1536) [.1232,...], index:0, object:"embedding"},

    setCheckboxSelected([]);
  }

  async function handleCheckboxClicked(e: React.SyntheticEvent) {
    const checked = e.target.getAttribute("data-state");

    if (checked == "checked") {
      let found = checkboxSelected.filter((n) => n !== parseInt(e.target.id));
      setCheckboxSelected(found);
    } else {
      setCheckboxSelected([...checkboxSelected, +e.target.id]);
    }
  }

  // for chosen notes
  const handleAnalyzeSubmit = async (e: React.SyntheticEvent) => {
    // call 2 in one: forall checkbox indices: do api calls on indices:
    // for(let i = 0; i< checkboxSelected.length; i++) {
    // }

    let chosen_contents = "";
    let chosen_titles = "";

    const textEncoder = new TextEncoder();

    for (let i = 0; i < checkboxSelected.length; i++) {
      chosen_contents =
        chosen_contents + "_" + props.notes[checkboxSelected[i]].content;
      if (textEncoder.encode(chosen_contents).length >= 200000000) {
        // err msg
        // end upload
        console.log("the file size is too large");
        return;
      }

      chosen_titles =
        chosen_titles + "_" + props.notes[checkboxSelected[i]].title;
    }
    const notes_contents = chosen_contents;
    const notes_titles = chosen_titles;

    await analyzeSubmission(notes_contents, notes_titles);
  };

  const analyzeSubmission = async (notes_contents, notes_titles) => {
    const body = { notes_contents, notes_titles };

    await fetch("/api/chat/analyze", {
      headers: { "Content-Type": "application/json" },
      method: "PUT",
      body: JSON.stringify(body),
    });
  };
  async function handleNavNotes() {
    if (location === "notes") return;
    await Router.push("/notes/landing");
  }

  async function handleNavChat() {
    if (location === "chat") return;
    await Router.push("/chat");
  }

  async function handleNavAnalyzed(title: string) {
    // { pathname: `/notes/[slug]`, query: { slug: data.title } },
    //     undefined,
    //     { shallow: true }
    console.log("what");
    await Router.push(
      {
        pathname: `/chat/` + title,

        query: { slug: title },
      },
      undefined
    );
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
          <CommandGroup className="pb-[50px]">
            {/* Notesbar Component */}

            <CommandItem
              onSelect={handleNavNotes}
              className={
                location === "notes"
                  ? "bg-cyan-200  drop-shadow-[5px_5px_5px_rgb(103,232,249,.5)] hover:drop-shadow-[5px_5px_5px_rgb(103,232,249)]"
                  : "bg-[rgba(168,225,213,.5)] hover:drop-shadow-[5px_5px_5px_rgb(103,232,249)] "
              }
            >
              <span className="text-md text-zinc-600 font-medium ">
                Notes 📓
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
                      ? "bg-cyan-100 drop-shadow-[5px_5px_5px_rgb(103,232,249,.5)] my-[5px]"
                      : "hover:box-shadow-[5px_5px_5px_rgba(103,232,249,.5)] my-[5px]"
                  }
                  id={note.title}
                  onSelect={
                    minusHover == pencilHover
                      ? (e) => loadNotes(props.notes[index].title)
                      : (e) => e
                  }
                >
                  <span
                    className="outline-none text-slate-600"
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
          <CommandGroup className="pb-[50px]">
            {/* Prompt Bar Component  (Chat) */}
            <CommandItem
              onSelect={handleNavChat}
              className={
                location === "chat"
                  ? "bg-cyan-200  drop-shadow-[5px_5px_5px_rgb(103,232,249,.5)] hover:drop-shadow-[5px_5px_5px_rgb(103,232,249)]"
                  : "bg-[rgba(168,225,213,.5)] hover:drop-shadow-[5px_5px_5px_rgb(103,232,249)] "
              }
            >
              <span className="text-md text-zinc-600 font-medium ">
                Chat with Notes 📖
              </span>
              <Dialog modal={true}>
                <DialogTrigger asChild>
                  <FaBoltLightning
                    onClick={handleLightningClick}
                    className="stroke-zinc-600 stroke-[.5px] right-5 position: absolute hover:stroke-zinc-200 hover:fill-yellow-400"
                  />
                </DialogTrigger>
                <DialogContent className="xl:max-w-[600px] xl:max-h-[500px] h-[500px] ">
                  <DialogHeader>
                    <DialogTitle>Analyze Notes</DialogTitle>
                    <DialogDescription className="relative top-[10px]">
                      Here you can choose which notes to use to create a chat
                      channel where the AI deeply understands the uploaded
                      content. You can also upload PDFs to be analyze here as
                      well
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-rows-2 grid-flow-col gap-1 justify-items-center pt-[10px]">
                    <div className=" ">
                      <Label className="text-lg">Choose Notes to Analyze</Label>
                    </div>
                    <div className="relative top-[-120px] ">
                      <ScrollArea className="rounded-md  fixed h-[200px] w-[200px] overflow-y-auto  ">
                        <div>
                          {props.notes.map((note, idx) => (
                            <>
                              <div>
                                <Checkbox
                                  id={idx}
                                  onClick={handleCheckboxClicked}
                                />
                                <Label className="pl-[5px] font-light text-md">
                                  {note.title}
                                </Label>
                              </div>
                            </>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>

                    <div className=" ">
                      <Label className="text-lg ">Upload a PDF</Label>
                    </div>
                    <div className="font-light text-md relative top-[-120px] ">
                      coming soon
                    </div>
                  </div>
                  <DialogFooter className="fixed bottom-10 right-10">
                    {checkboxSelected.length != 0 ? (
                      <DialogClose>
                        <Button type="submit" onClick={handleAnalyzeSubmit}>
                          Analyze
                        </Button>
                      </DialogClose>
                    ) : (
                      <Button disabled type="submit">
                        Analyze
                      </Button>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CommandItem>
            <div>
              {props.analyzed.map((item) => (
                <div>
                  <CommandItem onSelect={(e) => handleNavAnalyzed(item.title)}>
                    {item.title}
                  </CommandItem>
                </div>
              ))}
            </div>
          </CommandGroup>

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
              <span className="text-md text-zinc-600 font-medium ">
                Learn 🏫
              </span>
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
