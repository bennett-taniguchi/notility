import { getServerSession } from "next-auth/next";
import { options as authOptions } from "../../auth/[...nextauth]";
import prisma from "../../../../lib/prisma";

// change to delete single when titles are unique
export default async function handle(req, res) {
  const query = req.query.title;
  const session = await getServerSession(req, res, authOptions);
  const result = await prisma.notes.deleteMany({
    where: {
      title: query,
      author: session!.user!,
    },
  });
  res.json(result);
}

// use less
