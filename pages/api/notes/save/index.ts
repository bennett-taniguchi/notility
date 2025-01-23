import { getServerSession } from "next-auth/next";
import { options as authOptions } from "../../auth/[...nextauth]";
import prisma from "../../../../lib/prisma";

// POST /api/save
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  const { title, content,uri } = req.body;

  const session = await getServerSession(req, res, authOptions);
  const result = await prisma.notes.upsert({
    create: {
      title: title,
      content: content,

      author: { connect: { email: session?.user?.email } },
      createdBy: 'User'
    },
    update: {
      title: title,
      content: content,
      author: { connect: { email: session?.user?.email } },
    },
    where: {
     title_uri:{title:title,uri:uri}
    },
  });
  res.json(result);
}
