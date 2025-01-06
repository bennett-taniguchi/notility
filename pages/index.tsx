import React, { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useRouter } from "next/router";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import { a, animated, useScroll, useSpring, useTrail } from "@react-spring/web";
import { Button } from "../components/ui/button";
import Link from "next/link";
import { Separator } from "@radix-ui/react-menubar";
// import  NotesDemo from '../public/videos/cursorful-notes.mp4' as any

const Blog = () => {
 
  const Trail: React.FC<{ open: boolean }> = ({ open, children }) => {
    const items = React.Children.toArray(children);
    const trail = useTrail(items.length, {
      config: { mass: 20, tension: 2000, friction: 200 },
      opacity: open ? 1 : 0,
      x: open ? 0 : 20,
      height: open ? 110 : 0,
      from: { opacity: 0, x: 20, height: 0 },
    });
    return (
      <div>
        {trail.map(({ height, ...style }, index) => (
          <a.div key={index} style={style}>
            <a.div style={{ height }}>{items[index]}</a.div>
          </a.div>
        ))}
      </div>
    );
  };
 

  const alignCenter = { display: "flex", alignItems: "center" };
  return (
    <Layout>
      
      <div  className="  bg-gradient-to-r from-yellow-200 from-1% via-emerald-500 via-30% to-yellow-200 to-100%  to h-[100svh] w-[100svw] ">
        <Parallax pages={7}   className="no-scrollbar">
          <ParallaxLayer
            offset={0}
            speed={0.5}
            style={{ ...alignCenter, justifyContent: "center" }}
          >
            <div
              className={
                "w-[20svw] h-[20svh]  bg-transparent border-transparent flex flex-col  "
              }
            >
              <Trail open={true}>
                <h1 className=" mt-[2svh] font-roboto text-[70px]  text-center  font-extrabold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.9)]  text-[rgba(0,0,0,.5)] mb-[5svh]">
                  Notility
                </h1>

                <div className="text-center font-md text-[rgba(0,0,0,.5)]  mt-[20svh]">
                  Scroll down
                </div>
              </Trail>
            </div>
          </ParallaxLayer>

          <ParallaxLayer
            sticky={{ start: 1, end: 3 }}
            style={{ ...alignCenter, justifyContent: "flex-start" }}
          >
            <Card
              className={
                " w-[45svw] h-[65svh] spectrum-background ml-[10svw] border-transparent "
              }
            >
              <CardHeader>
                <div>
                  <div className="flex flex-row">
                    <div className=" font-roboto text-[30px]   font-bold   text-[rgba(0,0,0,.6)] basis-4/5">
                      Notespace Layout
                    </div>
                    <Link href="/notespace/">
                      <Button className=" basis-1/5 bg-[rgba(0,0,0,.7)] mt-[1svh] ml-[2svw] landingCard">
                        Notespace
                      </Button>
                    </Link>
                  </div>
                </div>
                <CardDescription className=" font-roboto text-[15px]   font-lg   text-[rgba(0,0,0,.6)]">
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
                  <source src="/videos/cursorful-notes.mp4" type="video/mp4" />
                  <track
                    src="/videos/cursorful-notes.mp4"
                    kind="subtitles"
                    srcLang="en"
                    label="English"
                  />
                  Your browser does not support the video tag.
                </video>
              </CardContent>
            </Card>
          </ParallaxLayer>

          <ParallaxLayer
            offset={1.5}
            speed={1.5}
            sticky={{ start: 2, end: 3 }}
            style={{ ...alignCenter, justifyContent: "flex-end" }}
            className="pointer-events-none"
          >
            <div
              className={
                "   w-[20svw] h-[20svh] bg-transparent mr-[20svw] border-transparent mb-[20svh]"
              }
            >
              <CardTitle>
                <p className="font-roboto text-[30px]   font-bold   text-[rgba(0,0,0,.6)] ">
                  Enhance your note taking with custom AI expertise
                </p>{" "}
              </CardTitle>
              <CardDescription className=" font-roboto text-[18px]   font-lg   text-[rgba(0,0,0,.6)]">
                <>
                  Struggling to organize your thoughts or make sense of your
                  notes? With our online rich text editor, you can easily type
                  out your ideas, format them however you like, and even share
                  them with an AI chatbot. Why would you want to do that?
                  Because the AI can help you understand what you're trying to
                  say, offer suggestions, or even explain your notes back to you
                  in a way that makes sense. It's like having a super-smart
                  study buddy or brainstorming partner always ready to help. No
                  tech skills needed—just start typing, and let the AI do the
                  heavy lifting!
                </>
              </CardDescription>
            </div>
          </ParallaxLayer>

          <ParallaxLayer
            offset={2.5}
            speed={1.5}
            sticky={{ start: 4, end: 5 }}
            style={{ ...alignCenter, justifyContent: "flex-end" }}
          >
            <Card
              className={
                "w-[45svw] h-[65svh] spectrum-background mr-[5svw] border-transparent "
              }
            >
              <CardHeader>
                <CardTitle>
                  {" "}
                  <div className="flex flex-row">
                    <div className=" font-roboto text-[30px]   font-bold   text-[rgba(0,0,0,.6)] basis-4/5">
                      Premium
                    </div>
                    <Link href="/premium/index">
                      <Button className=" basis-1/5 bg-[rgba(0,0,0,.7)] z-20 mt-[1svh] ml-[2svw] landingCard">
                        Go to Premium
                      </Button>{" "}
                    </Link>
                  </div>
                </CardTitle>
                <CardDescription className=" font-roboto text-[15px]   font-lg   text-[rgba(0,0,0,.6)]">
                  Select your notes and create a custom chatbot that is an
                  expert of your choice
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
                  <source src="/videos/cursorful-chat.mp4" type="video/mp4" />
                  <track
                    src="/videos/cursorful-notes.mp4"
                    kind="subtitles"
                    srcLang="en"
                    label="English"
                  />
                  Your browser does not support the video tag.
                </video>
              </CardContent>
            </Card>
          </ParallaxLayer>

          <ParallaxLayer
            offset={2.5}
            speed={1.5}
            sticky={{ start: 4, end: 5 }}
            style={{ ...alignCenter, justifyContent: "flex-start" }}
            className="pointer-events-none"
          >
            <div
              className={
                "mb-[22svh] ml-[20svw]   w-[20svw] h-[20svh] bg-transparent   border-transparent "
              }
            >
              <CardTitle>
                <p className="font-roboto text-[30px]   font-bold   text-[rgba(0,0,0,.6)] ">
                  Improve your understanding by talking to AI
                </p>{" "}
              </CardTitle>
              <CardDescription className=" font-roboto text-[18px]   font-lg   text-[rgba(0,0,0,.6)]">
                <div>
                  Need help mastering your notes? Our chat feature lets you
                  select notes and send it to an AI chatbot that’s like an
                  expert on whatever you’re working on. Whether you’re studying
                  for an exam, trying to understand a tricky concept, or
                  brainstorming ideas, the chatbot breaks things down, answers
                  questions, and gives insights tailored to your notes. It’s the
                  ultimate tool for learning smarter and getting clarity on
                  complex topics—all with just a few clicks.
                </div>
              </CardDescription>
            </div>
          </ParallaxLayer>

          <ParallaxLayer
            offset={2.5}
            speed={1.5}
            sticky={{ start: 6, end: 7 }}
            style={{ ...alignCenter, justifyContent: "flex-start" }}
            className="pointer-events-none"
          >
            <div
              className={
                "mb-[22svh] mx-auto w-[20svw] h-[20svh] bg-transparent   border-transparent "
              }
            >
              <CardTitle>
                <p className="font-roboto text-[30px]   font-bold   text-[rgba(0,0,0,.6)] ">
                  Solidify your knowledge with specialized learning
                </p>{" "}
              </CardTitle>
              <CardDescription className=" font-roboto text-[18px]   font-lg   text-[rgba(0,0,0,.6)]">
                <div>
                  Level up your studying with our flashcards! Create custom
                  cards, test yourself, and track what you’ve mastered—all in
                  one place. Whether you’re prepping for an exam or just trying
                  to nail the basics, our flashcard feature makes it easy to
                  stay focused and retain what you’ve learned. Plus, the
                  built-in testing helps you see what needs more work, so you
                  can study smarter, not harder.
                </div>
                <div className="align-items-center">

              
                <Link href='/learn'>
                <Button  className=" pointer-events-auto basis-1/5 bg-[rgba(0,0,0,.7)] mt-[5svh] ml-[6svw]   landingCard">
                  Try it out
                </Button>
                </Link>
                </div>

              </CardDescription>
            </div>
          </ParallaxLayer>
          
        </Parallax>
      </div>
    </Layout>
  );
};

export default Blog;
