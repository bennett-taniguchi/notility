import { getServerSession } from "next-auth/next";
import prisma from "../../../../../lib/prisma";
import { options as authOptions } from "../../../auth/[...nextauth]";

// POST /api/save
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
    const query = req.query.title;

  const session = await getServerSession(req, res, authOptions);

 
  const result = await prisma.flashcard.findUnique({
    where: { title_authorId:{
      title: query,
      authorId: session!.id,
    }},
  });

  res.json(result);
}

// use less