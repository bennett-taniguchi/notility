// for holding the majority of /notes data (state and what not)

import Router from "next/router";
import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import Tiptap from "./notes/tiptap/Tiptap";
import Sidebar from "./sidebar/Sidebar";
import Layout from "./Layout";
import { useToast } from "../hooks/use-toast";
 

export default function Note(props) {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const {toast} = useToast();
  
  // saves notes to db
  const saveNotes = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { title, content };
      console.log(content)
      if(!title || content == '<p></p>') {
        toast({
          variant: "destructive",
          title: "Please fix these errors before saving",
          description: 'Please add a title and content to this note',
        });
        return;
      }

      if(title.toLowerCase() == 'landing') {
        toast({
          variant: "destructive",
          title: "Please fix these errors before saving",
          description: 'Please rename title',
        });
        return;
      }
      if(title.length >= 200) {
        toast({
          variant: "destructive",
          title: "Please fix these errors before saving",
          description: 'Please shorten title length',
        });
        return;
      }

      await fetch("/api/notes/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push("/notes/" + title);
    } catch (error) {
      console.error(error);
    }
  };

  // get latest note function (on initial)

  const deleteNotes = async (e: React.SyntheticEvent, title: string) => {
    e.preventDefault();
    const res = await fetch("/api/notes/delete/" + title, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setTitle("");
    setContent("");
    await Router.push("/notes/landing", undefined, { shallow: true });
  };

  return (
    <div className="page">
      <ResizablePanelGroup direction="horizontal" className="fixed">
        <ResizablePanel
          minSize={20}
          maxSize={20}
          defaultSize={20}
          className="rounded-lg border"
        >
          <Sidebar
            title={title}
            setTitle={setTitle}
            setContent={setContent}
            props={props.props} // as we are given props.props
            location="notes"
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <ResizablePanelGroup direction="vertical">
            <Tiptap
            
              editorVisible={false}
              setEditorVisible={null}
            />
           
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

 