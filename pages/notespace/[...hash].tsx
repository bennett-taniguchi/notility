import { useRouter } from "next/router";
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

function SourcesDrawer() {
    return(
        <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">Access Sources</Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Move Goal</DrawerTitle>
              <DrawerDescription>
                Set your daily activity goal.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-full"
                >
                  <FaMinus />
                  <span className="sr-only">Decrease</span>
                </Button>
                <div className="flex-1 text-center">
                  <div className="text-7xl font-bold tracking-tighter"></div>
                  <div className="text-[0.70rem] uppercase text-muted-foreground">
                    Calories/day
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-full"
                >
                  <FaPlus />
                  <span className="sr-only">Increase</span>
                </Button>
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
    )
}
export default function Notespace() {
  const Router = useRouter();
  const { slug } = Router.query;

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
            <Textarea className="span-3/4 resize-none h-[6svh] my-auto mr-[2svw] text-center">
              {slug + ""}
            </Textarea>
          </div>


          <div id='top_sources' className="basis-1/3  m-auto  ">
          

           <div  className={'ml-[13svw]'}>
    <SourcesDrawer/>
             
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
              <Tiptap />
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
