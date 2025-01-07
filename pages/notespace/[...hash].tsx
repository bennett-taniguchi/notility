import { Router, useRouter } from "next/router";
import React, { Suspense, useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../components/ui/resizable";
import { Textarea } from "../../components/ui/textarea";
import { RiHome2Fill } from "react-icons/ri";
import Link from "next/link";
import { FaGear, FaShare } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import { Button } from "../../components/ui/button";
import ChatWindow from "../../components/chat/ChatWindow";
import Tiptap from "../../components/notes/tiptap/Tiptap";
import { Skeleton } from "../../components/ui/skeleton";
import { Loading } from "../../components/loading/Loading";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../components/ui/drawer";
import { FaMinus, FaPlus } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../components/ui/table";
import { IoReturnUpBack } from "react-icons/io5";
import { Checkbox } from "../../components/ui/checkbox";
function OutputTable({ editorVisible, setEditorVisible }) {
  const data = [
    {
      title: "Math Equations",
      sources: 3,
      createdOn: "1/6/2025",
      ownedBy: "Me",
    },
  ];
  return (
    <div>
      <Table className="w-[49svw] mx-auto">
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
          {data.map((datum) => (
            <TableRow
              key={datum.title}
              className="w-max h-max hover:bg-zinc-200  "
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
                {datum.ownedBy}
              </TableCell>
              <TableCell className="w-[2svw] h-[5svh] hover:bg-white">
                {" "}
                <BsThreeDotsVertical className="cursor-pointer w-5 h-5" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="ml-[4svw] mt-[5svw]">
        <Button variant={"outline"} className="ml-[2svw]">
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
function OutputArea({ editorVisible, setEditorVisible }: any) {
  return (
    <div>
      {editorVisible ? (
        <div>
          <Button
            className="ml-[1svw] mt-[.7svh] fixed"
            onClick={() => setEditorVisible(!editorVisible)}
          >
            <IoReturnUpBack />
          </Button>

          <Tiptap
            setEditorVisible={setEditorVisible}
            editorVisible={editorVisible}
          />
        </div>
      ) : (
        <OutputTable
          editorVisible={editorVisible}
          setEditorVisible={setEditorVisible}
        />
      )}
    </div>
  );
}
function SourcesDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Access Sources</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Selected Sources:</DrawerTitle>
            <DrawerDescription>Upload or enter</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2 flex-col">

              <div className="ml-1.5 bg-zinc-200 px-[1svw] rounded-md">
                <Checkbox id="source1" className="mr-3"   />
                <label
                  htmlFor="source1"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >Source 1
                </label>
              </div>

              <div>
                <Checkbox id="source2"  className="mr-3"  />
                <label
                  htmlFor="source2"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Source 2
                </label>
              </div>

              <div>
                {" "}
                <Checkbox id="source3" className="mr-3" />
                <label
                  htmlFor="source3"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Source 3
                </label>
              </div>
            </div>
            <div className="mt-3 h-[40svh]"></div>
          </div>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
export default function Notespace() {
  const Router = useRouter();
  const { slug } = Router.query;
  const [editorVisible, setEditorVisible] = useState(true);
  return (
    <div className="w-[100svw] h-[100svh] bg-zinc-100 grid grid-rows-1 gap-2">
      <Suspense fallback={Loading}>
        <div className="w-[100svw] h-[10svh] border-b-slate-200 border-b-2 flex flex-row divide-x-2">
          <div
            className="basis-1/3 text-center text-black flex flex-row-2"
            id="top_info"
          >
            <div className="span-1/4  my-auto mr-[1svw] hover:bg-zinc-200 ml-[1svw] rounded-md">
              <Link href="/notespace">
                <RiHome2Fill className="w-[3svw] h-[5svh]" />
              </Link>
            </div>
            <Textarea className="span-3/4 resize-none h-[6svh] my-auto mr-[2svw] text-center text-xl text-zinc-600 font-roboto">
              {"Practice Set"}
            </Textarea>
          </div>

          <div id="top_sources" className="basis-1/3  m-auto  ">
            <div className={"ml-[13svw]"}>
              <SourcesDrawer />
            </div>
          </div>

          <div
            className="basis-1/3 text-center flex flex-row-3 m-auto"
            id="top_sources"
          >
            <div className="span-1/3 m-auto ">
              Settings
              <FaGear className="w-[4svw] h-[4svh] cursor-pointer" />
            </div>
            <div className="span-1/3 m-auto">
              Share
              <FaShare className="w-[4svw] h-[4svh] cursor-pointer" />{" "}
            </div>

            <div className="span-1/3 m-auto" id="top_dash">
              {" "}
              User
              <FaUserAlt className="w-[4svw] h-[4svh] cursor-pointer" />
            </div>
          </div>
        </div>
        <div className="w-[100svw] h-[90svh]">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel>
              <ChatWindow messagesLoaded={undefined} title={undefined} />
            </ResizablePanel>
            <ResizableHandle disabled />
            <ResizablePanel>
              <OutputArea
                editorVisible={editorVisible}
                setEditorVisible={setEditorVisible}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </Suspense>
    </div>
  );
}
function setProgress(arg0: number): void {
  throw new Error("Function not implemented.");
}
