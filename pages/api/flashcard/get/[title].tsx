import { getServerSession } from "next-auth/next";
import { options as authOptions } from "../../auth/[...nextauth]";
import prisma from "../../../../lib/prisma";

// POST /api/save
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  const query = req.query.title;

  const session = await getServerSession(req, res, authOptions);

  let parsed = JSON.parse(query);
  let titles: string[];
  if (Array.isArray(parsed)) {
    titles = parsed;
  } else {
    titles = [parsed];
  }

  console.log(titles);
  const result = await prisma.card.findMany({
    where: {
      title: { in: titles },
      authorId: session!.id,
    },
  });

  res.json(result);
}

// use less
