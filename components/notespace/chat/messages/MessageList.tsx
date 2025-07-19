import { Card, CardHeader, CardTitle, CardContent } from "../../../ui/card";
import { ChevronDown, FileText, Info, StickyNote } from "lucide-react";
import { ListOrdered } from "lucide-react";
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

function MatchesList({ m, s, isOpen }) {
  let splitMatches = m.split("*");
  let splitScores = s.split("*");

  if (splitMatches[0] === "") {
    splitMatches = splitMatches.slice(1);
  }
  if (splitScores[0] === "") {
    splitScores = splitScores.slice(1);
  }

  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
      )}
    >
      {/* ScrollArea with fixed height when open */}
      <ScrollArea
        viewportRef={null}
        className={cn("transition-all duration-300", isOpen ? "h-80" : "h-0")}
      >
        <div className="space-y-3 p-3">
          {splitMatches.map((match, idx) => (
            <div
              key={idx}
              className="group bg-white/50 rounded-lg p-3 border border-white/20 hover:bg-white/70 transition-all duration-200"
              style={{
                animationDelay: `${idx * 100}ms`,
                animation: isOpen ? "fadeInUp 0.3s ease-out forwards" : "none",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-indigo-600" />
                <span className="font-semibold text-gray-900">
                  Source {idx + 1}
                </span>
                <div className="ml-auto flex items-center gap-1">
                  <span className="text-xs font-medium text-indigo-600">
                    {Math.round(parseFloat(splitScores[idx]) * 100)}%
                  </span>
                  <div
                    className={cn(
                      "h-2 w-8 rounded-full bg-gray-200 overflow-hidden"
                    )}
                  >
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-500"
                      style={{
                        width: `${Math.round(
                          parseFloat(splitScores[idx]) * 100
                        )}%`,
                        transitionDelay: isOpen
                          ? `${idx * 150 + 200}ms`
                          : "0ms",
                      }}
                    />
                  </div>
                </div>
              </div>

              <blockquote className="text-sm text-gray-700 italic border-l-4 border-indigo-500 pl-3 leading-relaxed">
                "...{match.trim()}..."
              </blockquote>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
function MatchScoreArea({ m }) {
  const [isOpen, setIsOpen] = useState(false);

  if (m.role === "user" || !m.match || m.match.length === 0) {
    return null;
  }

  const matchCount = m.match.split("*").filter(Boolean).length;

  return (
    <div className="mt-4">
      <div className=" bg-gradient-to-r from-indigo-500/10 to-blue-500/10 rounded-lg border border-indigo-200/50 backdrop-blur-sm overflow-hidden">
        {/* Clickable header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3 bg-white/50 hover:bg-white/30 transition-all duration-200 group"
        >
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium text-gray-900 ">
              Sources Referenced ({matchCount})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
              {isOpen ? "Hide" : "Show"} sources
            </span>
            <div
              className={cn(
                "transition-transform duration-200",
                isOpen ? "rotate-180" : "rotate-0"
              )}
            >
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </button>

        {/* Animated content */}
        <MatchesList m={m.match} s={m.matchScore} isOpen={isOpen as any} />
      </div>
    </div>
  );
}

function CreateOutputButtons({ handleModal, m }) {
  return (
    <div className="mt-2 flex flex-row gap-2 justify-end ">
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>
            {" "}
            <StickyNote
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
            <ListOrdered
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

  // Sort messages by index field to ensure correct chronological order
  const sortedMessages = messagesLoaded
    ? [...messagesLoaded].sort((a, b) => a.index - b.index)
    : [];

  console.log("Original messages:", messagesLoaded);
  console.log("Sorted messages:", sortedMessages);

  return (
    <div className="flex flex-col justify-items-center justify-self-center  ">
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
      {sortedMessages && sortedMessages.length != 0 ? (
        sortedMessages.map((m: any, idx) => (
          <div
            key={m.index} // Use m.index instead of idx for React key
            id={idx + ""}
            className={
              m.role === "user"
                ? "ml-[3svw] flex justify-end"
                : "ml-[3svw] flex justify-start"
            }
          >
            <Card
              className={
                m.role === "user"
                  ? "reverse-chat-background drop-shadow-lg  border-2  border-white   min-w-[10svw] my-3"
                  : "chat-background drop-shadow-lg shadow-inner border-2 border-white min-w-[10svw]"
              }
            >
              <div key={m.id} className="   ">
                <CardHeader>
                  <CardTitle
                    style={{ textAlign: m.role == "user" ? "right" : "left" }}
                    className="font-bold font-mono"
                  >
                    {m.role === "user" ? "User: " : "AI: "}
                  </CardTitle>
                </CardHeader>
                <span className=" text-slate-600 ">
                  <CardContent>
                    <ReactMarkdown>{m.content}</ReactMarkdown>
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
