import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import { EllipsisVertical } from "lucide-react";
import {
  CollapseContext,
 
  NotesContext,
  QuizzesContext,
  SlugContext,
  TiptapContext,
} from "../../../context/context";
import { Button } from "../../../ui/button";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../../ui/table";
import { Input } from "../../../ui/input";

import {
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogContent,
  Dialog,
 
} from "../../../ui/dialog";
 
import { Label } from "../../../ui/label";
import QuizDialog from "./QuizDialog";
import GuideDialog from "./GuideDialog";
import TestDialog from "./TestDialog";
import { FoldHorizontal  } from "lucide-react";
import { cn } from "../../../lib/utils";

function NoteOptions({
  title,
  setNewTitle,
  newTitle,
  open,
  setOpen,
  uri,
  Router,
}) {
  async function deleteCard(str) {
    await fetch("/api/notes/delete/" + title, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    Router.push("/notespace/" + uri);
  }

  async function updateTitle(str) {
    let oldTitle = title;

    const body = { newTitle, oldTitle, uri };
    await fetch("/api/notes/update/title", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    Router.push("/notespace/" + uri);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent  className="sm:max-w-[425px]  ">
        <DialogHeader>
          <DialogTitle>Edit Set</DialogTitle>
          <DialogDescription>
            For Note: <i>{title}</i>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4 -ml-[3svw]">
            <Label htmlFor="name" className="text-right">
              New Title
            </Label>
            <Input
              id="name"
              onChange={(e) => setNewTitle(e.currentTarget.value)}
              value={newTitle}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant={"destructive"}
            className="mx-auto ml-0"
            type="submit"
            onClick={() => deleteCard(title)}
          >
            Delete Note
          </Button>
          <Button
            className="mx-auto "
            type="submit"
            onClick={() => updateTitle(newTitle).then(() => setOpen(false))}
          >
            Save Title
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function OutputContentButtons({ setEditorVisible, Router, setSelectedNote, setQuizVisible }) {
  const [quizDialogOpen, setQuizDialogOpen] = useState(false);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [guideDialogOpen, setGuideDialogOpen] = useState(false);

  const { setTitle, setContent } = useContext(TiptapContext);

  const { collapse } = useContext(CollapseContext);
  const { slug } = useContext(SlugContext);

  function newNote() {
    if (setTitle && setContent) {
      setSelectedNote({ title: "", content: "" });
      setEditorVisible(true);
    }
  }
  // ensure only 1 dialog open at a type
  function openSelectedDialog(dialogType) {
    setTestDialogOpen(false);
    setGuideDialogOpen(false);
    setQuizDialogOpen(false);
    if (dialogType == "Quiz") {
      setQuizDialogOpen(true);
    } else if (dialogType == "Test") {
      setTestDialogOpen(true);
    } else if (dialogType == "Guide") {
      setGuideDialogOpen(true);
    }
  }

  return (
    <div className={"justify-center   w-[46svw] whitespace-nowrap overflow-none  justify-self-center mt-[20px] align-bottom flex flex-row-4 gap-2 bg-sky-100"}>
      <Button
        variant={"outline"}
        className="    whitespace-nowrap  animated-row border-2 border-white"
        onClick={() => newNote()}
      >
        Create new Note
      </Button>
      <GuideDialog
        visible={guideDialogOpen}
        setVisible={setGuideDialogOpen}
        uri={slug}
        Router={Router}
      />
      <Button
        variant={"outline"}
        className="whitespace-nowrap   animated-row border-2 border-white"
        onClick={() => openSelectedDialog("Guide")}
      >
        Create new Guide
      </Button>

      <QuizDialog
        visible={quizDialogOpen}
        setVisible={setQuizDialogOpen}
        uri={slug}
        Router={Router}
      />
      <Button
        variant={"outline"}
        className=" whitespace-nowrap  animated-row border-2 border-white"
        onClick={() => openSelectedDialog("Quiz")}
      >
        Create new Quiz
      </Button>
      {/* <Button
        variant={"outline"}
        className=" whitespace-nowrap  animated-row border-2 border-white"
        onClick={()=>setQuizVisible(true)}
      >
        Open Quiz Area!
      </Button> */}
    
      {/* <TestDialog
        visible={testDialogOpen}
        setVisible={setTestDialogOpen}
        uri={slug}
        Router={Router}
      />
      <Button
        variant={"outline"}
        className="whitespace-nowrap   animated-row border-2 border-white"
        onClick={() => openSelectedDialog("Test")}
      >
        Create new Test
      </Button> */}
    </div>
  );
}

export default function OutputTable({
  editorVisible,
  setEditorVisible,
  selectedNote,
  setSelectedNote,
  setQuizVisible
}) {
  const { setTitle } = useContext(TiptapContext);
  const [response, setResponse] = useState([]) as any;
  const [view, setView] = useState(false);

  const { collapse, setCollapse } = useContext(CollapseContext);
  const { notes } = useContext(NotesContext);

  const { quizzes } = useContext(QuizzesContext)
  const {selectedQuiz,setSelectedQuiz} = useContext(QuizzesContext)


  const { slug } = useContext(SlugContext);
  const [newTitle, setNewTitle] = useState("");
  const [open, setOpen] = useState(false);
  const Router = useRouter();

  useEffect(() => {}, [notes,collapse,quizzes]);

  useEffect(() => {
  }, [response]);

  function toggleCollapse() {
    if (collapse == "chat") {
      (setCollapse as any)("none");
    } else if (collapse=='none'){
      (setCollapse as any)("output");
    } else {
      (setCollapse as any)("none");
    }
  }

 
  if (collapse == "output")
    return (
      <div>
        {" "}
        <FoldHorizontal 
          onClick={() => toggleCollapse()}
          className="hover:text-black text-white w-[20px] h-[20px] absolute right-[5px] top-[5px] cursor-pointer"
          width={40}
          height={40}
        />
      </div>
    );

 
    function selectQuiz(q) {
      if(setSelectedQuiz)
      (setSelectedQuiz as any)(q)
    setQuizVisible(true)
    }

  function selectNoteAndTitle(note) {
    if (setTitle) (setTitle as any)(note.title);

    setSelectedNote(note);
  }
  return (
    <div className={cn("bg-sky-100 rounded-xl", 
   // collapse=='chat' ? 'w-[98svw] mx-auto ml-[-26svw]' : 'w-[46svw]')
  )}>
      <div className="chat-background-2 py-[21.5px] font-roboto rounded-t-xl text-3xl text-white text-left pl-[10px] border-2 border-white border-t-white rounded-xl rounded-b-none">
        <div className="drop-shadow-lg ">
          {" "}
          <FoldHorizontal 
            onClick={() => toggleCollapse()}
            className=" bg-white/30 rounded hover:text-black text-white w-[20px] h-[20px] absolute right-[5px] top-[-18px] cursor-pointer"
            width={40}
            height={40}
          />
          Studio
        </div>
      </div>
      <Table className={cn(" mx-auto   bg-sky-100", collapse=='chat' ? 'w-[92svw]' : 'w-[46svw]')}>
        {notes.length == 0 ? (
          <TableCaption>Your recent Notes and Quizzes</TableCaption>
        ) : (
          <div></div>
        )}
        <TableHeader>
          <TableRow >
            <TableHead className="  text-black">Title</TableHead>
            {/* <TableHead className="text-black">Amount of Sources</TableHead> */}
            <TableHead className="text-black">Type</TableHead>
            <TableHead className="text-right text-black">Created On</TableHead>
            <TableHead className="text-right text-black">Owner</TableHead>
           
          </TableRow>
        </TableHeader>
        <TableBody>
          {notes && notes.length != 0 ? (
            notes.map((datum: any, idx: number) => (
              <TableRow
                key={datum.title}
                className="  w-max h-max hover:bg-indigo-400/50   hover:text-white animated-row border-none text-black"
                onClick={() => selectNoteAndTitle(notes[idx])}
              >
                <TableCell
                  onClick={() => setEditorVisible(!editorVisible)}
                  className="font-medium cursor-pointer    "
                >
                  {datum.title}
                </TableCell>
                <TableCell
                  onClick={() => setEditorVisible(!editorVisible)}
                  className={"cursor-pointer"}
                >
                  Note
                </TableCell>
                <TableCell
                  onClick={() => setEditorVisible(!editorVisible)}
                  className={"cursor-pointer"}
                >
                  {datum.createdOn}
                </TableCell>
                <TableCell
                  onClick={() => setEditorVisible(!editorVisible)}
                  className="text-right cursor-pointer"
                >
                  {datum.createdBy}
                </TableCell>
                <TableCell className="w-[1svw] h-[5svh] hover:bg-indigo-800">
                  {" "}
                  <NoteOptions
                    title={datum.title}
                    newTitle={newTitle}
                    setNewTitle={setNewTitle}
                    open={open}
                    setOpen={setOpen}
                    uri={slug}
                    Router={Router}
                  />
                  <EllipsisVertical
                    className="cursor-pointer w-5 h-5"
                    onClick={() => setOpen(!open)}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <div></div>
          )}

{quizzes && quizzes.length != 0 ? (
            quizzes.map((datum: any, idx: number) => (
              <TableRow
                key={datum.title}
                className="  w-max h-max hover:bg-indigo-400/50   hover:text-white animated-row border-none text-black"
                onClick={() => selectQuiz(quizzes[idx])}
              >
                <TableCell
                  onClick={() => setQuizVisible(!setQuizVisible)}
                  className="font-medium cursor-pointer    "
                >
                  {datum.title}
                </TableCell>
                <TableCell
                  onClick={() => setQuizVisible(!setQuizVisible)}
                  className={"cursor-pointer"}
                >
                  Quiz
                </TableCell>
                <TableCell
                  onClick={() => setQuizVisible(!setQuizVisible)}
                  className={"cursor-pointer  text-right"}
                >
                  {datum.createdOn}
                </TableCell>
                <TableCell
                  onClick={() => setQuizVisible(!setQuizVisible)}
                  className="text-right cursor-pointer"
                >
                  {datum.createdBy}
                </TableCell>
                <TableCell className="w-[1svw] h-[5svh] hover:bg-indigo-800">
                  {" "}
                  <NoteOptions
                    title={datum.title}
                    newTitle={newTitle}
                    setNewTitle={setNewTitle}
                    open={open}
                    setOpen={setOpen}
                    uri={slug}
                    Router={Router}
                  />
                  <EllipsisVertical
                    className="cursor-pointer w-5 h-5"
                    onClick={() => setOpen(!open)}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <div></div>
          )}
        </TableBody>
      </Table>

      <OutputContentButtons
        setEditorVisible={setEditorVisible}
        setSelectedNote={setSelectedNote}
        Router={Router}
        setQuizVisible={setQuizVisible}
      />
    </div>
  );
}
