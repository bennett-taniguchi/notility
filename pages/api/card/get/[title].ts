import { getServerSession } from "next-auth/next";
import { options as authOptions } from "../../auth/[...nextauth]";
import prisma from "../../../../lib/prisma";

// POST /api/save
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  const query = req.query.title;
  const session = await getServerSession(req, res, authOptions);
  const result = await prisma.flashcard.findFirst({
    where: {
      title: query,
      authorId: session!.id,
    },
  });
  res.json(result);
}

// use less
