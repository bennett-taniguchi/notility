import { getServerSession } from "next-auth/next";
import { options as authOptions } from "../../auth/[...nextauth]";
import prisma from "../../../../lib/prisma";
import { resourceLimits } from "worker_threads";

// change to delete single when titles are unique
export default async function handle(req, res) {
  const { uri } = req.body;
  const session = await getServerSession(req, res, authOptions);
  const result = await prisma.message.deleteMany({
    where: {
      authorId: session!.id,
      uri: uri,
    },
  });

 
 res.json(result)
}

// use less