import { getServerSession } from "next-auth/next";
import { options as authOptions } from "../../../auth/[...nextauth]";
import prisma from "../../../../../lib/prisma";
import type { Flashcard } from "@prisma/client";

// bad practice of conditional calls, probably move this to clientside
export default async function handle(req, res) {
  const { title, description, cards } = req.body;
  const session = await getServerSession(req, res, authOptions);

  let flashcards = [] as any[];
  for (let i = 0; i < cards.length; i++) {
    flashcards.push({
      term: cards[i].front as string,
      answer: cards[i].back as string,
    });
  }

  const result = await prisma.flashcard.update({
    where: {
      title_authorId: {
        authorId: session.id,
        title: title,
      },
    },
    data: {
      title,
      authorId: session.id,
      description,
      rating: 0,
      practiceCount: 0,
      last_practiced: (new Date()).toDateString(),
      cards: {
        deleteMany: {}, // Clear old cards
        create: flashcards, // Add new cards
      },
    },
  });

  res.json(result);
}