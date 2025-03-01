import Latex from "react-latex-next";
import { Card, CardHeader, CardTitle, CardContent } from "../../../ui/card";
import { FaStickyNote } from "react-icons/fa";
import { ImListNumbered } from "react-icons/im";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../ui/tooltip";
import { useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../ui/dialog";

import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { ScrollArea } from "../../../ui/scroll-area";
import { title } from "process";
import { useRouter } from "next/router";
import { SlugContext } from "../../../context/context";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { cn } from "../../../lib/utils";

async function createAsNote({ m }) {
  let title = m.title;
  let content = m.content;
  let uri = m.uri;
  const body = { title, content, uri };

  await fetch("/api/notes/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function MatchScoreArea({ m }) {
  return (
    <>
      {m.role !== "user" && m.match && m.match.length != 0 ? (
        <>
          <div className="flex flex-col gap-2 px-2 rounded-lg bg-indigo-600/20 shadow-sm mt-5">
            {true && (
              <div className=" ">
                <div className=" bg-transparent rounded-md mb-2">
                  <p className="text-sm text-black/80 font-bold">Source :</p>
                  <blockquote className= "  mt-1 text-xs text-black/80 border-l-2 border-sky-800/40 pl-3 ">
                    {m.match}
                  </blockquote>
                  <p className="mt-1 text-xs text-black/50 italic">
                    Relevance score: {Math.round(m.matchScore * 100)}%
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

function CreateOutputButtons({ handleModal, m }) {
  return (
    <div className="mt-2 flex flex-row gap-2 justify-end ">
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>
            {" "}
            <FaStickyNote
              className="w-[15px] h-[15px] cursor-pointer fill-zinc-800 hover:fill-zinc-600/60"
              onClick={() => handleModal(m, "Note")}
            />
          </TooltipTrigger>
          <TooltipContent className=" ">
            <p>Send Chat to Notes</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>
            {" "}
            <ImListNumbered
              className="w-[15px] h-[15px] cursor-pointer fill-zinc-800 hover:fill-zinc-600/60"
              onClick={() => handleModal(m, "Guide")}
            />
          </TooltipTrigger>
          <TooltipContent className=" ">
            <p>Create Guide from Chat</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
function GuideModal({
  openGuideModal,
  setOpenGuideModal,
  setTitle,
  title,
  content,
  Router,
  slug,
}) {
  async function saveGuide() {
    let uri = slug;
    const body = { title, content, uri };

    await fetch("/api/notes/create_guide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(() => {
      setOpenGuideModal(false);
    });
    Router.push("/notespace/" + uri);
  }

  return (
    <Dialog open={openGuideModal} onOpenChange={setOpenGuideModal}>
      <DialogContent className="min-w-[80svw] max-w-[80svw]">
        <DialogHeader>
          <DialogTitle>Set Title of Guide</DialogTitle>
          <DialogDescription>Generate a Guide Given Content</DialogDescription>
        </DialogHeader>
        <div className="grid   py-4 ">
          <div className=" ml-0 pb-[10px]">
            <Label htmlFor="title2" className="text-right">
              Title
            </Label>
            <Input
              id="title2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3 w-[400px]"
            />
          </div>
          <div>
            <Label htmlFor="content" className="text-right">
              Content
            </Label>
            <ScrollArea viewportRef={null} color="h-[40svh]">
              <div className="h-[40svh] text-sm">{content}</div>
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => saveGuide()}>
            Save Guide
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
function NoteModal({
  openNoteModal,
  setOpenNoteModal,
  setTitle,
  title,

  content,
  Router,
  slug,
}) {
  async function saveNote() {
    let uri = slug;
    const body = { title, content, uri };

    await fetch("/api/notes/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(() => {
      setOpenNoteModal(false);
    });
    Router.push("/notespace/" + uri);
  }

  return (
    <Dialog open={openNoteModal} onOpenChange={setOpenNoteModal}>
      <DialogContent className="min-w-[80svw] max-w-[80svw]">
        <DialogHeader>
          <DialogTitle>Set Title of Note</DialogTitle>
          <DialogDescription>Choose a Title</DialogDescription>
        </DialogHeader>
        <div className="grid   py-4 ">
          <div className=" ml-0 pb-[10px]">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3 w-[400px]"
            />
          </div>
          <div>
            <Label htmlFor="content" className="text-right">
              Content
            </Label>
            <ScrollArea viewportRef={null} color="h-[40svh] ">
              <div className="h-[40svh] text-sm">{content}</div>
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => saveNote()}>
            Save Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default function MessageList({ messagesLoaded }) {
  const Router = useRouter();
  const [openNoteModal, setOpenNoteModal] = useState(false);
  const [openGuideModal, setOpenGuideModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { slug } = useContext(SlugContext);

  function handleModal(message: any, type: string) {
    if (type == "Note") {
      setOpenNoteModal(true);
      setOpenGuideModal(false);
    } else {
      setOpenNoteModal(false);
      setOpenGuideModal(true);
    }

    setContent(message.content);
  }

  return (
    <div className="flex flex-col justify-items-center justify-self-center gap-y-2 ">
      <NoteModal
        openNoteModal={openNoteModal}
        setOpenNoteModal={setOpenNoteModal}
        setTitle={setTitle}
        title={title}
        content={content}
        Router={Router}
        slug={slug}
      />
      <GuideModal
        openGuideModal={openGuideModal}
        setOpenGuideModal={setOpenGuideModal}
        setTitle={setTitle}
        title={title}
        content={content}
        Router={Router}
        slug={slug}
      />
      {messagesLoaded && messagesLoaded.length != 0 ? (
        messagesLoaded.map((m: any, idx) => (
          <div
            key={idx}
            id={idx}
            className={
              m.role === "user"
                ? "ml-[3svw] flex justify-end"
                : "ml-[3svw] flex justify-start"
            }
          >
            <Card
              className={
                m.role === "user"
                  ? "reverse-chat-background drop-shadow-lg  border-2  border-white   min-w-[10svw]"
                  : "chat-background drop-shadow-lg shadow-inner border-2 border-white min-w-[10svw]"
              }
            >
              <div key={m.id} className="whitespace-pre-wrap">
                <CardHeader>
                  <CardTitle style={{textAlign: m.role=='user' ? 'right' : 'left'}}className="font-bold font-mono">
                    {m.role === "user" ? "User: " : "AI: "}
                  </CardTitle>
                </CardHeader>
                <span className=" text-slate-600">
                  <CardContent>

                 
                      
                    <Latex>{m.content}</Latex>
                    
                     
                    <MatchScoreArea m={m} />
                    <CreateOutputButtons m={m} handleModal={handleModal} />
                  </CardContent>
                </span>
              </div>
            </Card>
          </div>
        ))
      ) : (
        <></>
      )}
    </div>
  );
}
