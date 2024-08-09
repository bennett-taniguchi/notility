// create flashcards, test questions, tests, studying games...

// there is some tools api on openai, might be good to look into that.
//// if i had to go off of what is offered it looks like (chat and learn agnostic):

// use filesearch on pre seeded or user inputted pdfs to test rote memorization / make flashcards / make tests too
// -> flashcards, tests, vocab terms
// use code interpreter for anything math and code related that can be solved with python packages
// -> study math/cse, create viz
// use functions to define the notecard creation function, might confer an advantage over prompting how to create notecards everytime:
// -> create notecards, tables, graphs, and cs-graphs

import { useRouter } from "next/router";
import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { useSession, getSession } from "next-auth/react";
import Layout from "../../components/Layout";
import { PostProps } from "../../components/Post";
import prisma from "../../lib/prisma";
import Router from "next/router";

// import learn

// retrieve notes and messages with chatbot, don't need to fetch both if only one is needed...
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });

  if (!session) {
    res.statusCode = 403;
    return { props: { notes: [] } };
  }

  const notes = await prisma.notes.findMany({
    where: {
      author: { email: session?.user?.email },
    },
  });

  return {
    props: { notes },
  };
};

export type Props = {
  notes: PostProps[];
};

const Learn: React.FC<Props> = (props) => {
  const { data: session } = useSession();
  const router = useRouter();
  const query = router.query.slug;

  if (!session) {
    return (
      <Layout>
        <h1>My Notes</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    );
  }

  if (props)
    return (
      <Layout children={undefined}>
        {/* <Note props={{ ...props, query }} /> */}
      </Layout>
    );

  return <div>Data is invalid</div>;
};

export default Learn;
