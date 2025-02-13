import { Suspense, useContext, useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoReturnUpBack } from "react-icons/io5";
import { Button } from "../../ui/button";
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../ui/table";
import dynamic from "next/dynamic";
import Tiptap from "./Tiptap";
import { NotesContext, SlugContext } from "../../context/context";
import { Notes } from "@prisma/client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
 
import Link from "next/link";
import { CiCirclePlus } from "react-icons/ci";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { useRouter } from "next/router";
 

 
 
function NoteOptions({title,setNewTitle,newTitle,open,setOpen,uri,Router}){
 
 
  
  async function deleteCard(str){
  await fetch('/api/notes/delete/'+title,
    { method:'DELETE',
      headers: {'Content-Type': 'application/json'},
    }
  )
}
 
async function updateTitle(str) {
  let oldTitle=title

  const body = {newTitle,oldTitle,uri}
  await fetch('/api/notes/update/title',
    { method:'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    }
  )

  Router.push('/notespace/'+uri)
}
  return(
    <Dialog modal={true} open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]  ">
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
              <Input id="name" onChange={e => setNewTitle(e.currentTarget.value)} value={newTitle} className="col-span-3" />
            </div>
             
          </div>
          <DialogFooter>
            <Button
              variant={"destructive"}
              className="mx-auto ml-0"
              type="submit"
              onClick={()=>deleteCard(title) }
            >
              Delete Note
            </Button>
            <Button className="mx-auto" type="submit" onClick={()=>updateTitle(newTitle).then(()=>setOpen(false))}  >
              Save Title
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  )
}
 function OutputTable({ editorVisible, setEditorVisible ,selectedNote,setSelectedNote}) {
  const {notes} = useContext(NotesContext)
 const {slug} = useContext(SlugContext)
const [newTitle,setNewTitle] = useState('')
const [open,setOpen] = useState(false)
 const Router = useRouter()
 
 useEffect(()=> {
 
 },[notes])
    
  return (
     
    <div>
      <div className="w-[50svw] h-[9.8svh] chat-background" />
      <Table className="w-[49svw] mx-auto mt-[10svh]">
        <TableCaption>Your recent Notespaces</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Title</TableHead>
            <TableHead>Amount of Sources</TableHead>
            <TableHead>Created On</TableHead>
            <TableHead className="text-right">Owner</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notes && notes.length != 0 ? notes.map((datum:any,idx: number) => (
            <TableRow
              key={datum.title}
              className="w-max h-max hover:bg-zinc-200  "
              onClick={()=>setSelectedNote(notes[idx] as any)}
            >
              <TableCell
                onClick={() => setEditorVisible(!editorVisible)}
                className="font-medium cursor-pointer "
              >
                {datum.title}
              </TableCell>
              <TableCell
                onClick={() => setEditorVisible(!editorVisible)}
                className={"cursor-pointer"}
              >
                {datum.sources}
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
              <TableCell className="w-[2svw] h-[5svh] hover:bg-white">
                {" "}
                <NoteOptions title={datum.title} newTitle={newTitle} setNewTitle={setNewTitle} open={open} setOpen={setOpen} uri={slug} Router={Router}/>
                <BsThreeDotsVertical className="cursor-pointer w-5 h-5" onClick={()=>setOpen(!open)}/>
              </TableCell>
            </TableRow>
          ) 
        ) :<div></div>}
        </TableBody>
      </Table>

      <div className="ml-[4svw] mt-[5svw]">
        <Button variant={"outline"} className="ml-[2svw]" onClick={()=>setEditorVisible(true)}>
          Create new Note
        </Button>
        <Button variant={"outline"} className="ml-[2svw]">
          Create new Guide
        </Button>
        <Button variant={"outline"} className="ml-[2svw]">
          Create new Note
        </Button>
        <Button variant={"outline"} className="ml-[2svw]">
          Create new Test
        </Button>
      </div>
    </div>
  );
}
export default function OutputArea({ editorVisible, setEditorVisible }: any) {
  const [selectedNote,setSelectedNote] = useState({title:'',content:''}) as any
  return (
    <div>
      {editorVisible ? (
        <Suspense fallback={<div>loading...</div>}>
        <div>
          <div
            className="  hover:bg-sky-100  ml-[8svw] mt-[.7svh] fixed   border-none  text-sm font-bold text-zinc-700 cursor-pointer bg-white/80 rounded px-2"
            onClick={() => setEditorVisible(!editorVisible)}
          >
            <div className="flex flex-row  ">
              <IoReturnUpBack className="mr-1 mt-1" />
              Go back
            </div>
          </div>

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