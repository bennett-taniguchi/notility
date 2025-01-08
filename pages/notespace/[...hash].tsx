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
import { FaFilePdf } from "react-icons/fa";
import { FaMarkdown } from "react-icons/fa";
import { SiLatex } from "react-icons/si";
import { BsFiletypeCsv } from "react-icons/bs";
import { TbJson } from "react-icons/tb";
import { TbTxt } from "react-icons/tb";
import { UploadButton } from "@bytescale/upload-widget-react";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from "../../components/ui/menubar";
import { Separator } from "../../components/ui/separator";

const options = {
    apiKey: "public_W142iw5A2CjLkNdU7G6px7mYYKZH", // This is your API key.
    maxFileCount: 1
  };

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
    <div >
        <div className="w-[50svw] h-[9.8svh] chat-background"/>
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
          variant='outline'
            className="ml-[1svw] mt-[4.5svh] fixed bg-sky-100/50 border-none  "
            onClick={() => setEditorVisible(!editorVisible)}
          >
            <IoReturnUpBack className="text-zinc-700 scale-150"  />
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
  // FaFilePdf
  // FaMarkdown
  // SiLatex
  //  BsFiletypeCsv
  //  TbJson
  //  TbTxt

  const sources = [
    {
      name: "Source 1",
    },
    {
      name: "Source 2",
    },
    {
      name: "Source 3",
    },
  ];
  return (
    <Drawer>
         
      <DrawerTrigger asChild>
        <div className="ml-[-7svw] flex flex-row py-[1svw]">
       
      <UploadButton options={options}
                onComplete={files => alert(files.map(x => x.fileUrl).join("\n"))}>
    {({onClick}) =>
      <Button variant='outline' onClick={onClick} className="hover:drop-shadow-sm border-sky-400/50 animated-button text-sm mr-[1svw] w-[8svw] h-[5svh]">
        <svg  className='mr-1' width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 2C3.22386 2 3 2.22386 3 2.5V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V6H8.5C8.22386 6 8 5.77614 8 5.5V2H3.5ZM9 2.70711L11.2929 5H9V2.70711ZM2 2.5C2 1.67157 2.67157 1 3.5 1H8.5C8.63261 1 8.75979 1.05268 8.85355 1.14645L12.8536 5.14645C12.9473 5.24021 13 5.36739 13 5.5V12.5C13 13.3284 12.3284 14 11.5 14H3.5C2.67157 14 2 13.3284 2 12.5V2.5Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
        Upload a file...
      </Button>
    }
  </UploadButton>
        <Button variant="outline" className="hover:drop-shadow-sm   border-sky-400/50   animated-button w-[8svw] h-[5svh]">
        <svg className='mr-1' width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3H12V12H3L3 3ZM2 3C2 2.44771 2.44772 2 3 2H12C12.5523 2 13 2.44772 13 3V12C13 12.5523 12.5523 13 12 13H3C2.44771 13 2 12.5523 2 12V3ZM10.3498 5.51105C10.506 5.28337 10.4481 4.97212 10.2204 4.81587C9.99275 4.65961 9.6815 4.71751 9.52525 4.94519L6.64048 9.14857L5.19733 7.40889C5.02102 7.19635 4.7058 7.16699 4.49327 7.34329C4.28073 7.5196 4.25137 7.83482 4.42767 8.04735L6.2934 10.2964C6.39348 10.4171 6.54437 10.4838 6.70097 10.4767C6.85757 10.4695 7.00177 10.3894 7.09047 10.2601L10.3498 5.51105Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
            Select Sources</Button>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm h-[80svh]">
          <DrawerHeader className="absolute left-[1.5svw]">
            <DrawerTitle>Selected Sources:</DrawerTitle>
            <DrawerDescription>Upload or Enter Link</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0 mt-[3svw]">
            <div className="flex items-center justify-center space-x-2 flex-col group">
              {sources.map((source) => (
                <div className=" shadow-cyan-800/40 group hover:shadow-cyan-600/40 hover:shadow-md hover:my-[.3svh] transform duration-300 shadow-sm ml-1.5 bg-zinc-200 px-[1svw] rounded-md  w-[30svw] flex flex-row h-[5svh] mt-1 border-b-[.1svw] border-t-2 border-r-[.1svw] border-l-[.1svw] mb-[.1svw] border-zinc-300  ">
                  <div className="my-auto  ">
                    <Checkbox
                      id={source.name}
                      className="mr-3 hover:bg-cyan-100/30"
                    />
                    <label
                      htmlFor={source.name}
                      className="text-slate-700 font-roboto text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70  "
                    >
                      {source.name}
                    </label>
                  </div>

                  <BsThreeDotsVertical className="right-0 absolute mr-[2svw] h-[1.5svw] w-[1.5svw] mt-[.9svh]  fill-slate-700" />

                  <TbJson className="right-0 absolute mr-[.5svw] h-[1.25svw] w-[1.25svw] mt-[.9svh] stroke-yellow-600" />
                </div>
              ))}
             
            </div>
            <div className="mt-3 h-[40svh]"></div>
          </div>
          <DrawerFooter className="flex flex-row absolute ml-[4.5svw]">
            <Button className="w-[10svh] ">Submit</Button>
            <DrawerClose asChild>
              <Button className="w-[10svh]  " variant="outline">
                Cancel
              </Button>
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
    <div className="w-[100svw] h-[100svh] bg-cyan-500/60 grid grid-rows-1 gap-2">
      <Suspense fallback={Loading}>

        <div className="w-[100svw] h-[10svh] border-b-slate-200 reverse-chat-background flex flex-row divide-x-2">
          <div
            className="basis-1/3 text-center text-black flex flex-row-2"
            id="top_info"
          >
            <div className="span-1/4  my-auto mr-[1svw]  ml-[1svw] rounded-md mt-[3svh]">
              <Link href="/notespace">
                <RiHome2Fill className="w-[3svw] h-[5svh] fill-black/70" />
              </Link>
            </div>
            <Textarea
              className="overflow-y-hidden bg-gradient-to-r from-zinc-400/50 to-cyan-400/50 text-sky-100 span-3/4 resize-none h-[6svh] my-auto mr-[2svw] text-start   text-4xl/10 font-bold border-none"
              defaultValue={"Practice Set"}
            />
          </div>

          <div id="top_sources" className="basis-1/3  m-auto  ">
            <div className={"ml-[13svw]"}></div>
          </div>

          <div
            className="border-transparent border-l-2 basis-1/3 text-center flex flex-row-3 m-auto  rounded-xl mr-[2svw] pb-[1svh]"
            id="top_sources"
          >
            <div className="ml-[20svw] span-1/3   text-cyan-800    ">
              
              <FaGear className="w-[4svw] h-[4svh] cursor-pointer fill-cyan-600/80" />
            </div>
            <div className=" span-1/3  text-cyan-800">
           
             
              <FaShare className="w-[4svw] h-[4svh] cursor-pointer fill-cyan-600/80" />{" "}
            </div>

            <div className="span-1/3 " id="top_dash text-cyan-800">
              
              <FaUserAlt className="w-[4svw] h-[4svh] cursor-pointer fill-cyan-600/80" />
            </div>
          </div>
        </div>
        <div className="w-[100svw] h-[90svh]">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel  >
              <ChatWindow   messagesLoaded={undefined} title={undefined}>

             
                <SourcesDrawer />
              </ChatWindow>
            </ResizablePanel>
             
            <ResizablePanel      >
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
