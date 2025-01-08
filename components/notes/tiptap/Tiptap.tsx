"use client";

import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
// import { Indent } from "./tiptap/indent";
import React from "react";
import { Button as NextButton } from "../../ui/button";
import { Separator } from "../../ui/separator";
import {
  FontBoldIcon,
  FontItalicIcon,
  StrikethroughIcon,
  PilcrowIcon,
  PaperPlaneIcon,
  Cross1Icon,
} from "@radix-ui/react-icons";
import {
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  TextAlignJustifyIcon,
} from "@radix-ui/react-icons";
import { LuHeading1, LuHeading2, LuHeading3 } from "react-icons/lu";
import { FaHighlighter, FaListOl, FaListUl } from "react-icons/fa6";
import { useState, useEffect } from "react";

import { Textarea } from "../../ui/textarea";
import { ScrollArea } from "../../ui/scroll-area";
import { ResizablePanel } from "../../ui/resizable";
import { cn } from "../../lib/utils";


const MenuBar = ({ editor,editorVisible,setEditorVisible }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="control-group   ">
      <div className="button-group  flex  text-center text-sm justify-center justify-items-center  py-[.5svh]">
    
        <NextButton
          variant="outline"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "is-active" : ""
          }
        >
          <LuHeading1 />
        </NextButton>

        <NextButton
          variant="outline"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? "is-active" : ""
          }
        >
          <LuHeading2 />
        </NextButton>

        <NextButton
          variant="outline"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 }) ? "is-active" : ""
          }
        >
          <LuHeading3 />
        </NextButton>

        <NextButton
          variant="outline"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive("paragraph") ? "is-active" : ""}
        >
          <PilcrowIcon />
        </NextButton>

        <NextButton
          variant="outline"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
        >
          <FontBoldIcon />
        </NextButton>

        <NextButton
          variant="outline"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
        >
          <FontItalicIcon />
        </NextButton>

        <NextButton
          variant="outline"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}
        >
          <StrikethroughIcon />
        </NextButton>

        <NextButton
          variant="outline"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={editor.isActive("highlight") ? "is-active" : ""}
        >
          <FaHighlighter />
        </NextButton>

        <NextButton
          variant="outline"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={editor.isActive({ textAlign: "left" }) ? "is-active" : ""}
        >
          <TextAlignLeftIcon />
        </NextButton>

        <NextButton
          variant="outline"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={
            editor.isActive({ textAlign: "center" }) ? "is-active" : ""
          }
        >
          <TextAlignCenterIcon />
        </NextButton>

        <NextButton
          variant="outline"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={editor.isActive({ textAlign: "right" }) ? "is-active" : ""}
        >
          <TextAlignRightIcon />
        </NextButton>

        <NextButton
          variant="outline"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={
            editor.isActive({ textAlign: "justify" }) ? "is-active" : ""
          }
        >
          <TextAlignJustifyIcon />
        </NextButton>

        <NextButton
          variant="outline"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
        >
          <FaListOl />
        </NextButton>

        <NextButton
          variant="outline"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
        >
          <FaListUl />
        </NextButton>
      </div>
    </div>
  );
};

const Tiptap = ({
 setEditorVisible, editorVisible
}) => {
  const [initial, setInitial] = useState(true);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc",
        },
      }),
      ListItem,
      StarterKit,
      Placeholder.configure({
        placeholder: "Write a Note                                ",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
    ],

    content: ``,
  });

  useEffect(() => {
    setInitial(false);
    editor?.setOptions({
      editorProps: {
        attributes: {
          class: cn("prose max-w-none [&_ol]:list-decimal [&_ul]:list-disc"),
        },
        handleDOMEvents: {
          keydown: (view, event) => {
            if (editor) {
              console.log(event.key);
              if (event.key === " ") {
                editor.commands.insertContentAt(
                  editor.state.selection.anchor,
                  "\u00A0"
                );
              }
            }
            if (editor) {
              console.log(event.key);
              if (event.key === "Tab") {
                event.preventDefault();
                editor.commands.insertContentAt(
                  editor.state.selection.anchor,
                  "\u00A0\u00A0\u00A0"
                );
              }
            }
            return false;
          },
        },
      },
    });
  }, [editor]);

  // updates on changed prop, 1st and third to maintain previous cursor positionining
  // useEffect(() => {
  //   if (!editor) return;
  //   const { from, to } = editor.state.selection;
  //   editor?.commands.setContent(content, false);
  //   editor.commands.setTextSelection({ from, to });
  // }, [content]);

  return (
    <>
      <ResizablePanel className="    h-[10svh] chat-background" defaultSize={1} >
      <MenuBar editor={editor} editorVisible={editorVisible} setEditorVisible={setEditorVisible}/>
        <div className="position: static flex justify-center top-0px">
        

          {/* <HoverCard openDelay={0} closeDelay={0}>
            <HoverCardTrigger>
              <NextButton
                variant="outline"
                value="paperplane"
                aria-label="Toggle paperplane"
                
                className="absolute top-[6.7svh] right-[2svw] z-10 bg-emerald-200"
              >
                <PaperPlaneIcon className="h-4 w-4" />
              </NextButton>
            </HoverCardTrigger>
            <HoverCardContent className="w-[7svw] h-[5] left-[12.5svw] top-[9svh] absolute">Save Page</HoverCardContent>
          </HoverCard> */}


          {/* <HoverCard  openDelay={0} closeDelay={0}>
            <HoverCardTrigger>
            <NextButton
            variant="outline"
            value="cross"
            aria-label="toggle cross"
            
            className="absolute top-[6.7svh] right-[6svw] z-10 bg-rose-200"
          >
            <Cross1Icon className="h-4 w-4" />
          </NextButton>
            </HoverCardTrigger>
            <HoverCardContent className="w-[7svw] h-[5] left-[9.5svw] top-[9svh] absolute">Delete Page</HoverCardContent>
          </HoverCard> */}


       
        </div>
      </ResizablePanel>

      <ResizablePanel className="bg-white ">
        <Separator />

        <ScrollArea viewportRef={null}>
          <Textarea
            placeholder="Write a Title"
           
            className="max-h-[60px] min-h-[60px] text-2xl resize-none  focus-visible:ring-0 border-0 z-0 bg-white"
          />

          <Separator />

          <EditorContent
            editor={editor}
            
            className="focus-visible:ring-0 border-0 bg-white h-[85svh] mx-3"
          />
        </ScrollArea>
      </ResizablePanel>
    </>
  );
};

export default Tiptap;
