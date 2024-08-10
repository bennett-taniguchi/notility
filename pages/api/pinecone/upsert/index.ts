import { getServerSession } from "next-auth/next";
import { options as authOptions } from "../../auth/[...nextauth]";
import prisma from "../../../../lib/prisma";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
import { Pinecone } from "@pinecone-database/pinecone";
export default async function handle(req, res) {
  const { batch } = req.body;

  const session = await getServerSession(req, res, authOptions);

  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY as string,
  });

  let index = pc.index("notility");
  let namespace = session.user.email;

  const result = await index.namespace(namespace).upsert(batch);

  res.json(result);
}
