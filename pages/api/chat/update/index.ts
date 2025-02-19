// easier to chain api calls here then in the client side, and it makes sense in fact, so i could rename this

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
  const { prompt, messages, uri } = req.body;
  const session = await getServerSession(req, res, authOptions);

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "Given a user query, expand it to be more specific and detailed while maintaining the original intent. Include relevant synonyms and related concepts." },
      ...messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user", content: prompt },
    ],
    model: "gpt-4o-mini",
  });

  //console.log(completion.choices[0]); // do use this

  // response (role = 'user') items
  let content_user = prompt;

  // response (role = 'system') items
  let content_system = completion.choices[0].message.content as string;

  const result = await prisma.message.createMany({
    data: [
      {
        uri:uri,
        index: messages.length + 1,
        content: content_user,
        authorId: session.id,
        role: "user",
        title: "",
      },
      {
        uri:uri,
        index: messages.length + 2,
        content: content_system,
        authorId: session.id,
        role: "system",
        title: "",
      },
    ],
  });

  res.json(result);
}
