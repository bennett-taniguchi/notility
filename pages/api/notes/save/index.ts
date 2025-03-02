import { getServerSession } from "next-auth/next";
import { options as authOptions } from "../../auth/[...nextauth]";
import prisma from "../../../../lib/prisma";

// POST /api/save
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  const d = new Date();
  const { title, content, uri } = req.body;
  console.log("api", req.body);
  const session = await getServerSession(req, res, authOptions);
  const result = await prisma.notes.upsert({
    create: {
      title: title,
      content: content,

      author: { connect: { email: session?.user?.email } },
      notespace: { connect: { uri: uri } },
      createdBy: session?.user?.email,
      createdOn: d.toDateString(),
      sources: 0,
    },
    update: {
      title: title,
      content: content,
      author: { connect: { email: session?.user?.email } },
    },
    where: {
      title_uri: { title, uri },
    },
  });
  res.json(result);
}
