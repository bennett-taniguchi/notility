import { getServerSession } from "next-auth/next";
import { options as authOptions } from "../../../auth/[...nextauth]";
import prisma from "../../../../../lib/prisma";
import { Flashcard } from "@prisma/client";

 
export default async function handle(req, res) {
  const  title  = req.query.title;
   
  const session = await getServerSession(req, res, authOptions);
 
  
 
  const result = await prisma.flashcard.updateMany({
    where: {
      
        authorId: session.user.id, // Assuming session.user.id contains the authorId
        title: title,
      
    }, 
    data: {
        last_practiced: 
        (new Date()).toDateString()
    }
  });

 
res.json(result);
}

 