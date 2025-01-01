import React from "react";
import Layout from "../components/Layout";
import { Card } from "../components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import { useRouter } from "next/router";
import ReactPlayer from "react-player";
// import  NotesDemo from '../public/videos/cursorful-notes.mp4' as any

const Blog = () => {
  const Router = useRouter();
  return (
    <Layout>
      <div className="page w-page h-screen spectrum-background overflow-hidden">
        <h1 className="text-left font-roboto text-[90px]  text-center">
          Notility
        </h1>

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
          className="w-40svw overflow-hidden  pl-20 pb-10"
        >
          <CarouselContent className=" py-10  ">
            <CarouselItem className=" basis-1/2" key={0}>
              <Card
                onClick={() => Router.push("/notes/landing")}
                className="h-[80svh] w-[50svw] flex justify-center landingCard "
              >
                <div  >
                  <p className=" font-roboto text-[30px] mt-[5svh]" >
                  Create Notes
                  </p>
                </div>
                <video  className="-ml-[10svw] "width="800" height="700" controls={false} preload='auto' autoPlay={true} loop muted>
                  <source src="/videos/cursorful-notes.mp4" type="video/mp4" />
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
    </Layout>
  );
};

export default Blog;
