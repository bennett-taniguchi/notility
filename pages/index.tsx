import React, {useRef } from "react";
import Layout from "../components/Layout";
import { Card } from "../components/ui/card";
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
import { Canvas } from '@react-three/fiber';
import { Scroll, ScrollControls, useScroll } from '@react-three/drei';
// import  NotesDemo from '../public/videos/cursorful-notes.mp4' as any

const Blog = () => {
  const Router = useRouter();
  const ref = useRef(null);
  const scroll = useRef(0);
  return (
   
    <Layout>
      <div className="page w-page h-[200svh] bg-emerald-400 ">
        <h1 className="  font-roboto text-[70px]  text-center  font-extrabold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.9)]  text-[rgba(0,0,0,.5)] ">
          Notility
        </h1>

        <div className=" ml-[5svw] w-[85svw] h-[88svh] bg-yellow-200   rounded-xl spectrum-background">
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 3000,
              }),
            ]}
            className="w-40svw overflow-hidden  pb-10"
          >
            <CarouselContent className=" py-10  ">
              <CarouselItem className=" basis-1/2" key={0}>
                <Card
                  onClick={() => Router.push("/notes/landing")}
                  className="h-[80svh] w-[50svw] flex justify-center landingCard ml-5  "
                >
                  <div>
                    <p className=" font-roboto text-[30px] mt-[5svh] font-bold   text-[rgba(0,0,0,.6)] ">
                      Create Notes
                    </p>
                  </div>
                  <video
                    className="-ml-[10svw] "
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
                </Card>
              </CarouselItem>

              <CarouselItem className="ml-[7.5svw] basis-1/3" key={1}>
                <Card
                  onClick={() => {}}
                  className="h-[20svh] w-[33svw] flex justify-center   ml-[8svw] mt-[15svh] mx-5 flex-1 flex-col px-5"
                >
                  <div className="button-group  flex h-10 text-center text-sm justify-center justify-items-center pt-2 mb-2">
                    <NextButton variant="outline">
                      <PilcrowIcon />
                    </NextButton>

                    <NextButton variant="outline">
                      <FontBoldIcon />
                    </NextButton>

                    <NextButton variant="outline">
                      <FontItalicIcon />
                    </NextButton>

                    <NextButton variant="outline">
                      <StrikethroughIcon />
                    </NextButton>

                    <NextButton variant="outline">
                      <FaHighlighter />
                    </NextButton>

                    <NextButton variant="outline">
                      <TextAlignLeftIcon />
                    </NextButton>

                    <NextButton variant="outline">
                      <TextAlignCenterIcon />
                    </NextButton>

                    <NextButton variant="outline">
                      <TextAlignRightIcon />
                    </NextButton>

                    <NextButton variant="outline">
                      <TextAlignJustifyIcon />
                    </NextButton>

                    <NextButton variant="outline">
                      <FaListOl />
                    </NextButton>

                    <NextButton variant="outline">
                      <FaListUl />
                    </NextButton>
                  </div>
                  <Textarea
                    className="h-20 resize-none mx-auto  "
                   
                      
                  
                  >Take your notes online with a rich text editor and chat with your selected notes with a custom AI agent and study your terms with quizzes or tests</Textarea>

                  {/* <p className="text-center  text-slate-600">Take your notes online with a rich text editor and chat with your selected notes with a custom AI agent and study your terms with quizzes or tests</p>
                   */}
                </Card>
                <div>
           
                </div>
              </CarouselItem>
              {/* <CarouselItem className="  basis-1/2" key={1}>
              <Card
                onClick={() => Router.push("/chat")}
                className="h-[80svh] w-[50svw] landingCard"
              >
                <div className="text-left font-roboto text-[30px]  text-center">
                  Talk to your Notes
                </div>
                <video width="500" height="500" controls preload="none">
      <source src='/videos/cursorful-notes.mp4' type="video/mp4" />
      <track
        src='/videos/cursorful-notes.mp4'
        kind="subtitles"
        srcLang="en"
        label="English"
      />
      Your browser does not support the video tag.
    </video>
              </Card>
            </CarouselItem>
            <CarouselItem className="  basis-1/2" key={2}>
              <Card
                onClick={() => Router.push("/study")}
                className="h-[80svh] w-[50svw] flex justify-center landingCard"
              >
                <div className="text-left font-roboto text-[30px]   text-center">
                  Study Notes
                </div>
                <video width="500" height="500" controls preload="none">
      <source src='/videos/cursorful-notes.mp4' type="video/mp4" />
      <track
        src='/videos/cursorful-notes.mp4'
        kind="subtitles"
        srcLang="en"
        label="English"
      />
      Your browser does not support the video tag.
    </video>
              </Card>
            </CarouselItem>
            <CarouselItem className="  basis-1/2" key={3}>
              <Card
                onClick={() => Router.push("/learn/flashcard/create")}
                className="h-[80svh] w-[50svw] flex justify-center landingCard"
              >
                <div className="text-left font-roboto text-[30px]  ">
                  Create Flashcards
                </div>
                <video width="500" height="500" controls preload="none">
      <source src='/videos/cursorful-notes.mp4' type="video/mp4" />
      <track
        src='/videos/cursorful-notes.mp4'
        kind="subtitles"
        srcLang="en"
        label="English"
      />
      Your browser does not support the video tag.
    </video>
              </Card>
            </CarouselItem> */}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </Layout>
   
  );
};

export default Blog;
