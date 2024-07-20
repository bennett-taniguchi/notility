import React, { useState } from "react";
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
} from "@radix-ui/react-icons";

import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group";
import { resolve } from "path/win32";

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
// const drafts = await prisma.post.findMany({
//   where: {
//     author: { email: session?.user?.email },
//     published: false,
//   },
//   include: {
//     author: {
//       select: { name: true },
//     },
//   },
// });
// return {
//   props: { drafts },
// };

type Props = {
  notes: PostProps[];
};

const Notes: React.FC<Props> = (props) => {
  const { data: session } = useSession();

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

  return (
    <Layout>
      <div className="page ">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            defaultSize={20}
            className="min-h-screen min-w-[250px] rounded-lg border"
          >
            <ScrollArea className="rounded-md border">
              <Command className="h-100 rounded-lg border shadow-md overflow-hidden">
                <CommandInput placeholder="Type a command or search..." />
                <CommandList className="overflow-hidden ">
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Recent Notes">
                    {props.notes.map((note, index) => (
                      <CommandItem>
                        <span
                          onClick={(e) =>
                            loadNotes(e, props.notes[index].title)
                          }
                        >
                          {note.title}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup heading="Suggestions">
                    <CommandItem>
                      <span>Calendar</span>
                    </CommandItem>
                    <CommandItem>
                      <span>Search Emoji</span>
                    </CommandItem>
                    <CommandItem>
                      <span>Launch</span>
                    </CommandItem>
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup heading="Settings">
                    <CommandItem>
                      <span>Profile</span>
                      <CommandShortcut>⌘P</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                      <span>Mail</span>
                      <CommandShortcut>⌘B</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                      <span>Settings</span>
                      <CommandShortcut>⌘S</CommandShortcut>
                    </CommandItem>
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
                className="max-h-[200px] min-h-[100px]  border-0"
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
                className="max-h-[75px] min-h-[75px] border-0"
              >
                <Textarea
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  className="max-h-[75px] min-h-[75px] text-2xl resize-none  focus-visible:ring-0"
                ></Textarea>
              </ResizablePanel>
              <ResizablePanel>
                <Textarea
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
