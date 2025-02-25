import { getServerSession } from "next-auth/next";
import { options as authOptions } from "../../auth/[...nextauth]";
import prisma from "../../../../lib/prisma";
import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});
// POST /api/save
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  const d = new Date()
  const { title, content,uri } = req.body;
   // 6) Create Message using openai api call
   const completion = await openai.chat.completions.create({
    messages: [{ role: "assistant", content: "You are a helpful assistant. You aim to create a guide on how to understand information or achieve a process based on what the user tells you. Ensure that you use sequential steps or iterative logic to help the user understanding the information they give you in a following message."},{role:'user',content:content} ],
    model: "gpt-4o",
    store: true,
  });

  let response = completion.choices[0].message.content as string;
  const session = await getServerSession(req, res, authOptions);
  const result = await prisma.notes.upsert({
    create: {
      
      title: title,
      content: response,
    
      
      author: { connect: { email: session?.user?.email } },
      notespace:{connect: {uri: uri}},
      createdBy: session?.user?.email,
      createdOn:d.toDateString(),
      sources: 0
    },
    update: {
      title: title,
      content: response,
      author: { connect: { email: session?.user?.email } },
    },
    where: {
     title_uri:{title,uri}
    },
  });
  res.json(result);
}
