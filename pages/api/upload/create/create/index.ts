import { getServerSession } from "next-auth/next";

import { getSession } from "next-auth/react";
import prisma from "../../../../../lib/prisma";
import { Notespace, Upload } from "@prisma/client";
import { options } from "../../../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { upload } = req.body;

  const session = await getServerSession(req, res, options);

 
   let convertedUpload=({ ...upload, owner: session?.user.email });
 
  try {
    let result = await prisma.upload.create({
      data: {...convertedUpload as Upload},
    });

    res.json({ result });
  } catch (e) {
    console.log(e);
  }
}
