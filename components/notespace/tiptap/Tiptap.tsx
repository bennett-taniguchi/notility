"use client";

import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
// import { Indent } from "./tiptap/indent";
import React, { useContext } from "react";
import { Button as NextButton } from "../../ui/button";
import { LuBookUp } from "react-icons/lu";
import { FaHashtag } from "react-icons/fa6";
//  import SVG1 from '../../../public/svg/svg-1.svg'
import {
  FontBoldIcon,
  FontItalicIcon,
  StrikethroughIcon,
  PilcrowIcon,
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
import { CardTitle } from "../../ui/card";
import { SlugContext, TiptapContext } from "../../context/context";
import { useRouter } from "next/router";
import { IoReturnUpBack } from "react-icons/io5";
import BubbledInput from "../../ui/personal/BubbledInput";
const MenuBar = ({ editor, editorVisible, setEditorVisible }) => {
  if (!editor) {
    return null;
  }

  let buttonStyle = "mr-1 bg-sky-100/50 border-none hover:bg-sky-400 ";
  let svgStyle = "stroke-zinc-700  scale-150";
  let textSvgStyle = "text-zinc-700 scale-150";
  return (
    <div className="control-group   overflow-hidden  py-[22px] ">
    
      <div className="   flex  text-center text-sm justify-center justify-items-center      ">
     
        <NextButton
          variant="outline"
          onClick={() => setEditorVisible(!editorVisible)}
          className={'animated-button mr-[4px] border-cyan-600/40  '}
        >
          <IoReturnUpBack className={svgStyle} />
        </NextButton>


      
        <NextButton
          variant="outline"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={cn(
            editor.isActive("heading", { level: 1 }) ? "is-active" : "",
            buttonStyle
          )}
        >
          <LuHeading1 className={svgStyle} />
        </NextButton>

        <NextButton
          variant="outline"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={cn(
            editor.isActive("heading", { level: 2 }) ? "is-active" : "",
            buttonStyle
          )}
        >
          <LuHeading2 className={svgStyle} />
        </NextButton>

        <NextButton
          variant="outline"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={cn(
            editor.isActive("heading", { level: 3 }) ? "is-active" : "",
            buttonStyle
          )}
        >
          <LuHeading3 className={svgStyle} />
        </NextButton>

        <NextButton
          variant="outline"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={cn(
            editor.isActive("paragraph") ? "is-active" : "",
            buttonStyle
          )}
        >
          <PilcrowIcon className={textSvgStyle} />
        </NextButton>

        <NextButton
          variant="outline"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            editor.isActive("bold") ? "is-active" : "",
            buttonStyle
          )}
        >
          <FontBoldIcon className={textSvgStyle} />
        </NextButton>

        <NextButton
          variant="outline"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            editor.isActive("italic") ? "is-active" : "",
            buttonStyle
          )}
        >
          <FontItalicIcon className={textSvgStyle} />
        </NextButton>

        <NextButton
          variant="outline"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={cn(
            editor.isActive("strike") ? "is-active" : "",
            buttonStyle
          )}
        >
          <StrikethroughIcon className={textSvgStyle} />
        </NextButton>

        <NextButton
          variant="outline"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={cn(
            editor.isActive("highlight") ? "is-active" : "",
            buttonStyle
          )}
        >
          <FaHighlighter className={textSvgStyle} />
        </NextButton>

        <NextButton
          variant="outline"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={cn(
            editor.isActive({ textAlign: "left" }) ? "is-active" : "",
            buttonStyle
          )}
        >
          <TextAlignLeftIcon className={textSvgStyle} />
        </NextButton>

        <NextButton
          variant="outline"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={cn(
            editor.isActive({ textAlign: "center" }) ? "is-active" : "",
            buttonStyle
          )}
        >
          <TextAlignCenterIcon className={textSvgStyle} />
        </NextButton>

        <NextButton
          variant="outline"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={cn(
            editor.isActive({ textAlign: "right" }) ? "is-active" : "",
            buttonStyle
          )}
        >
          <TextAlignRightIcon className={textSvgStyle} />
        </NextButton>

        <NextButton
          variant="outline"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={cn(
            editor.isActive({ textAlign: "justify" }) ? "is-active" : "",
            buttonStyle
          )}
        >
          <TextAlignJustifyIcon className={textSvgStyle} />
        </NextButton>

        <NextButton
          variant="outline"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            editor.isActive("orderedList") ? "is-active" : "",
            buttonStyle
          )}
        >
          <FaListOl className={textSvgStyle} />
        </NextButton>

        <NextButton
          variant="outline"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            editor.isActive("bulletList") ? "is-active" : "",
            buttonStyle
          )}
        >
          <FaListUl className={textSvgStyle} />
        </NextButton>
      </div>
    </div>
  );
};

const Tiptap = ({
  setEditorVisible,
  editorVisible,
  givenTitle,
  givenContent,
}) => {
  const [tags,setTags] = useState([])
  const [initial, setInitial] = useState(true);
  const {title,setTitle,content,setContent} = useContext(TiptapContext)
  const { slug } = useContext(SlugContext);
  const Router = useRouter();
  const editor = useEditor({
    immediatelyRender: false,
    content: givenContent,
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
              if (event.key === " ") {
                editor.commands.insertContentAt(
                  editor.state.selection.anchor,
                  "\u00A0"
                );
              }
            }
            if (editor) {
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
    if(setContent)
    (setContent as any)(editor?.getHTML()!);
  }, [editor?.getHTML()]);

  async function saveNotes(uri, router,setContent,setTitle) {
    const body = { title, content, uri };

    await fetch("/api/notes/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setTitle('')
    setContent('')
    Router.push("/notespace/" + uri);
  }
  // updates on changed prop, 1st and third to maintain previous cursor positionining
  useEffect(() => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    editor?.commands.setContent(content, true);
    editor.commands.setTextSelection({ from, to });
    console.log(content,'set editor',editor.getText())
  }, [content]);

  useEffect(() => {
    if (!givenTitle) {
      if(setTitle)
      (setTitle as any)("");
    }

    if (!givenContent) {
      if(setContent) {
        (setContent as any)("");
       
      }
      editor?.commands.setContent('', true);
     
    } else {
      editor?.commands.setContent(givenContent, true);
    }

 
  
  }, []);

  useEffect(()=>{
console.log(title,'changed')
  },[title]);

 
  return (
    <>
      <div className="   chat-background rounded-t-xl">
        <MenuBar
          editor={editor}
          editorVisible={editorVisible}
          setEditorVisible={setEditorVisible}
        />
        <div className="position: static flex justify-center top-0px"></div>
      </div>

      <div style={{ backgroundSize: "100svw 100svh", overflow: "hidden" }}>
        <div className="flex flex-row">
        <Textarea
        maxLength={60}
        onChange={(e) => {if(setTitle)(setTitle as any)(e.target.value)}}
        value={title}
        placeholder="Write a Title"
        className=" w-[50svw] text-zinc-700 border-b-2 border-x-0 border-t-2 border-cyan-400/50 bg-transparent z-auto  pl-5 rounded-none shadow-inner   max-h-[60px] min-h-[60px] text-2xl resize-none  focus-visible:ring-0   "
      />
     
      
      
      {/* <Textarea
        
      onChange={(e) => setTitle(e.target.value)}
      value={title}
      placeholder="Write a Title"
      className=" w-[30svw] text-zinc-700 border-b-2 border-x-0 border-t-2 border-cyan-400/50 bg-transparent z-auto  pl-5 rounded-none shadow-inner   max-h-[60px] min-h-[60px] text-2xl resize-none  focus-visible:ring-0   "
    /> */}
       
        </div>
       

        <ScrollArea viewportRef={null}>
        <NextButton
            onClick={() => {'openTags()'}} //Needs to open tag list for current document as # is converted to tag bubble
            className="animated-button z-auto absolute   rounded-3xl bg-white w-[4svw] h-[6svh] flex flex-col marker:hover:bg-sky-800 stroke-black text-black hover:bg-zinc-400 right-[7rem] bottom-1"
          >
            
            <div className=""> Tags</div>
            <FaHashtag className="w-5 h-5 " />
            
          </NextButton>
           
          <NextButton
            onClick={() => saveNotes(slug, Router,setContent,setTitle)}
            className="animated-button z-auto absolute   rounded-3xl bg-white w-[4svw] h-[6svh] flex flex-col marker:hover:bg-sky-800 stroke-black text-black hover:bg-zinc-400 right-10 bottom-1"
          >
            <div className="">Save</div>
            <LuBookUp className="w-5 h-5 " />
          </NextButton>
           
          <EditorContent
            editor={editor}
            onChange={() => (setContent as any)(editor?.getHTML()!)}
            value={content}
            content={content}
            className=" text-zinc-700 pl-5    focus-visible:ring-0 border-0  h-[70svh]  bg-transparent "
          />
        </ScrollArea>
      </div>
    </>
  );
};

export default Tiptap;
