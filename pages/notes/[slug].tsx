import { useRouter } from "next/router";

// export default function Page() {
//   const router = useRouter();
//   console.log(router.query.slug);
//   return <div>landing</div>;
// }

import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { useSession, getSession } from "next-auth/react";
import Layout from "../../components/Layout";
import { PostProps } from "../../components/Post";
import prisma from "../../lib/prisma";
import Router from "next/router";
import Note from "../../components/Note";

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

const Notes: React.FC<Props> = (props) => {
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
      <Layout>
        <Note props={{ ...props, query }} />
      </Layout>
    );

  return <div>Data is invalid</div>;
};

export default Notes;
