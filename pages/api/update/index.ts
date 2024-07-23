import { getServerSession } from "next-auth/next";
import { options as authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";

// bad practice of conditional calls, probably move this to clientside
export default async function handle(req, res) {
  const { title, content, oldTitle } = req.body;
  const session = await getServerSession(req, res, authOptions);

  const result = await prisma.notes.update({
    where: {
      title_authorId: {
        title: oldTitle,
        authorId: session.id,
      },
    },
    data: {
      title: title,
      authorId: session.id,
    },
  });

  res.json(result);
}
