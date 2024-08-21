import {
  MinusCircledIcon,
  Pencil1Icon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import { CommandGroup, CommandItem } from "../ui/command";
import { useState } from "react";

export default function NoteSidebar({
  Router,
  location,
  props,
  title,
  setTitle,
  setContent,
}) {
  // state-related
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
  const handleUpdateTitle = (e: React.SyntheticEvent) => {
    if (e.currentTarget.innerHTML) {
      updateNote(e, e.currentTarget.innerHTML, "");
    }
  };

  // tracks currently editted title to ensure update in db
  const [initialEdit, setInitialEdit] = useState(true);
  const [maintainedTitle, setMaintainedTitle] = useState("");

  // ^^^
  async function handleNavNotes() {
    if (location === "notes") return;
    await Router.push("/notes/landing");
  }

  const handlePencilClick = (e: React.SyntheticEvent) => {
    //console.log(e.currentTarget);
    //parentRef.current.focus();
  };

  // Create new Note
  const handlePlusClick = (e: React.SyntheticEvent) => {
    createNewNote(e);
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

  // Load Clicked Note
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

  if (props.query && !initial) {
    // there is a dynamic url, and no edit yet
    if (props.query != "landing") loadNotes(props.query); // want to d-url notes
    setInitial(true);
  }

  // for minus icon
  const handleMinusClick = (e: React.SyntheticEvent) => {
    let removedNote = props.notes[(e.target as HTMLElement).id];
    if (removedNote) {
      deleteNotes(e, removedNote.title);
    }
  };

  // Delete Clicked Note
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

  // Update Edited Note
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
  return (
    <CommandGroup className="pb-[50px]">
      {/* Notesbar Component */}

      <CommandItem
        onSelect={handleNavNotes}
        className={
          location === "notes"
            ? "bg-emerald-300  drop-shadow-[5px_5px_5px_rgb(103,232,249,.5)] hover:drop-shadow-[5px_5px_5px_rgb(31,78,47,.5)] landingCard"
            : "bg-[rgba(168,225,213,.5)]   landingCard"
        }
      >
        <span className="text-md text-zinc-600 font-medium ">Notes 📓</span>
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
                ? "bg-cyan-100 drop-shadow-[5px_5px_5px_rgb(103,232,249,.5)] my-[5px] landingCard"
                : "hover:box-shadow-[5px_5px_5px_rgba(103,232,249,.5)] my-[5px] landingCard"
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
  );
}
