import { Suspense, useContext, useState } from "react";
import Tiptap from "../Tiptap";
import OutputTable from "./OutputTable";
import { CollapseContext, GraphViewContext } from "../../../context/context";

export default function OutputArea({ editorVisible, setEditorVisible  }: any) {
  const [selectedNote, setSelectedNote] = useState({
    title: "",
    content: "",
  }) as any;
  const {collapse} = useContext(CollapseContext)

 

  if(collapse=='output') return(
    <OutputTable
    editorVisible={editorVisible}
    setEditorVisible={setEditorVisible}
    setSelectedNote={setSelectedNote}
    selectedNote={selectedNote}

  />)
  return (
   
    <div   className="  w-[48svw] h-[87.3svh] bg-sky-100   border-cyan-400/50 border-2 rounded-2xl " >
      {editorVisible ? (
        <Suspense fallback={<div>loading...</div>}>
          <div >
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
    
        />
      )}
    </div>
 
  );
}
