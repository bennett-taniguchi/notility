import React, { useRef } from "react";
import Layout from "../components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import { Button as NextButton } from "../components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import { useRouter } from "next/router";
import ReactPlayer from "react-player";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Separator } from "../components/ui/separator";
import { Textarea } from "../components/ui/textarea";
import { LuHeading1, LuHeading2, LuHeading3 } from "react-icons/lu";
import {
  PilcrowIcon,
  FontBoldIcon,
  FontItalicIcon,
  StrikethroughIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  TextAlignJustifyIcon,
} from "@radix-ui/react-icons";
import { FaHighlighter, FaListOl, FaListUl } from "react-icons/fa6";
import { Canvas } from "@react-three/fiber";
import { Scroll, ScrollControls, useScroll } from "@react-three/drei";
// import  NotesDemo from '../public/videos/cursorful-notes.mp4' as any

const Blog = () => {
  const Router = useRouter();
  const ref = useRef(null);
  const scroll = useRef(0);
  return (
    <Layout>
      <div className="page w-page h-[200svh]  spectrum-background">
        <h1 className="  font-roboto text-[70px]  text-center  font-extrabold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.9)]  text-[rgba(0,0,0,.5)] mb-[5svh]">
          Notility
        </h1>

       
        
              <Card
                onClick={() => Router.push("/notes/landing")}
                className="h-[65svh] w-[48svw]  landingCard ml-5 "
              >
                <CardHeader>
                  <CardTitle>
                    {" "}
                    <p className=" font-roboto text-[30px]   font-bold   text-[rgba(0,0,0,.6)] ">
                      Create Notes
                    </p>{" "}
                  </CardTitle>
                  <CardDescription>
                    Take your notes online with a rich text editor.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <video
                    width="800"
                    height="700"
                    controls={false}
                    preload="auto"
                    autoPlay={true}
                    loop
                    muted
                  >
                    <source
                      src="/videos/cursorful-notes.mp4"
                      type="video/mp4"
                    />
                    <track
                      src="/videos/cursorful-notes.mp4"
                      kind="subtitles"
                      srcLang="en"
                      label="English"
                    />
                    Your browser does not support the video tag.
                  </video>
                </CardContent>
                <CardFooter></CardFooter>
              </Card>
          
      </div>
    </Layout>
  );
};

export default Blog;
