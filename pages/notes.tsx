import React, { useState, useRef } from "react";
import { GetServerSideProps } from "next";
import { useSession, getSession } from "next-auth/react";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import prisma from "../lib/prisma";
import Router from "next/router";
// shadcn imports
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";
import { Button } from "../components/ui/button";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "../components/ui/command";

import { Textarea } from "../components/ui/textarea";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";

import {
  FontBoldIcon,
  FontItalicIcon,
  UnderlineIcon,
  PaperPlaneIcon,
  Cross1Icon,
  PlusCircledIcon,
  MinusCircledIcon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";

import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group";
import { parse } from "path";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { notes: [] } };
  }

  const notes = await prisma.notes.findMany({
    where: {
      author: { email: session?.user?.email },
    },
  });
  return {
    props: { notes },
  };
};
type Props = {
  notes: PostProps[];
};

const Notes: React.FC<Props> = (props) => {
  const { data: session } = useSession();
  const ref = useRef<HTMLDivElement>(null); // this up here somehow fixes a useref error...
  const [selected, setSelected] = useState<boolean[]>(Array(5).fill(false)); // state of button press
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>();

  const [ids, setIds] = useState<string[]>();

  // todo : split into separate functions for each but not now cuz im lazy
  function handleSelected(num: number) {
    selected[num] = !selected[num];
  }

  // saves notes to db
  const saveNotes = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { title, content };
      await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push("/notes");
    } catch (error) {
      console.error(error);
    }
  };

  // *** attempt this far at updating ***
  const maintainTitle = (e: React.SyntheticEvent) => {
    if (initialEdit) {
      console.log("intial edit");
      setMaintainedTitle(e.target.innerText);
      console.log(e.target.innerText);
      setInitialEdit(false);
    }
  };

  const [initialEdit, setInitialEdit] = useState(true);
  const [maintainedTitle, setMaintainedTitle] = useState("");

  const updateNote = async (e: React.SyntheticEvent, newTitle, newContent) => {
    e.preventDefault();
    try {
      const title = newTitle;
      const content = newContent;
      const oldTitle = maintainedTitle;
      const body = { title, content, oldTitle };

      await fetch("/api/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setInitialEdit(true);
      setTitle(newTitle);
      //await Router.push("/notes");
    } catch (error) {
      console.error(error);
    }
  };
  // *** attempt this far at updating ***

  // look at currently displayed props.note and make new note accordingly
  // works as we refresh on every update, however this is api-call intensive
  //      look into caching or more performant way of updating (on save or something)

  const createNewNote = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    let titles: string[] = [];
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
            if (index == 100) break; // limit notes, remove this **
          }
        }
      }
    }
    try {
      const title = "New Note " + index;
      const content = "New Note";
      const body = { title, content };
      await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push("/notes");
    } catch (error) {
      console.error(error);
    }
  };
  // for new note command item (Hover Text Effect)
  const [hoveredNew, setHoveredNew] = React.useState(false);
  const handleHoverEnter = (e: React.SyntheticEvent) => {
    setHoveredNew(true);
    console.log(hoveredNew);
  };
  const handleHoverLeave = (e: React.SyntheticEvent) => {
    setHoveredNew(false);
    console.log(hoveredNew);
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

  // currently we use search for db which we dont wanna stick with (use more logic)
  const loadNotes = async (e: React.SyntheticEvent, title: string) => {
    e.preventDefault();
    const res = await fetch("/api/load_notes/" + title, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setTitle(data.title);
    setContent(data.content);
    console.log(data);
    await Router.push("/notes");
  };

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

  if (!session) {
    return (
      <Layout>
        <h1>My Drafts</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    );
  }

  // how we want to append to dom
  // append new italics node **
  // print content of all nested tags
  //    potential error if tags are nested...
  const handleClick = (e: React.SyntheticEvent) => {
    // access and append div parent node
    console.log("ree");
    const italicNode = document.createElement("i");
    italicNode.innerText = "here we have italics";
    ref.current!.appendChild(italicNode);

    // prints inner text
    let strs: string[] = [];
    [...ref.current.children].map((x) => strs.push(x.innerText));
    console.log(strs);
  };

  const handleTest = (e: React.SyntheticEvent) => {
    console.log("clickedon", e);
  };
  // command h is hardcoded... (figure out how css works..)
  return (
    <Layout>
      <div className="page ">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            defaultSize={20}
            className="min-h-[900px] min-w-[250px] max-w-[500px] rounded-lg border"
          >
            <ScrollArea className="rounded-md border p-0 h-[900px]">
              <Command className="h-[1000px] rounded-lg border shadow-md overflow-y-auto pr-[5px]">
                <CommandInput placeholder="Find Notes:" />
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
                          onFocus={maintainTitle}
                          onBlur={handleUpdateTitle}
                          contentEditable={true}
                          onClick={(e) =>
                            loadNotes(e, props.notes[index].title)
                          }
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

                    {/* <CommandItem
                      onMouseEnter={handleHoverEnter}
                      onMouseLeave={handleHoverLeave}
                    > 
                      // Fancy, left to implement later if time
                      <span
                        className={
                          "text-xs " +
                          (hoveredNew ? "text-zinc-200" : "text-zinc-400")
                        }
                      >
                        New Note
                      </span>
                    </CommandItem> */}
                  </CommandGroup>
                </CommandList>
              </Command>
            </ScrollArea>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel
                defaultSize={10}
                className="max-h-[200px] min-h-[100px] "
              >
                <ToggleGroup type="multiple">
                  <ToggleGroupItem
                    variant="outline"
                    value="bold"
                    aria-label="Toggle bold"
                    className="[date-state]-1"
                    onClick={() => handleSelected(0)}
                  >
                    <FontBoldIcon className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    variant="outline"
                    value="italic"
                    aria-label="Toggle italic"
                    onClick={() => handleSelected(1)}
                  >
                    <FontItalicIcon className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    variant="outline"
                    value="strikethrough"
                    aria-label="Toggle strikethrough"
                    onClick={() => handleSelected(2)}
                  >
                    <UnderlineIcon className="h-4 w-4" />
                  </ToggleGroupItem>
                  <Button
                    variant="outline"
                    value="paperplane"
                    aria-label="Toggle paperplane"
                    onClick={saveNotes}
                    className=""
                  >
                    <PaperPlaneIcon className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    value="cross"
                    aria-label="toggle cross"
                    onClick={(e) => deleteNotes(e, title)}
                    className="active:bg-zinc-400"
                  >
                    <Cross1Icon className="h-4 w-4" />
                  </Button>
                </ToggleGroup>
              </ResizablePanel>
              <ResizablePanel
                defaultSize={10}
                className="max-h-[60px] min-h-[60px] "
              >
                <Separator />

                <Textarea
                  placeholder="Write a Title to save Note"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  className="max-h-[60px] min-h-[60px] text-2xl resize-none  focus-visible:ring-0 border-0"
                ></Textarea>
              </ResizablePanel>
              <ResizablePanel>
                <div ref={ref} contentEditable={true} onClick={handleClick}>
                  <blockquote
                    className="mt-6 border-l-2 pl-6 italic"
                    onClick={handleTest}
                  >
                    "After all," he said, "everyone enjoys a good joke, so it's
                    only fair that they should pay for the privilege."
                  </blockquote>
                </div>
                <Textarea
                  placeholder="Write your notes here"
                  onChange={(e) => setContent(e.target.value)}
                  value={content}
                  className="min-h-screen resize-none focus-visible:ring-0 "
                ></Textarea>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <style jsx>{`
        .post {
          background: var(--geist-background);
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  );
};

export default Notes;
