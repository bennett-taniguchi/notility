"use client";

import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import React from "react";
import { Button as NextButton } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  FontBoldIcon,
  FontItalicIcon,
  StrikethroughIcon,
  PilcrowIcon,
  AlignLeftIcon,
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
import { FaHighlighter } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { Textarea } from "../ui/textarea";

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
      StarterKit,
      Placeholder.configure({ placeholder: "Write a Note" }),
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

  // const [initialSet, setInitialSet] = useState(false);

  // if (!initialSet) {
  //   editor?.commands.setContent(storedData);
  //   setInitialSet(true);
  // }
  useEffect(() => {
    console.log(title, content);
  }, [content]);

  useEffect(() => {
    setInitial(false);
  }, []);

  useEffect(() => {
    editor?.commands.setContent(content);
  }, [content]);

  return (
    <>
      <MenuBar editor={editor} />
      <div className="flex justify-center">
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

      <Separator />
      <Textarea
        placeholder="Write a Title"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className="max-h-[60px] min-h-[60px] text-2xl resize-none  focus-visible:ring-0 border-0 z-0 bg-white"
      ></Textarea>
      <Separator />
      <EditorContent
        editor={editor}
        onChange={setContent(editor?.getHTML())}
        value={content}
        className="focus-visible:ring-0 border-0 bg-white h-[900px]"
      />
    </>
  );
};

export default Tiptap;

// `
//       <h3 style="text-align:center">
//         Devs Just Want to Have Fun by Cyndi Lauper
//       </h3>
//       <p style="text-align:center">
//         I come home in the morning light<br>
//         My mother says, <mark>“When you gonna live your life right?”</mark><br>
//         Oh mother dear we’re not the fortunate ones<br>
//         And devs, they wanna have fun<br>
//         Oh devs just want to have fun</p>
//       <p style="text-align:center">
//         The phone rings in the middle of the night<br>
//         My father yells, "What you gonna do with your life?"<br>
//         Oh daddy dear, you know you’re still number one<br>
//         But <s>girls</s>devs, they wanna have fun<br>
//         Oh devs just want to have
//       </p>
//       <p style="text-align:center">
//         That’s all they really want<br>
//         Some fun<br>
//         When the working day is done<br>
//         Oh devs, they wanna have fun<br>
//         Oh devs just wanna have fun<br>
//         (devs, they wanna, wanna have fun, devs wanna have)
//       </p>
//     `
