import { Suspense, useContext, useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoReturnUpBack } from "react-icons/io5";
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
import dynamic from "next/dynamic";
import Tiptap from "../Tiptap";
import { NotesContext, SlugContext } from "../../../context/context";
import { Notes } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";

import Link from "next/link";
import { CiCirclePlus } from "react-icons/ci";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { useRouter } from "next/router";
import OutputTable from "./OutputTable";




export default function OutputArea({ editorVisible, setEditorVisible }: any) {
  const [selectedNote, setSelectedNote] = useState({
    title: "",
    content: "",
  }) as any;
  return (
    <div className="  w-[48svw] h-[46svw] bg-sky-100   border-cyan-400/50 border-2 rounded-2xl" >
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
