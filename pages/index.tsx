import React from "react";
import { GetStaticProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import prisma from "../lib/prisma";
import { Card } from "../components/ui/card";
import Link from "next/link";
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
const cardArr = [];
const Blog = () => {
  return (
    <Layout>
      <div className="page w-page h-screen spectrum-background overflow-hidden">
        <h1 className="text-left font-roboto text-[90px]  text-center">
          Notility
        </h1>

 
        <Carousel opts={{
        align: "center", loop:true
      }}  plugins={[
        Autoplay({
          delay: 3000, 
        }),
      ]}
      className="w-40svw overflow-hidden  pl-10 pb-10">
          <CarouselContent className=" py-10  ">
            <CarouselItem className=" basis-1/3  " key={0}>
              <Card className="h-[80svh] w-[30svw] flex justify-center landingCard">
                <div className="text-left font-roboto text-[30px]   text-center">
                  <Link href="/notes/landing">Create Notes</Link>
                </div>
              </Card>
            </CarouselItem>
            <CarouselItem className="  basis-1/3" key={1}>
            
              <Card className="h-[80svh] w-[30svw] landingCard">
              
                <div className="text-left font-roboto text-[30px]  text-center">
                  <Link href="/chat">Analyze Notes</Link>
                </div>
              </Card>
            </CarouselItem>
            <CarouselItem className="  basis-1/3" key={2}>
             
              <Card className="h-[80svh] w-[30svw] flex justify-center landingCard">
                
                <div className="text-left font-roboto text-[30px]   text-center">
                  <Link href="/learn">Study Notes</Link>
                </div>
              </Card>
            </CarouselItem> 
            <CarouselItem className="  basis-1/3" key={3}>
              <Card className="h-[80svh] w-[30svw] flex justify-center landingCard">
                <div className="text-left font-roboto text-[30px]  ">
                  Search Notes
                </div>
              </Card>
            </CarouselItem>
          </CarouselContent >
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      
 
      </div>
    </Layout>
  );
};

export default Blog;
