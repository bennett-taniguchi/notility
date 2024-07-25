import React, { useState, useRef, useEffect } from "react";
import { GetServerSideProps } from "next";
import { useSession, getSession } from "next-auth/react";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import prisma from "../lib/prisma";
import Router from "next/router";

// shadcn and icon imports
import { Separator } from "../components/ui/separator";
import {
  FaFolder,
  FaFolderOpen,
  FaFolderPlus,
  FaFolderMinus,
} from "react-icons/fa";

import { Textarea } from "../components/ui/textarea";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";

// refactored components:
import Sidebar from "../components/notes/Sidebar";
import Hoverbar from "../components/notes/HoverBar";

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

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>();

  const [selected, setSelected] = useState<string>(); // more hook errors, if not up here
  const [showTooltip, setShowTooltip] = useState(false); // ^^^
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);

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
    if (newTitle === title) {
      return;
    }
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
            if (index == 10) break; // limit notes, remove this **
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
    // print selected
    // if (window) {
    //   console.log(window?.getSelection()?.toString());
    //   console.log(window);
    // }
    // access and append div parent node
    // const italicNode = document.createElement("i");
    // italicNode.innerText = "here we have italics";
    // ref.current!.appendChild(italicNode);
    // prints all inner text
    // let strs: string[] = [];
    // [...ref.current.children].map((x) => strs.push(x.innerText));
    // console.log(strs);
  };

  // perfectly does highlight and show tooltip
  // need to position tooltip relative to client cursor

  const handleTest = (e: React.SyntheticEvent) => {
    if (!window) return;
    console.log(e.clientX, e.clientY);
    setMouseX(e.clientX);
    setMouseY(e.clientY);

    let selectedString = window?.getSelection()?.toString();
    setSelected(selectedString);

    if (selectedString == selected) {
      // last selection is current, was clicked again
      setShowTooltip(false);
    } else if (selectedString != "") {
      // first not null selection, open tooltip
      setShowTooltip(true);
    } else {
      // clearly empty selection, close tooltip
      setShowTooltip(false);
    }
  };

  return (
    <Layout>
      <div className="page ">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            defaultSize={20}
            className="min-h-[900px] min-w-[250px] max-w-[500px] rounded-lg border"
          >
            <Sidebar
              setTitle={setTitle}
              setContent={setContent}
              createNewNote={createNewNote}
              updateNote={updateNote}
              maintainTitle={maintainTitle}
              loadNotes={loadNotes}
              props={props}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel
                defaultSize={10}
                className="max-h-[200px] min-h-[100px] "
              >
                <Hoverbar saveNotes={saveNotes} deleteNotes={deleteNotes} />
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
                  {/* <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger
                        className={
                          "" + (!showTooltip ? "invisible" : "visible")
                        }
                      ></TooltipTrigger>
                      <TooltipContent
                        align="start"
                        forceMount={true}
                        alignOffset={mouseX}
                        sideOffset={mouseY - 10}
                        hideWhenDetached
                        className={
                          "" +
                          (!showTooltip
                            ? "invisible"
                            : "absolute visible top: [" +
                              mouseY +
                              "px] left: [" +
                              mouseX +
                              "px]")
                        }
                      >
                        <p>Add to library</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider> */}

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
    </Layout>
  );
};

export default Notes;
