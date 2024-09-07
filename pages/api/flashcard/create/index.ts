import { getServerSession } from "next-auth/next";
import { options as authOptions } from "../../auth/[...nextauth]";
import prisma from "../../../../lib/prisma";

// bad practice of conditional calls, probably move this to clientside
export default async function handle(req, res) {
  const { title, description, cards } = req.body;
  const session = await getServerSession(req, res, authOptions);

  type Card = {
    term: string;
    answer: string;
    authorId: string;
  };

  let flashcards = [] as Card[];
  for (let i = 0; i < cards.length; i++) {
    flashcards.push({
      term: cards[i].front,
      answer: cards[i].back,
      authorId: session.id,
    });
  }

  const result = await prisma.flashcard.create({
    data: {
      title: title,
      authorId: session.id,
      description: description,
      rating: 0,
      practiceCount: 0,
      cards: { create: flashcards },
    },
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
