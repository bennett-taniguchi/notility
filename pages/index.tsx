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
 
import { animated, useScroll, useSpring } from "@react-spring/web";
// import  NotesDemo from '../public/videos/cursorful-notes.mp4' as any

const Blog = () => {
  const Router = useRouter();
  //const [scrollY,setScrollY] = useState(0)
  const containerRef = useRef(null!)

  // const [textStyles, textApi] = useSpring(() => ({
  //   y: '100%',
  // }))

  
  const [styles, api] = useSpring(() => ({
    transform: "translateX(0px)",
    config: { mass: 1, tension: 170, friction: 26 },
  }));

  
  useEffect(() => {
    const handleScroll = () => {
      // Get scroll position and calculate desired translation
      const scrollPosition = window.scrollY;
      // You can adjust the division factor to control movement speed
      const translation = scrollPosition / 2;
      
      // Update spring animation
      api.start({
        transform: `translateX(${translation}px)`,
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [api]);
 
 

  return (
    <Layout >
      <div className={"page w-page h-[200svh]  spectrum-background "} ref={containerRef}>
        <h1 className="  font-roboto text-[70px]  text-center  font-extrabold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.9)]  text-[rgba(0,0,0,.5)] mb-[5svh]">
          Notility
      
        </h1>
 
       
      
              <animated.div
              style={styles}
              
                onClick={() => Router.push("/notes/landing")}
                className={("h-[65svh] w-[48svw]  landingCard ml-5 fixed bg-white rounded-md")}
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
              </animated.div>
              
          
      </div>
    </Layout>
  );
};

export default Blog;
