"use client";

import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
// import { Indent } from "./tiptap/indent";
import React from "react";
import { Button as NextButton } from "../ui/button";
import { Separator } from "../ui/separator";
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

import { Textarea } from "../ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
import { ResizablePanel } from "../ui/resizable";

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="control-group">
      <div className="button-group  flex h-10 text-center text-sm justify-center">
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
        <Separator orientation="vertical" />
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
        <Separator orientation="vertical" />
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
        <Separator orientation="vertical" />
        <NextButton
          variant="outline"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive("paragraph") ? "is-active" : ""}
        >
          <PilcrowIcon />
        </NextButton>
        <Separator orientation="vertical" />
        <NextButton
          variant="outline"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
        >
          <FontBoldIcon />
        </NextButton>
        <Separator orientation="vertical" />
        <NextButton
          variant="outline"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
        >
          <FontItalicIcon />
        </NextButton>
        <Separator orientation="vertical" />
        <NextButton
          variant="outline"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}
        >
          <StrikethroughIcon />
        </NextButton>
        <Separator orientation="vertical" />
        <NextButton
          variant="outline"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={editor.isActive("highlight") ? "is-active" : ""}
        >
          <FaHighlighter />
        </NextButton>
        <Separator orientation="vertical" />
        <NextButton
          variant="outline"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={editor.isActive({ textAlign: "left" }) ? "is-active" : ""}
        >
          <TextAlignLeftIcon />
        </NextButton>
        <Separator orientation="vertical" />
        <NextButton
          variant="outline"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={
            editor.isActive({ textAlign: "center" }) ? "is-active" : ""
          }
        >
          <TextAlignCenterIcon />
        </NextButton>
        <Separator orientation="vertical" />
        <NextButton
          variant="outline"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={editor.isActive({ textAlign: "right" }) ? "is-active" : ""}
        >
          <TextAlignRightIcon />
        </NextButton>
        <Separator orientation="vertical" />
        <NextButton
          variant="outline"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={
            editor.isActive({ textAlign: "justify" }) ? "is-active" : ""
          }
        >
          <TextAlignJustifyIcon />
        </NextButton>

        <Separator orientation="vertical" />
        <NextButton
          variant="outline"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
        >
          <FaListOl />
        </NextButton>
        <Separator orientation="vertical" />
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
  setTitle,
  title,
  content,
  setContent,
  deleteNotes,
  saveNotes,
}) => {
  const [initial, setInitial] = useState(true);
  const editor = useEditor({
    extensions: [
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc",
        },
      }),
      ListItem,
      // Indent,
      StarterKit,
      Placeholder.configure({
        placeholder: "Write a Note                                ",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
    ],
    editorProps: {
      attributes: {
        className: "shadow-inner",
      },
    },
    content: ``,
  });

  useEffect(() => {
    setInitial(false);
  }, []);

  // updates on changed prop, 1st and third to maintain previous cursor positionining
  useEffect(() => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    editor?.commands.setContent(content, false);
    editor.commands.setTextSelection({ from, to });
  }, [content]);

  return (
    <>
      <ResizablePanel className="min-h-[50px] max-h-[50px] " defaultSize={1}>
        <div className="position: static flex justify-center top-0px">
          <MenuBar editor={editor} />

          <NextButton
            variant="outline"
            value="paperplane"
            aria-label="Toggle paperplane"
            onClick={saveNotes}
            className=""
          >
            <PaperPlaneIcon className="h-4 w-4" />
          </NextButton>

          <NextButton
            variant="outline"
            value="cross"
            aria-label="toggle cross"
            onClick={(e) => deleteNotes(e, title)}
            className="active:bg-zinc-400"
          >
            <Cross1Icon className="h-4 w-4" />
          </NextButton>
        </div>
      </ResizablePanel>

      <ResizablePanel className="bg-white ">
        <Separator />

        <ScrollArea>
          <Textarea
            placeholder="Write a Title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="max-h-[60px] min-h-[60px] text-2xl resize-none  focus-visible:ring-0 border-0 z-0 bg-white"
          />

          <Separator />

          <EditorContent
            editor={editor}
            onChange={setContent(editor?.getHTML())}
            value={content}
            className="focus-visible:ring-0 border-0 bg-white h-[600px] "
          />
        </ScrollArea>
      </ResizablePanel>
    </>
  );
};

export default Tiptap;
