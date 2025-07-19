import OpenAI from "openai";
import { getServerSession } from "next-auth/next";
import { options as authOptions } from "../../auth/[...nextauth]";
import prisma from "../../../../lib/prisma";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

// {"role": "system", "content": "You are a helpful assistant."},
// {"role": "user", "content": "message 1 content."},
export default async function handle(req, res) {
  const { prompt, messages } = req.body;
  const session = await getServerSession(req, res, authOptions);

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      ...messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user", content: prompt },
    ],
    model: "gpt-4.1-nano",
  });

  res.json(completion);
}
