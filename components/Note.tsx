// for holding the majority of /notes data (state and what not)

import Router from "next/router";
import { Suspense, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import Tiptap from "./notes/tiptap/Tiptap";
import Sidebar from "./Sidebar";
import Layout from "./Layout";
import Loading from "./loading";

export default function Note(props) {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  //const [chatSelected, setChatSelected] = useState(false);

  // saves notes to db
  const saveNotes = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
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
  const loadNotes = async (e: React.SyntheticEvent, title: string) => {
    console.log("loading");
    const res = await fetch("/api/notes/load/" + title, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();

    setTitle(data.title);
    setContent(data.content);

    await Router.push("/notes");
    return false;
  };

  const deleteNotes = async (e: React.SyntheticEvent, title: string) => {
    e.preventDefault();
    const res = await fetch("/api/notes/delete/" + title, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setTitle("");
    setContent("");
    await Router.push("/notes");
  };

  return (
    <div className="page">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel minSize={20} maxSize={20} defaultSize={20}>
          <Sidebar
            title={title} // state of currently loaded title in notes
            setTitle={setTitle} // usestate for currently loaded title
            setContent={setContent} //  set body of current text
            createNewNote={createNewNote} // create new note
            updateNote={updateNote} // think its just for title update
            maintainTitle={maintainTitle} // necessary
            loadNotes={loadNotes} // onclick
            props={props.props} //...
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <ResizablePanelGroup direction="vertical">
            <Tiptap
              setTitle={setTitle}
              title={title}
              setContent={setContent}
              content={content}
              saveNotes={saveNotes}
              deleteNotes={deleteNotes}
            />
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
