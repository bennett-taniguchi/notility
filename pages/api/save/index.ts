import { getServerSession } from "next-auth/next";
import { options as authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";

// POST /api/save
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  const { title, content } = req.body;

  const session = await getServerSession(req, res, authOptions);
  const result = await prisma.notes.create({
    data: {
      title: title,
      content: content,
      author: { connect: { email: session?.user?.email } },
    },
  });
  res.json(result);
}