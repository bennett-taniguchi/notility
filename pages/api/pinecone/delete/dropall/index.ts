import { getServerSession } from "next-auth/next";
import { options as authOptions } from "../../../auth/[...nextauth]";
import prisma from "../../../../../lib/prisma";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
import { Pinecone } from "@pinecone-database/pinecone";
export default async function handle(req, res) {
 

 

  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY as string,
  });

   await pc.deleteIndex('notespace');

 
  
 
}
