import { getServerSession } from "next-auth/next";
import { options as authOptions } from "../../auth/[...nextauth]";
import prisma from "../../../../lib/prisma";

// bad practice of conditional calls, probably move this to clientside
export default async function handle(req, res) {
  const { cardName } = req.body;
  const session = await getServerSession(req, res, authOptions);

  const result = await prisma.flashcard.delete({
    where: { authorId_title: { authorId: session.id, title: cardName } },
  });

  res.json(result);
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
