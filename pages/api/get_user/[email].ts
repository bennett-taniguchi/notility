import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  // const email = req.body.email;

  // can do find unique or throw and implement post if none
  const result = await prisma.user.findUnique({
    where: {
      email: req.query.email,
    },
  });
  res.json(result);
}
