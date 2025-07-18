"use client";

import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import React, { useContext } from "react";
import { Button as NextButton } from "../../ui/button";
import { BookUp } from "lucide-react";

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
import { 
  Heading1, 
  Heading2, 
  Heading3, 
  Highlighter, 
  ListOrdered, 
  List,
  ArrowBigLeft,
  Save,
  MoreHorizontal
} from "lucide-react";
import { useState, useEffect } from "react";

import { Textarea } from "../../ui/textarea";
import { ScrollArea } from "../../ui/scroll-area";
import { cn } from "../../lib/utils";
import { CollapseContext, SlugContext, TiptapContext } from "../../context/context";
import { useRouter } from "next/router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../../ui/dropdown-menu";

const ToolbarButton = ({ 
  onClick, 
  isActive = false, 
  children, 
  className = "",
  ...props 
}) => (
  <NextButton
    variant="outline"
    size="sm"
    onClick={onClick}
    className={cn(
      "h-8 w-8 p-0 border-none bg-sky-100/50 hover:bg-sky-400 transition-colors",
      isActive && "bg-sky-500 text-white",
      className
    )}
    {...props}
  >
    {children}
  </NextButton>
);

const MenuBar = ({ editor, editorVisible, setEditorVisible }) => {
  if (!editor) {
    return null;
  }

  const iconStyle = "h-4 w-4 stroke-zinc-700";

  // Group buttons for mobile dropdown
  const formatButtons = [
    {
      icon: <FontBoldIcon className={iconStyle} />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
      label: "Bold"
    },
    {
      icon: <FontItalicIcon className={iconStyle} />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
      label: "Italic"
    },
    {
      icon: <StrikethroughIcon className={iconStyle} />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive("strike"),
      label: "Strikethrough"
    },
    {
      icon: <Highlighter className={iconStyle} />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      isActive: editor.isActive("highlight"),
      label: "Highlight"
    }
  ];

  const headingButtons = [
    {
      icon: <Heading1 className={iconStyle} />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive("heading", { level: 1 }),
      label: "Heading 1"
    },
    {
      icon: <Heading2 className={iconStyle} />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive("heading", { level: 2 }),
      label: "Heading 2"
    },
    {
      icon: <Heading3 className={iconStyle} />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive("heading", { level: 3 }),
      label: "Heading 3"
    },
    {
      icon: <PilcrowIcon className={iconStyle} />,
      onClick: () => editor.chain().focus().setParagraph().run(),
      isActive: editor.isActive("paragraph"),
      label: "Paragraph"
    }
  ];

  const alignButtons = [
    {
      icon: <TextAlignLeftIcon className={iconStyle} />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      isActive: editor.isActive({ textAlign: "left" }),
      label: "Align Left"
    },
    {
      icon: <TextAlignCenterIcon className={iconStyle} />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      isActive: editor.isActive({ textAlign: "center" }),
      label: "Align Center"
    },
    {
      icon: <TextAlignRightIcon className={iconStyle} />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      isActive: editor.isActive({ textAlign: "right" }),
      label: "Align Right"
    },
    {
      icon: <TextAlignJustifyIcon className={iconStyle} />,
      onClick: () => editor.chain().focus().setTextAlign("justify").run(),
      isActive: editor.isActive({ textAlign: "justify" }),
      label: "Justify"
    }
  ];

  const listButtons = [
    {
      icon: <ListOrdered className={iconStyle} />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
      label: "Ordered List"
    },
    {
      icon: <List className={iconStyle} />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
      label: "Bullet List"
    }
  ];

  return (
    <div className="bg-white border-b border-gray-200 p-2">
      <div className="flex items-center justify-between">
        {/* Back button - always visible */}
        <ToolbarButton
          onClick={() => setEditorVisible(!editorVisible)}
          className="border-2 border-cyan-600/40 bg-white hover:bg-cyan-50"
        >
          <ArrowBigLeft className={iconStyle} />
        </ToolbarButton>

        {/* Desktop toolbar - hidden on mobile */}
        <div className="hidden lg:flex items-center gap-1">
          {/* Headings */}
          <div className="flex gap-1 mr-2">
            {headingButtons.map((button, index) => (
              <ToolbarButton
                key={index}
                onClick={button.onClick}
                isActive={button.isActive}
              >
                {button.icon}
              </ToolbarButton>
            ))}
          </div>

          {/* Formatting */}
          <div className="flex gap-1 mr-2">
            {formatButtons.map((button, index) => (
              <ToolbarButton
                key={index}
                onClick={button.onClick}
                isActive={button.isActive}
              >
                {button.icon}
              </ToolbarButton>
            ))}
          </div>

          {/* Alignment */}
          <div className="flex gap-1 mr-2">
            {alignButtons.map((button, index) => (
              <ToolbarButton
                key={index}
                onClick={button.onClick}
                isActive={button.isActive}
              >
                {button.icon}
              </ToolbarButton>
            ))}
          </div>

          {/* Lists */}
          <div className="flex gap-1">
            {listButtons.map((button, index) => (
              <ToolbarButton
                key={index}
                onClick={button.onClick}
                isActive={button.isActive}
              >
                {button.icon}
              </ToolbarButton>
            ))}
          </div>
        </div>

        {/* Mobile toolbar - compact buttons */}
        <div className="flex lg:hidden items-center gap-1">
          {/* Most common formatting buttons */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
          >
            <FontBoldIcon className={iconStyle} />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
          >
            <FontItalicIcon className={iconStyle} />
          </ToolbarButton>

          {/* More options dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {/* <ToolbarButton>
                <MoreHorizontal className={iconStyle} />
              </ToolbarButton> */}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="p-2">
                <div className="font-medium text-sm mb-2">Headings</div>
                <div className="grid grid-cols-2 gap-1 mb-3">
                  {headingButtons.map((button, index) => (
                    <DropdownMenuItem key={index} asChild>
                      <button
                        onClick={button.onClick}
                        className={cn(
                          "flex items-center justify-center p-2 rounded border",
                          button.isActive && "bg-sky-500 text-white"
                        )}
                      >
                        {button.icon}
                      </button>
                    </DropdownMenuItem>
                  ))}
                </div>
              </div>
              
              <DropdownMenuSeparator />
              
              <div className="p-2">
                <div className="font-medium text-sm mb-2">Format</div>
                <div className="grid grid-cols-2 gap-1 mb-3">
                  {formatButtons.slice(2).map((button, index) => (
                    <DropdownMenuItem key={index} asChild>
                      <button
                        onClick={button.onClick}
                        className={cn(
                          "flex items-center justify-center p-2 rounded border",
                          button.isActive && "bg-sky-500 text-white"
                        )}
                      >
                        {button.icon}
                      </button>
                    </DropdownMenuItem>
                  ))}
                </div>
              </div>

              <DropdownMenuSeparator />

              <div className="p-2">
                <div className="font-medium text-sm mb-2">Lists & Alignment</div>
                <div className="grid grid-cols-3 gap-1">
                  {[...listButtons, ...alignButtons].map((button, index) => (
                    <DropdownMenuItem key={index} asChild>
                      <button
                        onClick={button.onClick}
                        className={cn(
                          "flex items-center justify-center p-2 rounded border",
                          button.isActive && "bg-sky-500 text-white"
                        )}
                      >
                        {button.icon}
                      </button>
                    </DropdownMenuItem>
                  ))}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
  const { collapse } = useContext(CollapseContext);
  const [tags, setTags] = useState([]);
  const [initial, setInitial] = useState(true);
  const { title, setTitle, content, setContent } = useContext(TiptapContext);
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
        placeholder: "Write a Note...",
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
          class: cn(
            "prose max-w-none [&_ol]:list-decimal [&_ul]:list-disc",
            "focus:outline-none"
          ),
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
    if (setContent) (setContent as any)(editor?.getHTML()!);
  }, [editor?.getHTML()]);

  async function saveNotes(uri, router, setContent, setTitle) {
    const body = { title, content, uri };

    await fetch("/api/notes/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setTitle("");
    setContent("");
    Router.push("/notespace/" + uri);
  }

  useEffect(() => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    editor?.commands.setContent(content, true);
    editor.commands.setTextSelection({ from, to });
  }, [content]);

  useEffect(() => {
    if (!givenTitle) {
      if (setTitle) (setTitle as any)("");
    }

    if (!givenContent) {
      if (setContent) {
        (setContent as any)("");
      }
      editor?.commands.setContent("", true);
    } else {
      editor?.commands.setContent(givenContent, true);
    }
  }, []);

  return (
    <div className="flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden max-w-full h-90">
      {/* Toolbar */}
      <div className="overflow-hidden">
        <MenuBar
          editor={editor}
          editorVisible={editorVisible}
          setEditorVisible={setEditorVisible}
        />
      </div>

      {/* Title input */}
      <div className="border-b border-gray-200 overflow-hidden">
        <Textarea
          maxLength={60}
          onChange={(e) => {
            if (setTitle) (setTitle as any)(e.target.value);
          }}
          value={title}
          placeholder="Write a Title"
          className="
            w-full text-2xl font-bold text-zinc-700 
            border-0 bg-transparent resize-none
            focus-visible:ring-0 focus-visible:ring-offset-0
            placeholder:text-gray-400
            px-4 py-3
            min-h-[60px] max-h-[60px]
            overflow-hidden
          "
        />
      </div>

      {/* Editor content with fixed height and strict overflow control */}
      <div className="relative overflow-hidden flex-1 ">
        <ScrollArea viewportRef={null} className="h-[calc(100vh-230px)] min-h-[400px] max-h-[75vh] w-full">
          <div className="overflow-hidden w-full">
            <EditorContent
              editor={editor}
              onChange={() => (setContent as any)(editor?.getHTML()!)}
              value={content}
              content={content}
              className="text-zinc-700 p-4 overflow-hidden w-full max-w-full [&>*]:max-w-full [&_*]:max-w-full"
            />
          </div>
        </ScrollArea>

        {/* Save button positioned within the editor area */}
        <NextButton
          onClick={() => saveNotes(slug, Router, setContent, setTitle)}
          className="
            absolute bottom-4 right-4 z-10
            h-10 px-4 rounded-lg
            bg-indigo-600 hover:bg-indigo-700 
            text-white font-medium text-sm
            shadow-md hover:shadow-lg
            transition-all duration-200
            flex items-center gap-2
          "
        >
          <Save className="h-4 w-4" />
          <span className="hidden sm:inline">Save</span>
        </NextButton>
      </div>
    </div>
  );
};

export default Tiptap;