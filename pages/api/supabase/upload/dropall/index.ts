import { getServerSession } from "next-auth/next";

import { getSession } from "next-auth/react";
import prisma from "../../../../../lib/prisma";
import { Notespace, Upload } from "@prisma/client";
import { options } from "../../../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "DELETE") return res.status(405).end();
const session = await getServerSession(req,res,options)
  try {
    let result = await prisma.upload.deleteMany({
      where:{owner:session.user.email}
    });

    res.json({ result });
  } catch (e) {
    console.log(e);
  }
}
