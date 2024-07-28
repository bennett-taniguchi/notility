// import { getServerSession } from "next-auth/next";
// import { options as authOptions } from "../auth/[...nextauth]";
// import prisma from "../../../lib/prisma";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
import { Pinecone } from "@pinecone-database/pinecone";
export default async function handle(req, res) {
  const { title, content } = req.body;

  //const session = await getServerSession(req, res, authOptions);

  const pc = new Pinecone({
    apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY as string,
  });

  let index = pc.index("test");

  const records = [
    {
      id: "A",
      values: [0.1, 0.1, 0.1],
      metadata: { genre: "comedy", year: 2020 },
    },
    {
      id: "B",
      values: [0.2, 0.2, 0.2],
      metadata: { genre: "documentary", year: 2019 },
    },
  ];

  try {
    await index.upsert(records);
  } catch (err) {
    console.log(err);
    console.error(err);
  }
}
