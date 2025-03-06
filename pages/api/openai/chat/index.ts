import OpenAI from "openai";
import { getServerSession } from "next-auth/next";
import { options as authOptions } from "../../auth/[...nextauth]";
import prisma from "../../../../lib/prisma";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

// THIS API ENDPOINT IS UNUSED AND IS POTENTIALLY USEFUL FOR CHATTING IN the FUTURE

// {"role": "system", "content": "You are a helpful assistant."},
// {"role": "user", "content": "message 1 content."},
export default async function handle(req, res) {
  const { prompt } = req.body;
 
    console.log('before summarizing')
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
            role: "user",
            content: prompt,
        },
    ],
  });
  
 
  res.json(completion.choices[0].message).content;
}
