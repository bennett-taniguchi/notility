import prisma from "../../../../lib/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const { uuid } = req.query;

  const session = await getSession({ req });

  const result = await prisma.notespace.findUnique({
    where: {
      uri: uuid,
    },
  });

  res.json({ result });
}
