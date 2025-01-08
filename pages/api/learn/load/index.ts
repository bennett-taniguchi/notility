import { getServerSession } from "next-auth/next";
import { options as authOptions } from "../../auth/[...nextauth]";
import prisma from "../../../../lib/prisma";

export default async function handle(req, res) {
  const session = await getServerSession(req, res, authOptions);

  const result = await prisma.message.findMany({
    where: { authorId: session.id },
  });

  res.json(result);
}
