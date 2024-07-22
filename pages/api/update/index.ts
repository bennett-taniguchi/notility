import { getServerSession } from "next-auth/next";
import { options as authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const { title, content, oldTitle } = req.body;

  const session = await getServerSession(req, res, authOptions);
  if (content === "") {
    const result = await prisma.notes.update({
        where: {
            title: oldTitle,
            author: { session?.user}
        },
      data: {
        title: title,
        //   content: content,
        author: { connect: { email: session?.user?.email } },
      },
    });
  } else {
    const result = await prisma.notes.update({
        where: {
            title: oldTitle,
            author: { session?.user}
        },
      data: {
        title: title,
        content: content,
        author: { connect: { email: session?.user?.email } },
      },
    });
  }

  res.json(result);
}
