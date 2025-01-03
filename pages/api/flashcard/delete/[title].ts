import { getServerSession } from "next-auth/next";
import { options as authOptions } from "../../auth/[...nextauth]";
import prisma from "../../../../lib/prisma";
import { Flashcard } from "@prisma/client";

// bad practice of conditional calls, probably move this to clientside
export default async function handle(req, res) {
  const  title  = req.query.title;
   
 
  const session = await getServerSession(req, res, authOptions);
 
  
 
 const result = await prisma.flashcard.delete({
    where: {  title_authorId: { authorId: session.id, title: title } },
  });

 
 
res.json(result);
}