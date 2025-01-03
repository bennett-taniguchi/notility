import { getServerSession } from "next-auth/next";
import { options as authOptions } from "../../auth/[...nextauth]";
import prisma from "../../../../lib/prisma";

// bad practice of conditional calls, probably move this to clientside
export default async function handle(req, res) {
  const { title, difficulty, oldTitle } = req.body;
  const session = await getServerSession(req, res, authOptions);
console.log(difficulty,difficulty=='🟩')
  let new_difficulty = 0;
  if (difficulty == "🟩") new_difficulty = 0;
  if (difficulty == "🟨") new_difficulty = 1;
  if (difficulty == "🟥") new_difficulty = 2;

  const result = await prisma.flashcard.update({
    where: {
      title_authorId: {
        title: oldTitle,
        authorId: session.id,
      },
    },
    data: {
      title: title,

      rating: new_difficulty,
    },
  });

  res.json(result);
}
