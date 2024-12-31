import { getServerSession } from "next-auth/next";
import { options as authOptions } from "../../auth/[...nextauth]";
import prisma from "../../../../lib/prisma";
import { Flashcard } from "@prisma/client";

// bad practice of conditional calls, probably move this to clientside
export default async function handle(req, res) {
  const  {cardName}  = req.body;
   
  const session = await getServerSession(req, res, authOptions);
 console.log(cardName,session.id)
  
 
  const result = await prisma.card.deleteMany({
    where: {
      
        authorId: session.user.id, // Assuming session.user.id contains the authorId
        title: cardName,
      
    },
  });

 
 
res.json(result);
}

 
// title and description are correct

// cards only contains front and back
// need to map and add authorId to each

// flashCard will initialize w/ authorId, title, description
// and rating 0 (invis) 1 = green, 2 = yellow, 3 = red
// practiceCount should be moved to a date array, for progress tracking

// also description is optional clientside and required in prisma
// change it
