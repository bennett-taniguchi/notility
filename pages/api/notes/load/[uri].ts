import { getServerSession } from "next-auth/next";
import { options as authOptions } from "../../auth/[...nextauth]";
import prisma from "../../../../lib/prisma";

// POST /api/save
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  const query = req.query.uri;
  const session = await getServerSession(req, res, authOptions);
  const result = await prisma.notes.findMany({
    where: {
      uri: query,
      author: session!.user!,
    },
  });
  res.json(result);
}

// use less
