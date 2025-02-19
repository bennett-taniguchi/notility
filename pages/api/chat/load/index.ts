import { getServerSession } from "next-auth/next";
import { options as authOptions } from "../../auth/[...nextauth]";
import prisma from "../../../../lib/prisma";

export default async function handle(req, res) {
  const {uri} = req.query;
  

  const result = await prisma.message.findMany({
    where: { uri: uri },
  });

  res.json(result);
}
