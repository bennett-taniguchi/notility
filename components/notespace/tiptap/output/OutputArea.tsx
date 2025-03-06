import { Suspense, useContext, useState } from "react";
import Tiptap from "../Tiptap";
import OutputTable from "./OutputTable";
import {
  CollapseContext,
  GraphViewContext,
  TiptapContext,
} from "../../../context/context";
import { cn } from "../../../lib/utils";
import Quiz from "../../quiz/Quiz";
// Assumption that we managae state for quiz/tiptap/table responsibly
export default function OutputArea({ editorVisible, setEditorVisible }: any) {
  const [selectedNote, setSelectedNote] = useState({
    title: "",
    content: "",
  }) as any;
  const { collapse } = useContext(CollapseContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [quizVisible,setQuizVisible] = useState(false)

  const TiptapContextValue = {
    title: title,
    setTitle: setTitle as any,
    content: content,
    setContent: setContent as any,
  };

  if (collapse == "output")
    return (
      <OutputTable
        editorVisible={editorVisible}
        setEditorVisible={setEditorVisible}
        setSelectedNote={setSelectedNote}
        selectedNote={selectedNote}
        setQuizVisible={setQuizVisible}
      />
    );

  if(quizVisible) {
    return(
      <div
      className={cn(
        "   h-[87.3svh] bg-sky-100   border-cyan-400/50 border-2 rounded-2xl ",
        collapse == "chat" ? "w-[98svw] ml-[-1svw]" : "w-[48svw]"
      )}
    >
      <Quiz setQuizVisible={setQuizVisible}/>
    </div>
    )
   
  }
  return (
    <TiptapContext.Provider value={TiptapContextValue}>
      <div
        className={cn(
          "   h-[87.3svh] bg-sky-100   border-cyan-400/50 border-2 rounded-2xl ",
          collapse == "chat" ? "w-[98svw] ml-[-1svw]" : "w-[48svw]"
        )}
      >
        {editorVisible ? (
          <Suspense fallback={<div>loading...</div>}>
            <div>
              <Tiptap
                setEditorVisible={setEditorVisible}
                editorVisible={editorVisible}
                givenTitle={selectedNote.title}
                givenContent={selectedNote.content}
              />
            </div>
          </Suspense>
        ) : (
          <OutputTable
            editorVisible={editorVisible}
            setEditorVisible={setEditorVisible}
            setSelectedNote={setSelectedNote}
            selectedNote={selectedNote}
            setQuizVisible={setQuizVisible}
          />
        )}
      </div>
    </TiptapContext.Provider>
  );
}
