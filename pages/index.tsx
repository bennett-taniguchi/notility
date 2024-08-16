import React from "react";
import { GetStaticProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import prisma from "../lib/prisma";
import { Card } from "../components/ui/card";
import Link from "next/link";

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
  });

  return {
    props: { feed },
    revalidate: 10,
  };
};

type Props = {
  feed: PostProps[];
};

const Blog: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="page w-page h-screen spectrum-background">
        <h1 className="text-left font-roboto text-[90px]  text-center pb-[20px]">
          Notility
        </h1>

        <div className="grid grid-cols-3 justify-items-center pb-[40px]">
          <Card className="h-[700px] w-[500px] flex justify-center landingCard">
            <div className="text-left font-roboto text-[45px]   text-center">
              <Link href="/notes/landing">Create Notes</Link>
            </div>
          </Card>
          <Card className="h-[700px] w-[500px] landingCard">
            {" "}
            <div className="text-left font-roboto text-[45px]  text-center">
              <Link href="/chat">Analyze Notes</Link>
            </div>
          </Card>
          <Card className="h-[700px] w-[500px] flex justify-center landingCard">
            {" "}
            <div className="text-left font-roboto text-[45px]   text-center">
              <Link href="/learn">Study Notes</Link>
            </div>
          </Card>
        </div>

        <div className="bg-zinc-200 py-[200px] grid grid-cols-3 gap-4 justify-items-center">
          <div>a</div>
          <Card className="h-[700px] w-[500px] flex justify-center">
            <div className="text-left font-roboto text-[45px] text-[rgb(103,232,200,.8)] ">
              Search Notes
            </div>
          </Card>
          <div>a</div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
